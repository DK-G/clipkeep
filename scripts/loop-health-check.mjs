// Daily-loop health check (step 3 of the daily growth loop).
//
// Why this exists: two silent failures cost real weeks of growth work.
//   1. 2026-07-14 -> 07-28: the wrangler OAuth session expired because it is only
//      refreshed *by the loop running*. When the loop stopped for 9 days the
//      credentials lapsed, and nothing surfaced it for another 14 days. Every
//      shipped commit sat undeployed.
//   2. 2026-07-10 -> 07-24: our own linkable asset (/api/v1/platform-status)
//      reported Twitter/X at 0% uptime for ~14 days. The data was public and
//      correct; no one read it.
//
// Both are cheap to detect and expensive to miss, so the daily loop runs this
// before picking a task. Exit code is 1 when a BLOCKER is present so an
// unattended run cannot quietly proceed.
//
// Usage:
//   npm run check:loop
//   node scripts/loop-health-check.mjs --base-url https://clipkeep.net

import { spawn } from "node:child_process";
import process from "node:process";

const DEFAULT_BASE_URL = "https://clipkeep.net";
const REQUEST_TIMEOUT_MS = 30_000;
// Below this, a platform is flagged even if the latest probe happens to pass:
// a single green sample says nothing about a multi-week outage.
const UPTIME_WARN_PCT = 90;
// The sitemap has been ~509 <loc> entries since the ?locale= purge (2026-06-12).
// A collapse to a handful of URLs means the build or the route gate broke.
const SITEMAP_MIN_LOC = 100;

const LINE = "=".repeat(72);

function parseArgs(argv) {
  const args = { baseUrl: process.env.LOOP_HEALTH_BASE_URL || DEFAULT_BASE_URL };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--base-url" && argv[i + 1]) {
      args.baseUrl = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

async function fetchWithTimeout(url) {
  return fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: { "user-agent": "clipkeep-loop-health-check" },
  });
}

/** Reports whether the deploy path is usable *today*, not whether it once was. */
function checkWranglerAuth() {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ["node_modules/wrangler/bin/wrangler.js", "whoami"], {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
    });

    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { output += chunk; });

    child.on("error", (error) => {
      resolve({
        name: "deploy path (wrangler auth)",
        level: "BLOCKER",
        detail: `wrangler could not be started: ${error.message}`,
        remediation: "Run `npm install` in the repo root.",
      });
    });

    child.on("exit", (code) => {
      // wrangler prints "Not logged in." and can still exit 0, so match on text too.
      const loggedOut = /not logged in/i.test(output) || /CLOUDFLARE_API_TOKEN/i.test(output);
      if (code !== 0 || loggedOut) {
        resolve({
          name: "deploy path (wrangler auth)",
          level: "BLOCKER",
          detail: "Not logged in — `npm run deploy:prod` will fail, so today's task cannot reach production.",
          remediation: "USER, one-time: run `npx wrangler login` (browser OAuth), or set CLOUDFLARE_API_TOKEN. Claude does not mint tokens.",
        });
        return;
      }

      const account = output.match(/^.*?([\w.@+-]+@[\w.-]+).*$/m)?.[1];
      resolve({
        name: "deploy path (wrangler auth)",
        level: "OK",
        detail: account ? `authenticated as ${account}` : "authenticated",
      });
    });
  });
}

async function checkHealth(baseUrl) {
  const url = `${baseUrl}/api/v1/health`;
  try {
    const res = await fetchWithTimeout(url);
    if (res.status !== 200) {
      return {
        name: "prod health",
        level: "BLOCKER",
        detail: `${url} -> ${res.status}`,
        remediation: "Production is down. Replace today's task with repair work.",
      };
    }
    return { name: "prod health", level: "OK", detail: `${url} -> 200` };
  } catch (error) {
    return {
      name: "prod health",
      level: "BLOCKER",
      detail: `${url} -> request failed: ${error.message}`,
      remediation: "Production is unreachable. Replace today's task with repair work.",
    };
  }
}

async function checkSitemap(baseUrl) {
  const url = `${baseUrl}/sitemap.xml`;
  try {
    const res = await fetchWithTimeout(url);
    if (res.status !== 200) {
      return {
        name: "sitemap",
        level: "BLOCKER",
        detail: `${url} -> ${res.status}`,
        remediation: "Discovery is broken at the source. Replace today's task with repair work.",
      };
    }
    const body = await res.text();
    const locCount = (body.match(/<loc>/g) || []).length;
    if (locCount < SITEMAP_MIN_LOC) {
      return {
        name: "sitemap",
        level: "BLOCKER",
        detail: `${url} -> 200 but only ${locCount} <loc> (expected >= ${SITEMAP_MIN_LOC})`,
        remediation: "The sitemap collapsed. Check the build and the route gates before shipping anything else.",
        locCount,
      };
    }
    return { name: "sitemap", level: "OK", detail: `${url} -> 200 (<loc> = ${locCount})`, locCount };
  } catch (error) {
    return {
      name: "sitemap",
      level: "BLOCKER",
      detail: `${url} -> request failed: ${error.message}`,
      remediation: "Production is unreachable. Replace today's task with repair work.",
    };
  }
}

/**
 * Reads our own published dataset as an operational input. A platform sitting at
 * a low rolling uptime is an extractor outage in progress, whatever the latest
 * single probe says.
 */
async function checkUpstreams(baseUrl) {
  const url = `${baseUrl}/api/v1/platform-status`;
  try {
    const res = await fetchWithTimeout(url);
    if (res.status !== 200) {
      return {
        name: "upstream platforms",
        level: "WARN",
        detail: `${url} -> ${res.status} (cannot read per-platform uptime today)`,
      };
    }
    const data = await res.json();
    const platforms = Array.isArray(data.platforms) ? data.platforms : [];
    const rows = platforms.map((p) => ({
      platform: p.platform,
      status: p.status,
      httpStatus: p.httpStatus,
      uptimePct: p.uptimePct,
      uptimeSamples: p.uptimeSamples,
    }));

    const degraded = rows.filter(
      (p) => p.status !== "operational"
        || (typeof p.uptimePct === "number" && p.uptimePct < UPTIME_WARN_PCT),
    );

    return {
      name: "upstream platforms",
      level: degraded.length > 0 ? "WARN" : "OK",
      detail: degraded.length > 0
        ? `${degraded.length}/${rows.length} degraded: ${degraded.map((p) => `${p.platform}(${p.status}, http=${p.httpStatus}, uptime=${p.uptimePct}% n=${p.uptimeSamples})`).join(", ")}`
        : `${rows.length}/${rows.length} operational`,
      remediation: degraded.length > 0
        ? "A degraded platform that persists across days is an extraction outage — consider it for the backlog rather than letting it age."
        : undefined,
      rows,
      platformCount: rows.length,
      alsoSupported: Array.isArray(data.alsoSupported) ? data.alsoSupported.length : undefined,
      checkedAt: data.checkedAt,
    };
  } catch (error) {
    return {
      name: "upstream platforms",
      level: "WARN",
      detail: `${url} -> request failed: ${error.message}`,
    };
  }
}

function printMarkdownBlock(baseUrl, results) {
  const auth = results.find((r) => r.name.startsWith("deploy path"));
  const health = results.find((r) => r.name === "prod health");
  const sitemap = results.find((r) => r.name === "sitemap");
  const upstream = results.find((r) => r.name === "upstream platforms");

  console.log("\nPaste-ready block for docs/ops/daily/YYYY-MM-DD.md:\n");
  console.log("| 対象 | 結果 |");
  console.log("|---|---|");
  console.log(`| \`npx wrangler whoami\`（デプロイ経路） | **${auth?.level === "OK" ? "認証済" : "未ログイン＝デプロイ不能"}** |`);
  console.log(`| \`${baseUrl}/api/v1/health\` | **${health?.level === "OK" ? "200" : "NG"}** |`);
  console.log(`| \`${baseUrl}/sitemap.xml\` | **${sitemap?.level === "OK" ? "200" : "NG"}**（\`<loc>\` = ${sitemap?.locCount ?? "?"}） |`);
  if (upstream?.rows) {
    const degraded = upstream.rows.filter((p) => p.status !== "operational" || (typeof p.uptimePct === "number" && p.uptimePct < UPTIME_WARN_PCT));
    console.log(`| \`${baseUrl}/api/v1/platform-status\` | ${upstream.platformCount} platforms・劣化 ${degraded.length} 件${degraded.length ? `（${degraded.map((p) => `${p.platform} ${p.uptimePct}%`).join(" / ")}）` : ""} |`);
  }
  console.log("");
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  console.log(`[loop-health] target: ${baseUrl}`);

  // wrangler whoami is sequential on purpose: it spawns a process and its output
  // is far noisier than the fetches, so interleaving makes the log unreadable.
  const auth = await checkWranglerAuth();
  const [health, sitemap, upstream] = await Promise.all([
    checkHealth(baseUrl),
    checkSitemap(baseUrl),
    checkUpstreams(baseUrl),
  ]);

  const results = [auth, health, sitemap, upstream];

  console.log("");
  for (const result of results) {
    console.log(`[loop-health][${result.level}] ${result.name}: ${result.detail}`);
    if (result.remediation) console.log(`[loop-health]        -> ${result.remediation}`);
  }

  if (upstream?.rows?.length) {
    console.log("");
    console.log("[loop-health] per-platform (source: our own published dataset)");
    for (const row of upstream.rows) {
      console.log(
        `[loop-health]   ${String(row.platform).padEnd(12)} status=${String(row.status).padEnd(12)} http=${String(row.httpStatus ?? "-").padEnd(5)} uptime=${row.uptimePct ?? "-"}% n=${row.uptimeSamples ?? "-"}`,
      );
    }
  }

  const blockers = results.filter((r) => r.level === "BLOCKER");
  const warns = results.filter((r) => r.level === "WARN");

  printMarkdownBlock(baseUrl, results);

  console.log(LINE);
  if (blockers.length > 0) {
    console.log(`[loop-health] VERDICT: BLOCKED — ${blockers.length} blocker(s), ${warns.length} warning(s).`);
    console.log("[loop-health] Record `status: blocked` in the daily log with the remediation above.");
    console.log(LINE);
    process.exitCode = 1;
    return;
  }
  if (warns.length > 0) {
    console.log(`[loop-health] VERDICT: OK with ${warns.length} warning(s) — production is serving; note the warnings in the daily log.`);
  } else {
    console.log("[loop-health] VERDICT: OK — deploy path live, production healthy, all upstreams operational.");
  }
  console.log(LINE);
}

main().catch((error) => {
  console.error(`[loop-health] unexpected failure: ${error.message}`);
  process.exitCode = 1;
});
