import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const ANALYTICS_DIR = path.join(ROOT, "docs", "analytics");
const HISTORY_DIR = path.join(ANALYTICS_DIR, "history");
const SUMMARY_JSON = path.join(ANALYTICS_DIR, "latest-ga4-summary.json");
const EVENTS_CSV = path.join(ANALYTICS_DIR, "latest-ga4-events.csv");
const NORTHSTAR_CSV = path.join(ANALYTICS_DIR, "latest-ga4-northstar.csv");
const PAGES_CSV = path.join(ANALYTICS_DIR, "latest-ga4-pages.csv");
const ACQUISITION_CSV = path.join(ANALYTICS_DIR, "latest-ga4-acquisition.csv");
const GSC_LOCALE_SUMMARY_CSV = path.join(ANALYTICS_DIR, "latest-gsc-locale-summary.csv");
const GSC_OPPORTUNITIES_CSV = path.join(ANALYTICS_DIR, "latest-gsc-opportunities.csv");
const GSC_INDEX_COVERAGE_JSON = path.join(ANALYTICS_DIR, "latest-gsc-index-coverage-summary.json");
const AUTH_STATUS_JSON = path.join(ANALYTICS_DIR, "auth-status.json");

function toTimestampSlug(value) {
  return new Date(value).toISOString().replace(/[:.]/g, "-");
}

function pctNumber(val, total) {
  return total > 0 ? val / total : 0;
}

function formatDelta(current, previous, formatter = (v) => v.toString()) {
  if (previous === null || previous === undefined) return "n/a";
  const delta = current - previous;
  if (delta === 0) return "0";
  return `${delta > 0 ? "+" : ""}${formatter(delta)}`;
}

function formatPctPointDelta(current, previous) {
  if (previous === null || previous === undefined) return "n/a";
  const delta = (current - previous) * 100;
  if (Math.abs(delta) < 0.05) return "0.0pp";
  return `${delta > 0 ? "+" : ""}${delta.toFixed(1)}pp`;
}

function topRows(rows, count, sortKey) {
  return [...rows]
    .sort((a, b) => Number(b[sortKey] || 0) - Number(a[sortKey] || 0))
    .slice(0, count);
}

function parseCsvLine(line) {
  const fields = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { field += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ",") { fields.push(field); field = ""; }
      else { field += ch; }
    }
  }
  fields.push(field);
  return fields;
}

async function readCsv(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const lines = content.split(/\r?\n/).filter(Boolean);
    const headers = parseCsvLine(lines[0]);
    return lines.slice(1).map((line) => {
      const values = parseCsvLine(line);
      return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
    });
  } catch {
    return [];
  }
}

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

// Print the Index Coverage block (URL Inspection API). This is the Launch-Phase
// north-star instrumentation: indexed real count vs the indexed>=50 gate, plus
// the actual index-exclusion reasons (coverageState) and canonical mismatches.
function printIndexCoverage(coverage) {
  console.log("\n📚 INDEX COVERAGE (URL Inspection API)");
  console.log("-".repeat(40));
  if (!coverage) {
    console.log("- No index-coverage data. Run 'npm run analytics:gsc:coverage' (needs GSC read auth).");
    return;
  }
  const gate = coverage.phaseGate || {};
  const ratio = ((coverage.coverageRatio || 0) * 100).toFixed(0);
  console.log(`Indexed (verdict=PASS): ${coverage.indexed}/${coverage.inspected} inspected (${ratio}% of OK)`);
  console.log(`Sitemap URLs total    : ${coverage.totalSitemapUrls}` + (coverage.errorCount ? `, errors: ${coverage.errorCount}` : ""));
  console.log(`Phase gate (indexed>=${gate.target}): ${gate.cleared ? "✅ CLEARED" : "🚧 below"} — ${gate.note || ""}`);
  const states = Object.entries(coverage.byCoverageState || {}).sort((a, b) => b[1] - a[1]);
  if (states.length > 0) {
    console.log("Index exclusion / coverage states:");
    for (const [state, count] of states) {
      console.log(`   ${count.toString().padStart(4)}  ${state}`);
    }
  }
  if (coverage.canonicalMismatchCount > 0) {
    console.log(`Canonical mismatches  : ${coverage.canonicalMismatchCount} (Google chose a different canonical than the URL)`);
    for (const m of (coverage.canonicalMismatches || []).slice(0, 5)) {
      console.log(`   ${m.url} -> google:${m.googleCanonical || "(none)"}`);
    }
  }
  if (coverage.blockedCount > 0) {
    console.log(`Blocked (robots/meta) : ${coverage.blockedCount}`);
  }
}

// Monetag zone identity (see docs/strategy/growth-strategy.md §1).
const ZONE_LABELS = {
  "10760541": "In-Page Push",
  "10969428": "Push Notification",
};

// Build the north-star view (Monetag tag loads = `ad_script_load`) from the
// north-star CSV. Aggregate rows are the bare `ad_script_load` event; per-zone
// rows are the `ad_script_load_z<zone>` companion events. Returns per-range
// totals plus a per-zone breakdown with load success rate (load / load+error+timeout).
function computeNorthStar(rows) {
  const byRange = {};
  for (const row of rows) {
    const range = row.range;
    const name = row.eventName || "";
    const count = parseInt(row.eventCount, 10) || 0;
    byRange[range] ??= { loadTotal: 0, zones: {} };

    if (name === "ad_script_load") {
      byRange[range].loadTotal += count;
      continue;
    }
    const m = name.match(/^ad_script_(load|error|timeout)_z(\d+)$/);
    if (!m) continue;
    const [, kind, zone] = m;
    const zoneEntry = (byRange[range].zones[zone] ??= { load: 0, error: 0, timeout: 0 });
    zoneEntry[kind] += count;
  }
  return byRange;
}

function printNorthStar(byRange) {
  console.log("\n⭐ NORTH STAR — Monetag tag loads (`ad_script_load`)");
  console.log("-".repeat(40));
  const ranges = [
    ["last7Days", "7d"],
    ["last28Days", "28d"],
  ];
  let hasZoneData = false;
  for (const [key, label] of ranges) {
    const entry = byRange[key];
    if (!entry) {
      console.log(`${label.padEnd(4)}: no data`);
      continue;
    }
    console.log(`${label.padEnd(4)}: ${entry.loadTotal} tag loads (aggregate)`);
    const zoneIds = Object.keys(entry.zones);
    for (const zone of zoneIds) {
      const z = entry.zones[zone];
      hasZoneData = true;
      const attempts = z.load + z.error + z.timeout;
      const rate = attempts > 0 ? ((z.load / attempts) * 100).toFixed(0) + "%" : "n/a";
      const name = ZONE_LABELS[zone] || "unknown";
      console.log(`      └ zone ${zone} (${name}): ${z.load} loads / ${z.error} err / ${z.timeout} timeout — load rate ${rate}`);
    }
  }
  if (!hasZoneData) {
    console.log("  (per-zone breakdown accrues after the zone-companion-event deploy;");
    console.log("   aggregate `ad_script_load` total above is available now.)");
  }
}

// Surface analytics auth health at the top of the review. When the OAuth token
// is expired/revoked the exporters write a blocked status to auth-status.json;
// echoing it here means the daily/weekly reader sees that the numbers below are
// cached, not fresh, without scrolling back through the export WARN lines.
async function printAuthStatusBanner() {
  const status = await readJsonIfExists(AUTH_STATUS_JSON);
  if (!status) return;
  console.log("\n🔐 ANALYTICS AUTH");
  console.log("-".repeat(40));
  if (!status.blocked) {
    console.log("- OK (analytics credentials valid as of last export).");
    return;
  }
  const blockedScopes = Object.entries(status.scopes || {}).filter(([, s]) => s && s.ok === false);
  console.log("⚠️  BLOCKED — fresh metrics could not be fetched; figures below are CACHED.");
  for (const [scope, s] of blockedScopes) {
    console.log(`   ${scope}: ${s.summary || s.kind} (checked ${s.checkedAt || "?"})`);
  }
  const remediation = blockedScopes[0]?.[1]?.remediation;
  if (remediation) console.log(`   → ${remediation}`);
}

async function main() {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 CLIPKEEP GROWTH INSIGHTS");
  console.log("=".repeat(50));

  await printAuthStatusBanner();

  let summaryData;
  try {
    summaryData = JSON.parse(await fs.readFile(SUMMARY_JSON, "utf8"));
  } catch (e) {
    console.error("❌ No summary data found. Run 'npm run analytics:ga4' first.");
    return;
  }

  const events = await readCsv(EVENTS_CSV);
  const northStarRows = await readCsv(NORTHSTAR_CSV);
  const northStar = computeNorthStar(northStarRows);
  const pages = await readCsv(PAGES_CSV);
  const acquisition = await readCsv(ACQUISITION_CSV);
  const gscLocaleSummary = await readCsv(GSC_LOCALE_SUMMARY_CSV);
  const gscOpportunities = await readCsv(GSC_OPPORTUNITIES_CSV);
  const indexCoverage = await readJsonIfExists(GSC_INDEX_COVERAGE_JSON);
  const findEventCount = (name) => {
    const ev = events.find(e => e.eventName === name);
    return ev ? parseInt(ev.eventCount, 10) : 0;
  };

  const l28 = summaryData.ranges.last28Days || {};
  const sessions = l28.sessions || 0;
  
  // Key Funnel Events
  const focus = findEventCount("extract_form_focus");
  const legacySubmit = findEventCount("extract_submit");
  const attempt = findEventCount("extract_attempt");
  const submit = attempt > 0 ? attempt : legacySubmit;
  const complete = findEventCount("processing_complete");
  const attributedComplete = findEventCount("processing_complete_attributed");
  const directComplete = findEventCount("processing_complete_direct");
  const funnelComplete = attributedComplete > 0 ? attributedComplete : (complete <= submit ? complete : 0);
  const blockedAttempts = findEventCount("extract_attempt_blocked");
  const invalidUrl = findEventCount("extract_invalid_url");

  // Growth Loop Events
  const shares = findEventCount("share_click");
  const discoveryClicks = findEventCount("discovery_card_click") + findEventCount("gallery_card_click") + findEventCount("discovery_intent_from_result");
  const relatedClicks = findEventCount("result_related_click");
  const totalGrowthInteractions = shares + discoveryClicks + relatedClicks;
  const rates = {
    formInterestPerSession: pctNumber(focus, sessions),
    submitPerSession: pctNumber(submit, sessions),
    completionPerSubmit: pctNumber(funnelComplete, submit),
    sharePerComplete: pctNumber(shares, complete),
    discoveryPerSession: pctNumber(discoveryClicks, sessions),
    relatedPerComplete: pctNumber(relatedClicks, complete),
    invalidUrlPerSubmit: pctNumber(invalidUrl, submit),
  };

  const snapshot = {
    generatedAt: summaryData.generatedAt,
    recordedAt: new Date().toISOString(),
    propertyId: summaryData.propertyId,
    period: "last28Days",
    metrics: {
      activeUsers: l28.activeUsers || 0,
      sessions,
      views: l28.views || 0,
      eventCount: l28.eventCount || 0,
      engagementRate: l28.engagementRate || 0,
      extractFormFocus: focus,
      extractSubmit: submit,
      extractAttempt: attempt,
      legacyExtractSubmit: legacySubmit,
      extractAttemptBlocked: blockedAttempts,
      processingComplete: complete,
      processingCompleteAttributed: attributedComplete,
      processingCompleteDirect: directComplete,
      funnelProcessingComplete: funnelComplete,
      downloadActualStart: findEventCount("download_actual_start"),
      invalidUrl,
      shareClick: shares,
      discoveryClicks,
      relatedClicks,
      totalGrowthInteractions,
      viralFactor: complete > 0 ? shares / complete : 0,
      adScriptLoad7d: northStar.last7Days?.loadTotal || 0,
      adScriptLoad28d: northStar.last28Days?.loadTotal || 0,
      ...rates,
    },
    northStar,
    topPages: topRows(pages, 10, "views"),
    topEvents: topRows(events, 20, "eventCount"),
    acquisition: topRows(acquisition, 10, "sessions"),
    searchConsole: {
      localeSummary: topRows(gscLocaleSummary, 10, "impressions"),
      opportunities: topRows(gscOpportunities, 10, "impressions"),
      indexCoverage: indexCoverage
        ? {
            totalSitemapUrls: indexCoverage.totalSitemapUrls,
            inspected: indexCoverage.inspected,
            indexed: indexCoverage.indexed,
            notIndexed: indexCoverage.notIndexed,
            coverageRatio: indexCoverage.coverageRatio,
            phaseGateCleared: indexCoverage.phaseGate?.cleared || false,
            byCoverageState: indexCoverage.byCoverageState,
            canonicalMismatchCount: indexCoverage.canonicalMismatchCount,
            blockedCount: indexCoverage.blockedCount,
          }
        : null,
    },
  };

  await fs.mkdir(HISTORY_DIR, { recursive: true });
  const historyFiles = (await fs.readdir(HISTORY_DIR).catch(() => []))
    .filter((name) => /^growth-\d{4}-\d{2}-\d{2}T/.test(name) && name.endsWith(".json"))
    .sort();
  const previousSnapshotPath = historyFiles.length > 0
    ? path.join(HISTORY_DIR, historyFiles[historyFiles.length - 1])
    : null;
  const previousSnapshot = previousSnapshotPath
    ? JSON.parse(await fs.readFile(previousSnapshotPath, "utf8"))
    : null;

  const snapshotFile = `growth-${toTimestampSlug(snapshot.recordedAt)}.json`;
  await fs.writeFile(path.join(HISTORY_DIR, snapshotFile), JSON.stringify(snapshot, null, 2));
  await fs.writeFile(path.join(HISTORY_DIR, "latest-growth-snapshot.json"), JSON.stringify(snapshot, null, 2));

  console.log(`\n📅 Data Period: Last 28 Days (as of ${new Date(summaryData.generatedAt).toLocaleDateString()})`);
  console.log(`📈 Active Users: ${l28.activeUsers}`);
  console.log(`📊 Sessions: ${sessions}`);
  console.log(`🧾 Snapshot: ${path.relative(ROOT, path.join(HISTORY_DIR, snapshotFile))}`);

  printNorthStar(northStar);

  const pct = (val, total) => total > 0 ? ((val / total) * 100).toFixed(1) + "%" : "0.0%";

  console.log("\n🎯 CONVERSION FUNNEL (Linear)");
  console.log("-".repeat(40));
  console.log(`1. Form Interest  : ${focus.toString().padEnd(5)} clicks (${pct(focus, sessions)} of sessions)`);
  console.log(`2. Intent to Clip : ${submit.toString().padEnd(5)} attempts (${pct(submit, sessions)} of sessions)`);
  if (blockedAttempts > 0) {
    console.log(`   Blocked Intents: ${blockedAttempts.toString().padEnd(5)} blocked attempts (${pct(blockedAttempts, sessions)} of sessions)`);
  }
  console.log(`3. Success Rate   : ${funnelComplete.toString().padEnd(5)} attributed completes (${pct(funnelComplete, submit)} of attempts)`);
  if (directComplete > 0 || complete > funnelComplete) {
    console.log(`   Direct Results  : ${directComplete || (complete - funnelComplete)} completions outside the submit funnel`);
  }

  console.log("\n♻️  GROWTH LOOPS (Network Effects)");
  console.log("-".repeat(40));
  console.log(`1. Viral Potential : ${shares.toString().padEnd(5)} shares  (${pct(shares, complete)} share rate per success)`);
  console.log(`2. Discovery Depth : ${discoveryClicks.toString().padEnd(5)} clicks  (${pct(discoveryClicks, sessions)} engagement rate)`);
  console.log(`3. Related Clicks  : ${relatedClicks.toString().padEnd(5)} clicks  (${pct(relatedClicks, complete)} conversion to discovery)`);
  
  const viralFactor = complete > 0 ? (shares / complete).toFixed(2) : "0.00";
  console.log(`\n🔥 Viral Factor (Est): ${viralFactor} (Higher = better viral loop)`);

  console.log("\n🧪 MEASUREMENT CHECKS");
  console.log("-".repeat(40));
  if (submit === 0 && complete > 0) {
    console.log("- Check: completions exist without extract attempts. Treat them as direct result/gallery traffic until the next deploy records attribution.");
  } else if (funnelComplete > submit) {
    console.log("- Check: attributed completions exceed attempts. Review event deduplication.");
  } else if (complete > funnelComplete) {
    console.log("- Check: submit funnel is separated from direct result/gallery completions.");
  } else {
    console.log("- Check: attempt and attributed completion counts are internally consistent.");
  }
  if (findEventCount("result_view") === 0 && complete > 0) {
    console.log("- Check: result_view is missing while completions exist. Result-page measurement should be verified after the next deploy.");
  }
  if (findEventCount("extract_prepare_success") === 0 && submit > 0) {
    console.log("- Check: extract_prepare_success is missing while submits exist. Prepare-success measurement should be verified after the next deploy.");
  }

  console.log("\n🔎 SEARCH CONSOLE SEO SIGNALS");
  console.log("-".repeat(40));
  if (gscLocaleSummary.length === 0) {
    console.log("- Search Console export is missing. Query-level SEO analysis is not available yet.");
  } else {
    for (const row of topRows(gscLocaleSummary, 6, "impressions")) {
      const impressions = Number(row.impressions || 0);
      const clicks = Number(row.clicks || 0);
      const ctr = Number(row.ctr || 0) * 100;
      const position = Number(row.position || 0);
      console.log(`- ${row.locale}: ${clicks} clicks / ${impressions} impressions / ${ctr.toFixed(1)}% CTR / pos ${position.toFixed(1)}`);
    }
  }

  printIndexCoverage(indexCoverage);

  if (gscOpportunities.length > 0) {
    console.log("\n🎯 SEO OPPORTUNITIES");
    console.log("-".repeat(40));
    for (const row of topRows(gscOpportunities, 5, "impressions")) {
      const ctr = Number(row.ctr || 0) * 100;
      const position = Number(row.position || 0);
      console.log(`- [${row.action}] ${row.locale} "${row.query}" -> ${row.impressions} impressions, ${ctr.toFixed(1)}% CTR, pos ${position.toFixed(1)}`);
    }
  }

  if (previousSnapshot) {
    const prev = previousSnapshot.metrics || {};
    console.log("\n📉 CHANGE VS PREVIOUS GROWTH RUN");
    console.log("-".repeat(40));
    console.log(`Tag Loads (28d)   : ${formatDelta(snapshot.metrics.adScriptLoad28d, prev.adScriptLoad28d)}`);
    console.log(`Sessions          : ${formatDelta(sessions, prev.sessions)}`);
    console.log(`Active Users      : ${formatDelta(l28.activeUsers || 0, prev.activeUsers)}`);
    console.log(`Form Interest     : ${formatDelta(focus, prev.extractFormFocus)} (${formatPctPointDelta(rates.formInterestPerSession, prev.formInterestPerSession)})`);
    console.log(`Extract Submits   : ${formatDelta(submit, prev.extractSubmit)} (${formatPctPointDelta(rates.submitPerSession, prev.submitPerSession)})`);
    console.log(`Completions       : ${formatDelta(complete, prev.processingComplete)} (${formatPctPointDelta(rates.completionPerSubmit, prev.completionPerSubmit)})`);
    console.log(`Download Starts   : ${formatDelta(snapshot.metrics.downloadActualStart, prev.downloadActualStart)}`);
    console.log(`Share Clicks      : ${formatDelta(shares, prev.shareClick)} (${formatPctPointDelta(rates.sharePerComplete, prev.sharePerComplete)})`);
    console.log(`Discovery Clicks  : ${formatDelta(discoveryClicks, prev.discoveryClicks)} (${formatPctPointDelta(rates.discoveryPerSession, prev.discoveryPerSession)})`);
  } else {
    console.log("\n📉 CHANGE VS PREVIOUS GROWTH RUN");
    console.log("-".repeat(40));
    console.log("No previous snapshot yet. This run is now the baseline.");
  }

  if (invalidUrl > 0) {
    console.log(`\n⚠️  FRICTION POINTS`);
    console.log("-".repeat(40));
    console.log(`- Invalid URLs: ${invalidUrl} (${pct(invalidUrl, submit)} of total attempts)`);
    if (blockedAttempts > 0) {
      console.log(`- Blocked attempts: ${blockedAttempts} (${pct(blockedAttempts, sessions)} of sessions)`);
    }
  } else if (blockedAttempts > 0) {
    console.log(`\n⚠️  FRICTION POINTS`);
    console.log("-".repeat(40));
    console.log(`- Blocked attempts: ${blockedAttempts} (${pct(blockedAttempts, sessions)} of sessions)`);
  }

  console.log("\n💡 GROWTH STRATEGY TIPS:");
  console.log("-".repeat(40));
  if (shares < complete * 0.1) {
    console.log("- Viral Loop: Share buttons might be too hidden. Try making them more prominent on the success page.");
  }
  if (discoveryClicks < sessions * 0.2) {
    console.log("- Discovery Loop: Users aren't browsing enough. Consider adding more 'Related' content sections.");
  }
  if (focus < sessions * 0.4) {
    console.log("- Landing: The value proposition might need more 'wow' factors to encourage the first click.");
  }
  if (complete < submit * 0.8 && submit > 0) {
    console.log("- Retention Risk: High failure rate detected. This kills the growth loop immediately.");
  }

  console.log("\n" + "=".repeat(50) + "\n");
}

main().catch(console.error);
