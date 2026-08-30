import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

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
const GSC_QUERY_PAGES_CSV = path.join(ANALYTICS_DIR, "latest-gsc-query-pages.csv");
const GSC_PAGES_CSV = path.join(ANALYTICS_DIR, "latest-gsc-pages.csv");
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

// ---------------------------------------------------------------------------
// (i) Brand vs non-brand impressions  (weekly review #010 §7 proposal 1)
//
// The GSC query-dimension export has been 100% brand queries ("clipkeep") for
// weeks. That makes the retreat counter in growth-strategy.md structurally
// wrong: the acquisition strategy could fail completely and one extra brand
// search would still reset the counter. Non-brand impressions are the only
// query-side number that is causally downstream of the long-tail/locale work,
// so the review has to print it separately, including when it is zero.
//
// Brand detection is deliberately dumb and auditable: normalize away spacing
// and punctuation, then look for the product name. Look-alike queries that do
// NOT contain the name (e.g. "tubekeep") count as non-brand — they are real
// non-brand demand even when they look like a misspelling.
export function normalizeQueryText(query) {
  return String(query || "").toLowerCase().replace(/[\s._-]+/g, "");
}

export function isBrandQuery(query) {
  return normalizeQueryText(query).includes("clipkeep");
}

function summarizeQueryGroup(rows) {
  const byQuery = new Map();
  let impressions = 0;
  let clicks = 0;
  let weightedPosition = 0;
  for (const row of rows) {
    const imp = Number(row.impressions || 0);
    const clk = Number(row.clicks || 0);
    const pos = Number(row.position || 0);
    impressions += imp;
    clicks += clk;
    weightedPosition += pos * imp;
    const key = String(row.query || "");
    const entry = byQuery.get(key) || { query: key, impressions: 0, clicks: 0, weightedPosition: 0 };
    entry.impressions += imp;
    entry.clicks += clk;
    entry.weightedPosition += pos * imp;
    byQuery.set(key, entry);
  }
  const topQueries = [...byQuery.values()]
    .map((e) => ({
      query: e.query,
      impressions: e.impressions,
      clicks: e.clicks,
      position: e.impressions > 0 ? e.weightedPosition / e.impressions : 0,
    }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 5);
  return {
    impressions,
    clicks,
    queryCount: byQuery.size,
    position: impressions > 0 ? weightedPosition / impressions : 0,
    topQueries,
  };
}

export function computeBrandSplit(queryPageRows) {
  const brandRows = [];
  const nonBrandRows = [];
  for (const row of queryPageRows) {
    (isBrandQuery(row.query) ? brandRows : nonBrandRows).push(row);
  }
  const brand = summarizeQueryGroup(brandRows);
  const nonBrand = summarizeQueryGroup(nonBrandRows);
  const total = brand.impressions + nonBrand.impressions;
  return {
    brand,
    nonBrand,
    totalImpressions: total,
    nonBrandShare: total > 0 ? nonBrand.impressions / total : 0,
    hasData: queryPageRows.length > 0,
  };
}

// ---------------------------------------------------------------------------
// (ii) Page-dimension impressions, by locale and by position band
//
// The query dimension undercounts: GSC suppresses queries below a privacy
// threshold, so page-dimension impressions are consistently larger than the
// query-dimension sum. Reviews that quote only the query number understate
// reach and cannot see WHICH locale is being served. Position bands answer the
// separate question "are these impressions close enough to page 1 to be worth
// deepening?" — the pt-locale decision in #009/#010 rests on exactly that.
const POSITION_BANDS = [
  { key: "1-3", test: (p) => p > 0 && p <= 3 },
  { key: "4-10", test: (p) => p > 3 && p <= 10 },
  { key: "11-20", test: (p) => p > 10 && p <= 20 },
  { key: "21+", test: (p) => p > 20 },
];

export function computePageDimension(pageRows) {
  const byLocale = new Map();
  const byPositionBand = Object.fromEntries(
    POSITION_BANDS.map((b) => [b.key, { impressions: 0, clicks: 0, pageCount: 0 }])
  );
  let impressions = 0;
  let clicks = 0;
  let weightedPosition = 0;

  for (const row of pageRows) {
    const imp = Number(row.impressions || 0);
    const clk = Number(row.clicks || 0);
    const pos = Number(row.position || 0);
    const locale = String(row.locale || "(unknown)");
    impressions += imp;
    clicks += clk;
    weightedPosition += pos * imp;

    const entry = byLocale.get(locale) || { locale, impressions: 0, clicks: 0, pageCount: 0, weightedPosition: 0 };
    entry.impressions += imp;
    entry.clicks += clk;
    entry.pageCount += 1;
    entry.weightedPosition += pos * imp;
    byLocale.set(locale, entry);

    const band = POSITION_BANDS.find((b) => b.test(pos));
    if (band) {
      byPositionBand[band.key].impressions += imp;
      byPositionBand[band.key].clicks += clk;
      byPositionBand[band.key].pageCount += 1;
    }
  }

  return {
    impressions,
    clicks,
    pageCount: pageRows.length,
    position: impressions > 0 ? weightedPosition / impressions : 0,
    byLocale: [...byLocale.values()]
      .map((e) => ({
        locale: e.locale,
        impressions: e.impressions,
        clicks: e.clicks,
        pageCount: e.pageCount,
        position: e.impressions > 0 ? e.weightedPosition / e.impressions : 0,
      }))
      .sort((a, b) => b.impressions - a.impressions),
    byPositionBand,
    hasData: pageRows.length > 0,
  };
}

// ---------------------------------------------------------------------------
// (iii) session_start vs page_view divergence  (#010 §1.1)
//
// GA4 recorded 223 `session_start` against 4 `page_view` (1 user) in the 28-day
// window that first produced any page_view at all. That is not a measurement
// gap — measurement works — it means the traffic behind the north star almost
// never renders a page the way a human would. This ratio is the one number that
// keeps that fact visible every week instead of being re-discovered.
const HUMAN_SHAPED_RATIO_FLOOR = 0.1;

export function computeMeasurementDivergence(eventRows) {
  const find = (name) => eventRows.find((e) => e.eventName === name);
  const count = (name) => Number(find(name)?.eventCount || 0);
  const users = (name) => Number(find(name)?.activeUsers || 0);

  const sessionStart = count("session_start");
  const pageView = count("page_view");
  const ratio = sessionStart > 0 ? pageView / sessionStart : 0;

  return {
    sessionStart,
    sessionStartUsers: users("session_start"),
    pageView,
    pageViewUsers: users("page_view"),
    firstVisit: count("first_visit"),
    userEngagement: count("user_engagement"),
    adScriptLoad: count("ad_script_load"),
    pageViewPerSessionStart: ratio,
    humanShaped: sessionStart > 0 && ratio >= HUMAN_SHAPED_RATIO_FLOOR,
    hasData: eventRows.length > 0,
  };
}

function printBrandSplit(split) {
  console.log("\n🏷️  IMPRESSIONS: BRAND vs NON-BRAND (query dimension)");
  console.log("-".repeat(40));
  if (!split.hasData) {
    console.log("- No query-page export. Run 'npm run analytics:gsc' (needs GSC read auth).");
    return;
  }
  const share = (split.nonBrandShare * 100).toFixed(0);
  console.log(`Non-brand : ${split.nonBrand.impressions} impressions / ${split.nonBrand.clicks} clicks / ${split.nonBrand.queryCount} queries (${share}% of query-dimension impressions)`);
  console.log(`Brand     : ${split.brand.impressions} impressions / ${split.brand.clicks} clicks / ${split.brand.queryCount} queries`);
  for (const q of split.nonBrand.topQueries) {
    console.log(`   non-brand top: "${q.query}" -> ${q.impressions} impressions, pos ${q.position.toFixed(1)}`);
  }
  if (split.nonBrand.impressions === 0) {
    console.log("⚠️  Non-brand impressions are ZERO. Brand-query movement says nothing about the acquisition");
    console.log("    strategy — do not let it reset the retreat counter (growth-strategy.md §7).");
  }
}

function printPageDimension(pageDim) {
  console.log("\n🗺️  IMPRESSIONS BY PAGE DIMENSION (locale / position band)");
  console.log("-".repeat(40));
  if (!pageDim.hasData) {
    console.log("- No page export. Run 'npm run analytics:gsc' (needs GSC read auth).");
    return;
  }
  console.log(`Total: ${pageDim.impressions} impressions / ${pageDim.clicks} clicks over ${pageDim.pageCount} pages (avg pos ${pageDim.position.toFixed(1)})`);
  for (const l of pageDim.byLocale.slice(0, 8)) {
    console.log(`- ${l.locale.padEnd(3)}: ${l.impressions} impressions / ${l.clicks} clicks / ${l.pageCount} pages / pos ${l.position.toFixed(1)}`);
  }
  const bands = Object.entries(pageDim.byPositionBand)
    .map(([band, v]) => `${band}: ${v.impressions}`)
    .join("   ");
  console.log(`Position bands (impressions)  ${bands}`);
}

function printMeasurementDivergence(divergence) {
  console.log("\n🧍 SESSION vs PAGE_VIEW DIVERGENCE");
  console.log("-".repeat(40));
  if (!divergence.hasData) {
    console.log("- No GA4 event export. Run 'npm run analytics:ga4'.");
    return;
  }
  const ratio = (divergence.pageViewPerSessionStart * 100).toFixed(1);
  console.log(`session_start: ${divergence.sessionStart} (${divergence.sessionStartUsers} users)`);
  console.log(`page_view    : ${divergence.pageView} (${divergence.pageViewUsers} users) — ${ratio}% of session_start`);
  console.log(`ad_script_load (north star): ${divergence.adScriptLoad}`);
  if (!divergence.humanShaped) {
    console.log("⚠️  Sessions almost never produce a page_view: the north-star traffic does not have the shape");
    console.log("    of human browsing. Read tag loads as reach of non-human/near-instant sessions, not as readers.");
  }
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
  const gscQueryPages = await readCsv(GSC_QUERY_PAGES_CSV);
  const gscPages = await readCsv(GSC_PAGES_CSV);
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

  // Weekly-review instruments added 2026-08-31 (#010 §7 proposal 1): all three
  // are aggregations of data already exported above — no new API calls.
  const brandSplit = computeBrandSplit(gscQueryPages);
  const pageDimension = computePageDimension(gscPages);
  const divergence = computeMeasurementDivergence(events);

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
      nonBrandImpressions: brandSplit.nonBrand.impressions,
      brandImpressions: brandSplit.brand.impressions,
      nonBrandShare: brandSplit.nonBrandShare,
      pageDimensionImpressions: pageDimension.impressions,
      sessionStart: divergence.sessionStart,
      pageView: divergence.pageView,
      pageViewPerSessionStart: divergence.pageViewPerSessionStart,
      ...rates,
    },
    northStar,
    topPages: topRows(pages, 10, "views"),
    topEvents: topRows(events, 20, "eventCount"),
    acquisition: topRows(acquisition, 10, "sessions"),
    measurementDivergence: divergence,
    searchConsole: {
      brandSplit,
      pageDimension,
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

  printMeasurementDivergence(divergence);

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

  printBrandSplit(brandSplit);
  printPageDimension(pageDimension);

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
    console.log(`Non-brand impr.   : ${formatDelta(snapshot.metrics.nonBrandImpressions, prev.nonBrandImpressions)}`);
    console.log(`Page-dim impr.    : ${formatDelta(snapshot.metrics.pageDimensionImpressions, prev.pageDimensionImpressions)}`);
    console.log(`page_view/session : ${formatPctPointDelta(snapshot.metrics.pageViewPerSessionStart, prev.pageViewPerSessionStart)}`);
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

// Run only as an entry point (run-growth-review.mjs spawns this file); importing
// it from a test must not fire a full report run.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(console.error);
}
