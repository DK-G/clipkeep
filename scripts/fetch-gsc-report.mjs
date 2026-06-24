import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  AnalyticsAuthError,
  buildAuthError,
  printAuthWarn,
  recordAuthStatus,
} from "./lib/analytics-auth.mjs";

const AUTH_SCOPE = "gsc";

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, ".env.analytics.local");
const OUT_DIR = path.join(ROOT, "docs", "analytics");
const SECRETS_DIR = path.join(ROOT, ".secrets");
const OAUTH_CLIENT_PATH = path.join(SECRETS_DIR, "ga4-oauth-client.json");
const OAUTH_TOKEN_PATH = path.join(SECRETS_DIR, "ga4-oauth-token.json");
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

function parseEnv(content) {
  const values = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    values[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
  }
  return values;
}

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function getOAuthClientConfig(raw) {
  const config = raw?.installed || raw?.web;
  if (!config?.client_id || !config?.client_secret) {
    throw new Error(".secrets/ga4-oauth-client.json must contain installed.client_id and installed.client_secret.");
  }
  return config;
}

async function getOAuthAccessToken() {
  const [clientRaw, token] = await Promise.all([
    readJsonIfExists(OAUTH_CLIENT_PATH),
    readJsonIfExists(OAUTH_TOKEN_PATH),
  ]);

  if (!clientRaw || !token) return null;
  if (!token.refresh_token) {
    throw new Error("OAuth token is missing refresh_token. Re-run npm run analytics:ga4:login.");
  }

  const client = getOAuthClientConfig(clientRaw);
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: client.client_id,
      client_secret: client.client_secret,
      refresh_token: token.refresh_token,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(`OAuth refresh failed for Search Console: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json();
  return payload.access_token;
}

async function getAccessToken(credentialsPath) {
  let oauthError = null;
  try {
    const oauthToken = await getOAuthAccessToken();
    if (oauthToken) return oauthToken;
  } catch (error) {
    oauthError = error;
    console.warn(`[analytics] OAuth token unavailable, trying service account: ${error.message}`);
  }

  try {
    return await getServiceAccountAccessToken(credentialsPath);
  } catch (fallbackError) {
    throw buildAuthError(oauthError, fallbackError, credentialsPath);
  }
}

async function getServiceAccountAccessToken(credentialsPath) {
  const credentials = JSON.parse(await fs.readFile(credentialsPath, "utf8"));
  if (!credentials.client_email || !credentials.private_key) {
    throw new Error(`Service account credentials are invalid: ${credentialsPath}`);
  }

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
  const signature = crypto.createSign("RSA-SHA256").update(unsigned).sign(credentials.private_key);
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
    throw new Error(`Search Console token request failed: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json();
  return payload.access_token;
}

async function loadConfig() {
  let env = {};
  try {
    env = parseEnv(await fs.readFile(ENV_PATH, "utf8"));
  } catch {
    // Fall back to defaults and process.env.
  }

  let credentialsPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(ROOT, ".secrets", "ga4-service-account.json");
  credentialsPath = path.isAbsolute(credentialsPath) ? credentialsPath : path.join(ROOT, credentialsPath);

  try {
    await fs.access(credentialsPath);
  } catch {
    const candidates = (await fs.readdir(SECRETS_DIR).catch(() => []))
      .filter((name) => name.toLowerCase().endsWith(".json"));
    for (const candidate of candidates) {
      const candidatePath = path.join(SECRETS_DIR, candidate);
      try {
        const parsed = JSON.parse(await fs.readFile(candidatePath, "utf8"));
        if (parsed.type === "service_account" && parsed.client_email && parsed.private_key) {
          credentialsPath = candidatePath;
          break;
        }
      } catch {
        // Ignore non-JSON or unrelated secret files.
      }
    }
  }

  return {
    siteUrl: process.env.GSC_SITE_URL || env.GSC_SITE_URL || "https://clipkeep.net/",
    credentialsPath,
  };
}

function toDateString(date) {
  return date.toISOString().slice(0, 10);
}

function daysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return toDateString(date);
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

function detectLocale(page) {
  const url = new URL(page);
  const locale = url.searchParams.get("locale");
  if (locale) return locale;
  const firstPath = url.pathname.split("/").filter(Boolean)[0];
  if (["en", "ja", "ar", "es", "pt", "fr", "id", "hi", "de", "tr"].includes(firstPath)) return firstPath;
  return "en";
}

async function searchAnalytics({ accessToken, siteUrl, body }) {
  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
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
    throw new Error(`Search Console query failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function listSites(accessToken) {
  const response = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Search Console sites list failed: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json();
  return payload.siteEntry || [];
}

function pickSiteUrl(configuredSiteUrl, sites) {
  const accessible = sites.filter((site) => site.permissionLevel && site.permissionLevel !== "siteUnverifiedUser");
  const exact = accessible.find((site) => site.siteUrl === configuredSiteUrl);
  if (exact) return exact.siteUrl;

  const clipkeep = accessible.find((site) => /(^sc-domain:clipkeep\.net$|https?:\/\/(www\.)?clipkeep\.net\/?$)/i.test(site.siteUrl));
  if (clipkeep) return clipkeep.siteUrl;

  if (accessible.length === 1) return accessible[0].siteUrl;

  const available = accessible.map((site) => `${site.siteUrl} (${site.permissionLevel})`).join(", ");
  throw new Error(
    `No accessible Search Console property matched ${configuredSiteUrl}. ` +
    `Set GSC_SITE_URL in .env.analytics.local to one of your accessible properties. Accessible properties: ${available || "none"}`,
  );
}

function mapRows(report, dimensions) {
  return (report.rows || []).map((row) => {
    const out = {};
    dimensions.forEach((dimension, index) => {
      out[dimension] = row.keys?.[index] || "";
    });
    out.clicks = row.clicks || 0;
    out.impressions = row.impressions || 0;
    out.ctr = row.ctr || 0;
    out.position = row.position || 0;
    if (out.page) out.locale = detectLocale(out.page);
    return out;
  });
}

function summarizeLocales(rows) {
  const byLocale = new Map();
  for (const row of rows) {
    const locale = row.locale || "unknown";
    const current = byLocale.get(locale) || { locale, clicks: 0, impressions: 0, weightedPosition: 0, queryCount: 0, pageCount: new Set() };
    current.clicks += row.clicks;
    current.impressions += row.impressions;
    current.weightedPosition += row.position * row.impressions;
    current.queryCount += row.query ? 1 : 0;
    if (row.page) current.pageCount.add(row.page);
    byLocale.set(locale, current);
  }

  return [...byLocale.values()]
    .map((row) => ({
      locale: row.locale,
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.impressions > 0 ? row.clicks / row.impressions : 0,
      position: row.impressions > 0 ? row.weightedPosition / row.impressions : 0,
      queryCount: row.queryCount,
      pageCount: row.pageCount.size,
    }))
    .sort((a, b) => b.impressions - a.impressions);
}

function buildOpportunities(rows) {
  return rows
    .filter((row) => row.impressions >= 10)
    .map((row) => {
      let action = "monitor";
      let reason = "Low sample or stable opportunity";
      if (row.position <= 20 && row.ctr < 0.03) {
        action = "improve_snippet";
        reason = "Visible in search but CTR is weak";
      } else if (row.position > 10 && row.position <= 30 && row.impressions >= 20) {
        action = "improve_content_match";
        reason = "Ranking near striking distance";
      } else if (["ja", "pt", "ar", "hi", "id", "tr"].includes(row.locale) && row.impressions > 0 && row.clicks === 0) {
        action = "minor_locale_check";
        reason = "Minor-language impressions exist but no clicks yet";
      }
      return { ...row, action, reason };
    })
    .filter((row) => row.action !== "monitor")
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 50);
}

async function main() {
  const { siteUrl, credentialsPath } = await loadConfig();
  const accessToken = await getAccessToken(credentialsPath);
  await fs.mkdir(OUT_DIR, { recursive: true });
  const sites = await listSites(accessToken);
  const resolvedSiteUrl = pickSiteUrl(siteUrl, sites);

  const last28 = { startDate: daysAgo(28), endDate: daysAgo(1) };
  const last7 = { startDate: daysAgo(7), endDate: daysAgo(1) };
  const previous7 = { startDate: daysAgo(14), endDate: daysAgo(8) };

  const common = {
    type: "web",
    rowLimit: 1000,
    dataState: "final",
  };

  const [queryPagesReport, pagesReport, countriesReport, last7Report, previous7Report] = await Promise.all([
    searchAnalytics({ accessToken, siteUrl: resolvedSiteUrl, body: { ...common, ...last28, dimensions: ["query", "page", "country", "device"] } }),
    searchAnalytics({ accessToken, siteUrl: resolvedSiteUrl, body: { ...common, ...last28, dimensions: ["page"] } }),
    searchAnalytics({ accessToken, siteUrl: resolvedSiteUrl, body: { ...common, ...last28, dimensions: ["country", "page"] } }),
    searchAnalytics({ accessToken, siteUrl: resolvedSiteUrl, body: { ...common, ...last7, dimensions: ["query", "page"] } }),
    searchAnalytics({ accessToken, siteUrl: resolvedSiteUrl, body: { ...common, ...previous7, dimensions: ["query", "page"] } }),
  ]);

  const queryPages = mapRows(queryPagesReport, ["query", "page", "country", "device"]);
  const pages = mapRows(pagesReport, ["page"]);
  const countries = mapRows(countriesReport, ["country", "page"]);
  const last7Rows = mapRows(last7Report, ["query", "page"]);
  const previous7Rows = mapRows(previous7Report, ["query", "page"]);
  const localeSummary = summarizeLocales(queryPages);
  const opportunities = buildOpportunities(queryPages);

  await fs.writeFile(
    path.join(OUT_DIR, "latest-gsc-query-pages.csv"),
    toCsv(["query", "page", "locale", "country", "device", "clicks", "impressions", "ctr", "position"], queryPages),
  );
  await fs.writeFile(
    path.join(OUT_DIR, "latest-gsc-pages.csv"),
    toCsv(["page", "locale", "clicks", "impressions", "ctr", "position"], pages),
  );
  await fs.writeFile(
    path.join(OUT_DIR, "latest-gsc-country-pages.csv"),
    toCsv(["country", "page", "locale", "clicks", "impressions", "ctr", "position"], countries),
  );
  await fs.writeFile(
    path.join(OUT_DIR, "latest-gsc-locale-summary.csv"),
    toCsv(["locale", "clicks", "impressions", "ctr", "position", "queryCount", "pageCount"], localeSummary),
  );
  await fs.writeFile(
    path.join(OUT_DIR, "latest-gsc-opportunities.csv"),
    toCsv(["query", "page", "locale", "country", "device", "clicks", "impressions", "ctr", "position", "action", "reason"], opportunities),
  );
  await fs.writeFile(
    path.join(OUT_DIR, "latest-gsc-week-current.csv"),
    toCsv(["query", "page", "locale", "clicks", "impressions", "ctr", "position"], last7Rows),
  );
  await fs.writeFile(
    path.join(OUT_DIR, "latest-gsc-week-previous.csv"),
    toCsv(["query", "page", "locale", "clicks", "impressions", "ctr", "position"], previous7Rows),
  );

  console.log(`Search Console reports exported to ${path.relative(ROOT, OUT_DIR)}`);
  console.log(`Search Console property: ${resolvedSiteUrl}`);
  console.log(`Query/page rows: ${queryPages.length}, pages: ${pages.length}, locale rows: ${localeSummary.length}, opportunities: ${opportunities.length}`);

  await recordAuthStatus({ scope: AUTH_SCOPE, ok: true });
}

main().catch(async (error) => {
  if (error instanceof AnalyticsAuthError) {
    printAuthWarn(AUTH_SCOPE, error);
    await recordAuthStatus({ scope: AUTH_SCOPE, ok: false, error });
  } else {
    console.error(error.message);
  }
  process.exitCode = 1;
});
