import { spawn } from "node:child_process";
import process from "node:process";
import { readAuthStatus } from "./lib/analytics-auth.mjs";

function run(scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath], {
      cwd: process.cwd(),
      stdio: "inherit",
      shell: false,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${scriptPath} exited with code ${code}`));
    });
  });
}

// When the shared OAuth credentials are expired/revoked, every Google export
// fails the same way. Rather than aborting with an opaque error, the exporters
// write a classified WARN + a status marker (docs/analytics/auth-status.json).
// We detect that here, stop hammering the blocked APIs, still render the summary
// from cached data, and print one consolidated banner so an unattended daily run
// can record `status: blocked` with the right remediation.
function printBlockedBanner(status) {
  const ga4 = status?.scopes?.ga4;
  const remediation = ga4?.remediation
    || "Run `npm run analytics:ga4:login` on this PC. See docs/ops/analytics-auth-recovery.md.";
  const line = "=".repeat(72);
  console.warn(`\n${line}`);
  console.warn("[growth][WARN] MEASUREMENT BLOCKED — analytics auth is failing.");
  if (ga4?.summary) console.warn(`[growth][WARN] Cause: ${ga4.summary}`);
  console.warn(`[growth][WARN] Remediation: ${remediation}`);
  console.warn("[growth][WARN] Numbers in the summary above are CACHED, not fresh. Record `status: blocked` in the daily/weekly log.");
  console.warn(`${line}\n`);
}

async function main() {
  let authBlocked = false;

  try {
    await run("scripts/fetch-ga4-report.mjs");
  } catch (error) {
    const status = await readAuthStatus();
    if (status?.blocked) {
      authBlocked = true;
      console.warn("[growth] GA4 export blocked by an auth failure (see WARN above); continuing with cached data.");
    } else {
      throw error;
    }
  }

  if (authBlocked) {
    // GSC + URL Inspection reuse the same OAuth credentials, so skip them rather
    // than emitting three identical refresh failures.
    console.warn("[growth] Skipping Search Console exports (same OAuth credentials are blocked).");
  } else {
    try {
      await run("scripts/fetch-gsc-report.mjs");
    } catch (error) {
      console.warn(`[growth] Search Console export skipped: ${error.message}`);
      console.warn("[growth] If this is an auth scope issue, re-run npm run analytics:ga4:login and grant Search Console read access.");
    }
    try {
      await run("scripts/fetch-gsc-index-coverage.mjs");
    } catch (error) {
      console.warn(`[growth] Index coverage (URL Inspection) skipped: ${error.message}`);
    }
  }

  await run("scripts/growth-summary.mjs");

  if (authBlocked) {
    printBlockedBanner(await readAuthStatus());
    // Non-zero so CI/automation sees the run did not produce fresh data.
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
