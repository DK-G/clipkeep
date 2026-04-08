import puppeteer from "@cloudflare/puppeteer";
import { createJob, getJob, recordAccess } from "./extract/store";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Discovers trending URLs from X (Twitter) and TikTok using Puppeteer.
 */
async function discoverTrends(): Promise<{ twitter: string[]; tiktok: string[] }> {
  const context = await getCloudflareContext();
  const env = context.env as { clipkeep_db: D1Database; browser_rendering: Fetcher };

  const twitterUrls: string[] = [];
  const tiktokUrls: string[] = [];

  const browser = await puppeteer.launch(env.browser_rendering);
  try {
    console.log("[AutoTrend] Scraping TikTok Explore...");
    const ttPage = await browser.newPage();
    try {
      await ttPage.goto("https://www.tiktok.com/explore", { waitUntil: "networkidle2", timeout: 30000 });
      const ttLinks = await ttPage.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href*="/video/"]')) as HTMLAnchorElement[];
        return [...new Set(links.map((a) => a.href))].slice(0, 5);
      });
      tiktokUrls.push(...ttLinks);
    } catch (e) {
      console.warn("[AutoTrend] TikTok scrape failed:", e);
    }
    await ttPage.close();

    console.log("[AutoTrend] Scraping X Trends via twittrend.jp...");
    const xPage = await browser.newPage();
    try {
      await xPage.goto("https://twittrend.jp/", { waitUntil: "networkidle2", timeout: 30000 });
      const xKeywords = await xPage.evaluate(() => {
        const items = Array.from(document.querySelectorAll(".trend_list li a")) as HTMLAnchorElement[];
        return items.map((a) => a.innerText.trim()).filter((t) => t.length > 0).slice(0, 5);
      });

      for (const keyword of xKeywords) {
        if (twitterUrls.length >= 3) break;
        try {
          await xPage.goto(`https://search.yahoo.co.jp/realtime/search?p=${encodeURIComponent(keyword)}&ei=UTF-8`, { waitUntil: "networkidle2", timeout: 15000 });
          const tweetLinks = await xPage.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a[href*="/status/"]')) as HTMLAnchorElement[];
            return [...new Set(links.map((a) => a.href))];
          });
          if (tweetLinks.length > 0) twitterUrls.push(tweetLinks[0]);
        } catch (e) {
          console.warn(`[AutoTrend] Failed tweet find for ${keyword}:`, e);
        }
      }
    } catch (e) {
      console.warn("[AutoTrend] X scrape failed:", e);
    }
    await xPage.close();
  } finally {
    await browser.close();
  }

  return {
    twitter: [...new Set(twitterUrls)].slice(0, 3),
    tiktok: [...new Set(tiktokUrls)].slice(0, 3),
  };
}

async function waitForCompletion(jobId: string, attempts = 8, intervalMs = 1500) {
  for (let attempt = 0; attempt < attempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    const latest = await getJob(jobId);
    if (latest?.status === "completed") {
      return latest;
    }
    if (latest?.status === "failed") {
      return latest;
    }
  }
  return undefined;
}

/**
 * Main automation task: Discover trends and perform extractions.
 */
export async function runAutoTrendUpdate() {
  console.log("[AutoTrend] Starting hourly trend update...");

  try {
    const { twitter, tiktok } = await discoverTrends();
    console.log(`[AutoTrend] Discovered ${twitter.length} X and ${tiktok.length} TikTok URLs`);

    const allItems: Array<{ url: string; platform: "twitter" | "tiktok" }> = [];
    const max = Math.max(twitter.length, tiktok.length);
    for (let i = 0; i < max; i++) {
      if (twitter[i]) allItems.push({ url: twitter[i], platform: "twitter" });
      if (tiktok[i]) allItems.push({ url: tiktok[i], platform: "tiktok" });
    }

    const createdJobs = await Promise.allSettled(
      allItems.map(async (item) => {
        console.log(`[AutoTrend] Automating extraction for: ${item.url}`);
        const job = await createJob(item.platform, item.url, "ja");
        return { item, job };
      })
    );

    const followUps = createdJobs.map(async (result) => {
      if (result.status !== "fulfilled") {
        console.error("[AutoTrend] Failed to queue extraction:", result.reason);
        return;
      }

      const { item, job } = result.value;

      // Existing completed jobs are cache hits. Leave them untouched.
      if (job.status === "completed" || job.status === "failed") {
        console.log(`[AutoTrend] Reused existing ${job.status} job without bump: ${job.id}`);
        return;
      }

      try {
        const completed = await waitForCompletion(job.id);
        if (completed?.status === "completed") {
          await recordAccess(job.id, "ja");
          console.log(`[AutoTrend] Successfully queued and lightly boosted: ${job.id}`);
        } else if (completed?.status === "failed") {
          console.warn(`[AutoTrend] Job failed before visibility bump: ${job.id}`);
        } else {
          console.warn(`[AutoTrend] Job did not complete in time for visibility bump: ${job.id}`);
        }
      } catch (e) {
        console.error(`[AutoTrend] Extraction follow-up error for ${item.url}:`, e);
      }
    });

    await Promise.allSettled(followUps);

    return { status: "success", processed: allItems.length };
  } catch (error) {
    console.error("[AutoTrend] Update failed:", error);
    throw error;
  }
}