import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, ".env.analytics.local");
const OUT_DIR = path.join(ROOT, "docs", "analytics");
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function parseEnv(content) {
  const values = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    values[key] = value;
  }
  return values;
}

async function loadConfig() {
  let env = {};
  try {
    env = parseEnv(await fs.readFile(ENV_PATH, "utf8"));
  } catch {
    // Fall back to process.env.
  }

  const propertyId = process.env.GA4_PROPERTY_ID || env.GA4_PROPERTY_ID || "528376605";
  let credentialsPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(ROOT, ".secrets", "ga4-service-account.json");

  credentialsPath = path.isAbsolute(credentialsPath)
    ? credentialsPath
    : path.join(ROOT, credentialsPath);

  try {
    await fs.access(credentialsPath);
  } catch {
    const secretsDir = path.join(ROOT, ".secrets");
    const candidates = (await fs.readdir(secretsDir).catch(() => []))
      .filter((name) => name.toLowerCase().endsWith(".json"));
    if (candidates.length === 1) {
      credentialsPath = path.join(secretsDir, candidates[0]);
    }
  }

  return {
    propertyId,
    credentialsPath,
  };
}

async function getAccessToken(credentialsPath) {
  const credentials = JSON.parse(await fs.readFile(credentialsPath, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: credentials.client_email,
    scope: SCOPE,
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(unsigned)
    .sign(credentials.private_key);
  const assertion = `${unsigned}.${base64url(signature)}`;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error(`OAuth token request failed: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json();
  return payload.access_token;
}

async function runReport({ accessToken, propertyId, body }) {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new Error(`GA4 report failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

function metricValue(row, index) {
  return Number(row.metricValues?.[index]?.value || 0);
}

function dimensionValue(row, index) {
  return row.dimensionValues?.[index]?.value || "";
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(headers, rows) {
  return [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ].join("\n");
}

async function main() {
  const { propertyId, credentialsPath } = await loadConfig();
  const accessToken = await getAccessToken(credentialsPath);
  await fs.mkdir(OUT_DIR, { recursive: true });

  const baseDateRanges = [
    { name: "last7Days", startDate: "7daysAgo", endDate: "yesterday" },
    { name: "last28Days", startDate: "28daysAgo", endDate: "yesterday" },
  ];

  const summaryReport = await runReport({
    accessToken,
    propertyId,
    body: {
      dateRanges: baseDateRanges,
      dimensions: [{ name: "dateRange" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "eventCount" },
        { name: "engagementRate" },
      ],
    },
  });

  const pageReport = await runReport({
    accessToken,
    propertyId,
    body: {
      dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }, { name: "sessions" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 100,
    },
  });

  const eventReport = await runReport({
    accessToken,
    propertyId,
    body: {
      dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 100,
    },
  });

  const acquisitionReport = await runReport({
    accessToken,
    propertyId,
    body: {
      dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }, { name: "sessionSourceMedium" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "engagedSessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 100,
    },
  });

  const summary = {
    propertyId,
    generatedAt: new Date().toISOString(),
    ranges: Object.fromEntries(
      (summaryReport.rows || []).map((row) => [
        dimensionValue(row, 0),
        {
          activeUsers: metricValue(row, 0),
          sessions: metricValue(row, 1),
          views: metricValue(row, 2),
          eventCount: metricValue(row, 3),
          engagementRate: metricValue(row, 4),
        },
      ]),
    ),
    raw: summaryReport,
  };

  const pageRows = (pageReport.rows || []).map((row) => ({
    pagePath: dimensionValue(row, 0),
    pageTitle: dimensionValue(row, 1),
    views: metricValue(row, 0),
    activeUsers: metricValue(row, 1),
    sessions: metricValue(row, 2),
  }));

  const eventRows = (eventReport.rows || []).map((row) => ({
    eventName: dimensionValue(row, 0),
    eventCount: metricValue(row, 0),
    activeUsers: metricValue(row, 1),
  }));

  const acquisitionRows = (acquisitionReport.rows || []).map((row) => ({
    channelGroup: dimensionValue(row, 0),
    sourceMedium: dimensionValue(row, 1),
    sessions: metricValue(row, 0),
    activeUsers: metricValue(row, 1),
    engagedSessions: metricValue(row, 2),
  }));

  await fs.writeFile(path.join(OUT_DIR, "latest-ga4-summary.json"), JSON.stringify(summary, null, 2));
  await fs.writeFile(path.join(OUT_DIR, "latest-ga4-pages.csv"), toCsv(["pagePath", "pageTitle", "views", "activeUsers", "sessions"], pageRows));
  await fs.writeFile(path.join(OUT_DIR, "latest-ga4-events.csv"), toCsv(["eventName", "eventCount", "activeUsers"], eventRows));
  await fs.writeFile(path.join(OUT_DIR, "latest-ga4-acquisition.csv"), toCsv(["channelGroup", "sourceMedium", "sessions", "activeUsers", "engagedSessions"], acquisitionRows));

  console.log(`GA4 reports exported to ${path.relative(ROOT, OUT_DIR)}`);
  console.log(`Pages: ${pageRows.length}, events: ${eventRows.length}, acquisition rows: ${acquisitionRows.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
