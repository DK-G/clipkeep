import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const ANALYTICS_DIR = path.join(ROOT, "docs", "analytics");
const SUMMARY_JSON = path.join(ANALYTICS_DIR, "latest-ga4-summary.json");
const EVENTS_CSV = path.join(ANALYTICS_DIR, "latest-ga4-events.csv");

async function readCsv(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const lines = content.split("\n").filter(Boolean);
    const headers = lines[0].split(",");
    return lines.slice(1).map((line) => {
      const values = line.split(",");
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
  const findEventCount = (name) => {
    const ev = events.find(e => e.eventName === name);
    return ev ? parseInt(ev.eventCount, 10) : 0;
  };

  const l28 = summaryData.ranges.last28Days || {};
  const sessions = l28.sessions || 0;
  
  // Key Funnel Events
  const focus = findEventCount("extract_form_focus");
  const submit = findEventCount("extract_submit");
  const complete = findEventCount("processing_complete");
  const invalidUrl = findEventCount("extract_invalid_url");

  // Growth Loop Events
  const shares = findEventCount("share_click");
  const discoveryClicks = findEventCount("discovery_card_click") + findEventCount("gallery_card_click") + findEventCount("discovery_intent_from_result");
  const relatedClicks = findEventCount("result_related_click");
  const totalGrowthInteractions = shares + discoveryClicks + relatedClicks;

  console.log(`\n📅 Data Period: Last 28 Days (as of ${new Date(summaryData.generatedAt).toLocaleDateString()})`);
  console.log(`📈 Active Users: ${l28.activeUsers}`);
  console.log(`📊 Sessions: ${sessions}`);

  const pct = (val, total) => total > 0 ? ((val / total) * 100).toFixed(1) + "%" : "0.0%";

  console.log("\n🎯 CONVERSION FUNNEL (Linear)");
  console.log("-".repeat(40));
  console.log(`1. Form Interest  : ${focus.toString().padEnd(5)} clicks (${pct(focus, sessions)} of sessions)`);
  console.log(`2. Intent to Clip : ${submit.toString().padEnd(5)} submits (${pct(submit, sessions)} of sessions)`);
  console.log(`3. Success Rate   : ${complete.toString().padEnd(5)} completes (${pct(complete, submit)} of submits)`);

  console.log("\n♻️  GROWTH LOOPS (Network Effects)");
  console.log("-".repeat(40));
  console.log(`1. Viral Potential : ${shares.toString().padEnd(5)} shares  (${pct(shares, complete)} share rate per success)`);
  console.log(`2. Discovery Depth : ${discoveryClicks.toString().padEnd(5)} clicks  (${pct(discoveryClicks, sessions)} engagement rate)`);
  console.log(`3. Related Clicks  : ${relatedClicks.toString().padEnd(5)} clicks  (${pct(relatedClicks, complete)} conversion to discovery)`);
  
  const viralFactor = complete > 0 ? (shares / complete).toFixed(2) : "0.00";
  console.log(`\n🔥 Viral Factor (Est): ${viralFactor} (Higher = better viral loop)`);

  if (invalidUrl > 0) {
    console.log(`\n⚠️  FRICTION POINTS`);
    console.log("-".repeat(40));
    console.log(`- Invalid URLs: ${invalidUrl} (${pct(invalidUrl, submit)} of total attempts)`);
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
