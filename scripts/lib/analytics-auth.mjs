import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

// Shared auth-failure classification + status reporting for the analytics
// exporters (GA4, GSC, GSC index coverage). The recurring real-world failure is
// the OAuth refresh token expiring or being revoked (`invalid_grant`), which used
// to surface as an opaque `ENOENT ... ga4-service-account.json` after the service
// account fallback missed. That hid the true cause from the daily/weekly growth
// loop. This module turns that into a classified WARN plus a machine-readable
// status marker so an unattended run can record `status: blocked` with the right
// remediation instead of a cryptic stack trace.

const ROOT = process.cwd();
const STATUS_PATH = path.join(ROOT, "docs", "analytics", "auth-status.json");
const SERVICE_ACCOUNT_PATH = path.join(ROOT, ".secrets", "ga4-service-account.json");

// Remediation shared by every blocked state. Re-login is the immediate fix; a
// service account is the durable, unattended-friendly fix (see runbook).
export const AUTH_REMEDIATION =
  "Run `npm run analytics:ga4:login` on this PC (interactive, needs a browser) to re-authorize, " +
  "or provision a service account at .secrets/ga4-service-account.json. " +
  "See docs/ops/analytics-auth-recovery.md.";

export class AnalyticsAuthError extends Error {
  constructor(kind, summary, remediation = AUTH_REMEDIATION) {
    super(summary);
    this.name = "AnalyticsAuthError";
    this.kind = kind;
    this.summary = summary;
    this.remediation = remediation;
    this.blocked = true;
  }
}

// Classify a raw error (from either the OAuth refresh or the service-account
// fallback) into a known auth-block kind. Returns null when the error is not a
// recognized auth failure, so callers can rethrow non-auth errors untouched.
export function classifyAuthError(error) {
  const msg = String(error?.message ?? error ?? "");
  if (/invalid_grant|expired or revoked/i.test(msg)) {
    return {
      kind: "token_revoked",
      summary: "OAuth refresh token has expired or been revoked (invalid_grant).",
    };
  }
  if (/missing refresh_token/i.test(msg)) {
    return {
      kind: "token_incomplete",
      summary: "OAuth token has no refresh_token; re-authorization is required.",
    };
  }
  if (/ga4-service-account\.json/i.test(msg) && /ENOENT/i.test(msg)) {
    return {
      kind: "no_credentials",
      summary: "No usable OAuth token and no service-account credentials were found.",
    };
  }
  return null;
}

// Build the error thrown by getAccessToken when every auth path is exhausted.
// Prefers classifying the OAuth failure (the common cause) over the
// service-account fallback failure, so the WARN names the real problem.
export function buildAuthError(oauthError, fallbackError, credentialsPath = SERVICE_ACCOUNT_PATH) {
  const cls = classifyAuthError(oauthError) ?? classifyAuthError(fallbackError);
  if (cls) return new AnalyticsAuthError(cls.kind, cls.summary);
  if (fallbackError?.code === "ENOENT") {
    return new AnalyticsAuthError(
      "no_credentials",
      `OAuth auth failed (${oauthError?.message ?? "unknown"}) and no service account at ${credentialsPath}.`,
    );
  }
  return fallbackError ?? oauthError ?? new Error("Unknown analytics auth failure.");
}

export async function hasServiceAccount() {
  try {
    await fs.access(SERVICE_ACCOUNT_PATH);
    return true;
  } catch {
    return false;
  }
}

// Print a consistent, grep-able WARN banner. `[analytics][WARN]` is the marker
// the daily-log and weekly-review steps look for.
export function printAuthWarn(scope, error) {
  const remediation = error?.remediation ?? AUTH_REMEDIATION;
  const summary = error?.summary ?? error?.message ?? String(error);
  console.warn(`[analytics][WARN] ${scope}: ${summary}`);
  console.warn(`[analytics][WARN] ${scope}: measurement is BLOCKED — fresh data could not be fetched.`);
  console.warn(`[analytics][WARN] ${scope}: ${remediation}`);
}

async function readStatus() {
  try {
    return JSON.parse(await fs.readFile(STATUS_PATH, "utf8"));
  } catch {
    return { scopes: {} };
  }
}

// Merge a per-scope auth result into docs/analytics/auth-status.json. The file is
// gitignored (a local runtime marker). The growth review runs the exporters
// sequentially, so read-modify-write here is race-free.
export async function recordAuthStatus({ scope, ok, error = null }) {
  const status = await readStatus();
  if (!status.scopes || typeof status.scopes !== "object") status.scopes = {};
  const checkedAt = new Date().toISOString();
  status.scopes[scope] = ok
    ? { ok: true, checkedAt }
    : {
        ok: false,
        kind: error?.kind ?? "unknown",
        summary: error?.summary ?? error?.message ?? String(error),
        remediation: error?.remediation ?? AUTH_REMEDIATION,
        checkedAt,
      };
  status.blocked = Object.values(status.scopes).some((s) => s && s.ok === false);
  status.generatedAt = checkedAt;
  await fs.mkdir(path.dirname(STATUS_PATH), { recursive: true });
  await fs.writeFile(STATUS_PATH, JSON.stringify(status, null, 2));
  return status;
}

export async function readAuthStatus() {
  try {
    return JSON.parse(await fs.readFile(STATUS_PATH, "utf8"));
  } catch {
    return null;
  }
}

export const STATUS_FILE_PATH = STATUS_PATH;
