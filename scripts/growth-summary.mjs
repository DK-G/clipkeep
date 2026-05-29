import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const ANALYTICS_DIR = path.join(ROOT, "docs", "analytics");
const HISTORY_DIR = path.join(ANALYTICS_DIR, "history");
const SUMMARY_JSON = path.join(ANALYTICS_DIR, "latest-ga4-summary.json");
const EVENTS_CSV = path.join(ANALYTICS_DIR, "latest-ga4-events.csv");
const PAGES_CSV = path.join(ANALYTICS_DIR, "latest-ga4-pages.csv");
const ACQUISITION_CSV = path.join(ANALYTICS_DIR, "latest-ga4-acquisition.csv");
const GSC_LOCALE_SUMMARY_CSV = path.join(ANALYTICS_DIR, "latest-gsc-locale-summary.csv");
const GSC_OPPORTUNITIES_CSV = path.join(ANALYTICS_DIR, "latest-gsc-opportunities.csv");

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

async function main() {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 CLIPKEEP GROWTH INSIGHTS");
  console.log("=".repeat(50));

  let summaryData;
  try {
    summaryData = JSON.parse(await fs.readFile(SUMMARY_JSON, "utf8"));
  } catch (e) {
    console.error("❌ No summary data found. Run 'npm run analytics:ga4' first.");
    return;
  }

  const events = await readCsv(EVENTS_CSV);
  const pages = await readCsv(PAGES_CSV);
  const acquisition = await readCsv(ACQUISITION_CSV);
  const gscLocaleSummary = await readCsv(GSC_LOCALE_SUMMARY_CSV);
  const gscOpportunities = await readCsv(GSC_OPPORTUNITIES_CSV);
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
      ...rates,
    },
    topPages: topRows(pages, 10, "views"),
    topEvents: topRows(events, 20, "eventCount"),
    acquisition: topRows(acquisition, 10, "sessions"),
    searchConsole: {
      localeSummary: topRows(gscLocaleSummary, 10, "impressions"),
      opportunities: topRows(gscOpportunities, 10, "impressions"),
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
