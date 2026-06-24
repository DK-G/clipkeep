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

const AUTH_SCOPE = "gsc-coverage";

// Index Coverage instrumentation (Launch-Phase KPI Gate: indexed >= 50).
// Uses the Search Console URL Inspection API to turn the indexed page count
// into first-party data instead of an estimate, and to capture the actual
// index-exclusion reasons (coverageState) and canonical mismatches.
//
// Auth: reuses the same OAuth (webmasters.readonly) / service-account flow as
// fetch-gsc-report.mjs. URL Inspection works with the read-only scope.
// NOTE: sitemap *re-submission* requires the write scope (`webmasters`) which
// the read-only token does not grant; do that manually in the GSC UI.

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, ".env.analytics.local");
const OUT_DIR = path.join(ROOT, "docs", "analytics");
const SECRETS_DIR = path.join(ROOT, ".secrets");
const OAUTH_CLIENT_PATH = path.join(SECRETS_DIR, "ga4-oauth-client.json");
const OAUTH_TOKEN_PATH = path.join(SECRETS_DIR, "ga4-oauth-token.json");
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const INSPECT_URL = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";
const PHASE_GATE_INDEXED = 50;

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

async function getAccessToken(credentialsPath) {
  let oauthError = null;
  try {
    const oauthToken = await getOAuthAccessToken();
    if (oauthToken) return oauthToken;
  } catch (error) {
    oauthError = error;
    console.warn(`[index-coverage] OAuth token unavailable, trying service account: ${error.message}`);
  }
  try {
    return await getServiceAccountAccessToken(credentialsPath);
  } catch (fallbackError) {
    throw buildAuthError(oauthError, fallbackError, credentialsPath);
  }
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

  // Default to a bounded daily sample so growth:review stays responsive and
  // stays well under the URL Inspection per-minute quota. The sitemap is ordered
  // by page-type then locale, so the first ~100 URLs cover the primary canonical
  // pages across en/ja/pt/ar — the set that matters most for the indexed>=50 gate.
  // Set GSC_INSPECT_LIMIT=0 for the authoritative full-sitemap sweep (e.g. weekly).
  const limitRaw = process.env.GSC_INSPECT_LIMIT ?? env.GSC_INSPECT_LIMIT ?? "100";
  const concurrencyRaw = process.env.GSC_INSPECT_CONCURRENCY ?? env.GSC_INSPECT_CONCURRENCY ?? "6";
  const parsedLimit = Number.parseInt(limitRaw, 10);

  return {
    siteUrl: process.env.GSC_SITE_URL || env.GSC_SITE_URL || "https://clipkeep.net/",
    sitemapUrl: process.env.GSC_SITEMAP_URL || env.GSC_SITEMAP_URL || "https://clipkeep.net/sitemap.xml",
    credentialsPath,
    // limit 0 = inspect every sitemap URL (still bounded by the API daily quota).
    limit: Number.isFinite(parsedLimit) ? Math.max(0, parsedLimit) : 100,
    concurrency: Math.min(10, Math.max(1, Number.parseInt(concurrencyRaw, 10) || 6)),
  };
}

async function listSites(accessToken) {
  const response = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
    headers: { authorization: `Bearer ${accessToken}` },
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
    `No accessible Search Console property matched ${configuredSiteUrl}. Accessible properties: ${available || "none"}`,
  );
}

async function fetchSitemapUrls(sitemapUrl) {
  const response = await fetch(sitemapUrl);
  if (!response.ok) {
    throw new Error(`Sitemap fetch failed: ${response.status} ${sitemapUrl}`);
  }
  const text = await response.text();
  if (/<sitemapindex/i.test(text)) {
    const childSitemaps = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    const all = [];
    for (const child of childSitemaps) {
      all.push(...(await fetchSitemapUrls(child)));
    }
    return [...new Set(all)];
  }
  const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  return [...new Set(locs)];
}

async function inspectUrl({ accessToken, siteUrl, inspectionUrl, retries = 2 }) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(INSPECT_URL, {
      method: "POST",
      headers: { authorization: `Bearer ${accessToken}`, "content-type": "application/json" },
      body: JSON.stringify({ inspectionUrl, siteUrl }),
    });

    if (response.status === 429 && attempt < retries) {
      // Per-minute quota backoff (linear, the API recommends slowing down).
      const waitMs = 2000 * (attempt + 1);
      await new Promise((r) => setTimeout(r, waitMs));
      continue;
    }

    if (!response.ok) {
      return { inspectionUrl, error: `${response.status} ${(await response.text()).slice(0, 200)}` };
    }

    const payload = await response.json();
    const idx = payload.inspectionResult?.indexStatusResult || {};
    return {
      inspectionUrl,
      verdict: idx.verdict || "",
      coverageState: idx.coverageState || "",
      robotsTxtState: idx.robotsTxtState || "",
      indexingState: idx.indexingState || "",
      pageFetchState: idx.pageFetchState || "",
      lastCrawlTime: idx.lastCrawlTime || "",
      googleCanonical: idx.googleCanonical || "",
      userCanonical: idx.userCanonical || "",
      canonicalMatch: idx.googleCanonical
        ? idx.googleCanonical === idx.userCanonical || idx.googleCanonical === inspectionUrl
        : null,
    };
  }
  return { inspectionUrl, error: "exhausted retries (429)" };
}

async function mapWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  let done = 0;
  const total = items.length;
  async function runner() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
      done++;
      if (done % 25 === 0 || done === total) {
        console.log(`[index-coverage] inspected ${done}/${total}`);
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runner));
  return results;
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

function summarize(rows, totalSitemapUrls) {
  const inspected = rows.length;
  const errors = rows.filter((r) => r.error);
  const ok = rows.filter((r) => !r.error);
  const indexed = ok.filter((r) => r.verdict === "PASS").length;

  const byCoverage = {};
  for (const r of ok) {
    const key = r.coverageState || "(unknown)";
    byCoverage[key] = (byCoverage[key] || 0) + 1;
  }

  const canonicalMismatches = ok
    .filter((r) => r.canonicalMatch === false)
    .map((r) => ({ url: r.inspectionUrl, googleCanonical: r.googleCanonical, userCanonical: r.userCanonical }));

  const blocked = ok.filter(
    (r) => r.robotsTxtState === "DISALLOWED" || r.indexingState === "BLOCKED_BY_META_TAG" || r.indexingState === "BLOCKED_BY_HTTP_HEADER",
  ).length;

  return {
    totalSitemapUrls,
    inspected,
    errorCount: errors.length,
    indexed,
    notIndexed: ok.length - indexed,
    coverageRatio: ok.length > 0 ? indexed / ok.length : 0,
    phaseGate: {
      target: PHASE_GATE_INDEXED,
      indexed,
      cleared: indexed >= PHASE_GATE_INDEXED,
      note: inspected < totalSitemapUrls
        ? `Sampled ${inspected} of ${totalSitemapUrls} sitemap URLs (GSC_INSPECT_LIMIT). Indexed count is a lower bound.`
        : "Full sitemap sweep.",
    },
    byCoverageState: byCoverage,
    canonicalMismatchCount: canonicalMismatches.length,
    canonicalMismatches: canonicalMismatches.slice(0, 50),
    blockedCount: blocked,
    errors: errors.slice(0, 20).map((e) => ({ url: e.inspectionUrl, error: e.error })),
  };
}

async function main() {
  const config = await loadConfig();
  const accessToken = await getAccessToken(config.credentialsPath);
  await fs.mkdir(OUT_DIR, { recursive: true });

  const sites = await listSites(accessToken);
  const resolvedSiteUrl = pickSiteUrl(config.siteUrl, sites);

  const allUrls = await fetchSitemapUrls(config.sitemapUrl);
  const totalSitemapUrls = allUrls.length;
  const targetUrls = config.limit > 0 ? allUrls.slice(0, config.limit) : allUrls;

  console.log(`[index-coverage] property: ${resolvedSiteUrl}`);
  console.log(
    `[index-coverage] sitemap URLs: ${totalSitemapUrls}; inspecting ${targetUrls.length}` +
      (config.limit > 0 ? ` (GSC_INSPECT_LIMIT=${config.limit})` : " (full sweep)") +
      `; concurrency ${config.concurrency}`,
  );

  const rows = await mapWithConcurrency(targetUrls, config.concurrency, (url) =>
    inspectUrl({ accessToken, siteUrl: resolvedSiteUrl, inspectionUrl: url }),
  );

  await fs.writeFile(
    path.join(OUT_DIR, "latest-gsc-index-coverage.csv"),
    toCsv(
      [
        "inspectionUrl",
        "verdict",
        "coverageState",
        "robotsTxtState",
        "indexingState",
        "pageFetchState",
        "lastCrawlTime",
        "googleCanonical",
        "userCanonical",
        "canonicalMatch",
        "error",
      ],
      rows,
    ),
  );

  const summary = summarize(rows, totalSitemapUrls);
  await fs.writeFile(
    path.join(OUT_DIR, "latest-gsc-index-coverage-summary.json"),
    JSON.stringify({ property: resolvedSiteUrl, ...summary }, null, 2),
  );

  console.log(
    `[index-coverage] indexed ${summary.indexed}/${summary.inspected} (gate ${PHASE_GATE_INDEXED}: ` +
      `${summary.phaseGate.cleared ? "CLEARED" : "below"}), canonical mismatches ${summary.canonicalMismatchCount}, errors ${summary.errorCount}`,
  );

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
