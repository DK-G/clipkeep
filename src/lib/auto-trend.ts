import puppeteer from "@cloudflare/puppeteer";
import { createJob, getJob, recordAccess } from "./extract/store";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type TrendPlatform = "twitter" | "tiktok";
const TARGET_PER_PLATFORM = 1;

function normalizeTwitterUrl(url: string): string | null {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.toLowerCase();
    if (!["x.com", "www.x.com", "twitter.com", "www.twitter.com"].includes(host)) {
      return null;
    }

    const match = parsed.pathname.match(/^\/([^/]+)\/status\/(\d+)/);
    if (!match) return null;
    const [, handle, statusId] = match;
    return `https://x.com/${handle}/status/${statusId}`;
  } catch {
    return null;
  }
}

function normalizeTikTokUrl(url: string): string | null {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.toLowerCase();
    if (!["tiktok.com", "www.tiktok.com", "m.tiktok.com"].includes(host)) {
      return null;
    }

    const match = parsed.pathname.match(/^\/@[^/]+\/video\/(\d+)/);
    if (!match) return null;
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return null;
  }
}

function extractMatches(html: string, pattern: RegExp, normalizer: (url: string) => string | null): string[] {
  const matches = html.match(pattern) ?? [];
  const normalized = matches
    .map((raw) => raw.replace(/&amp;/g, "&"))
    .map((raw) => normalizer(raw))
    .filter((value): value is string => Boolean(value));
  return [...new Set(normalized)];
}

async function getRecentlySeenUrls(platform: TrendPlatform, limit = 120): Promise<Set<string>> {
  const context = await getCloudflareContext();
  const env = context.env as { clipkeep_db: D1Database };
  const result = await env.clipkeep_db
    .prepare(
      `SELECT source_url
       FROM extractor_jobs
       WHERE platform = ?1
         AND source_url IS NOT NULL
       ORDER BY created_at DESC
       LIMIT ?2`
    )
    .bind(platform, limit)
    .all<{ source_url: string }>();

  return new Set(
    (result.results ?? [])
      .map((row) => row.source_url)
      .filter((value): value is string => Boolean(value))
      .map((value) => (platform === "twitter" ? normalizeTwitterUrl(value) : normalizeTikTokUrl(value)))
      .filter((value): value is string => Boolean(value))
  );
}

async function getFallbackCandidate(platform: TrendPlatform): Promise<string | null> {
  const context = await getCloudflareContext();
  const env = context.env as { clipkeep_db: D1Database };
  const result = await env.clipkeep_db
    .prepare(
      `SELECT source_url
       FROM extractor_jobs
       WHERE platform = ?1
         AND status = 'completed'
         AND is_public = 1
         AND source_url IS NOT NULL
       ORDER BY COALESCE(last_accessed_at, created_at) ASC, created_at DESC
       LIMIT 12`
    )
    .bind(platform)
    .all<{ source_url: string }>();

  const normalizer = platform === "twitter" ? normalizeTwitterUrl : normalizeTikTokUrl;
  for (const row of result.results ?? []) {
    const normalized = normalizer(row.source_url);
    if (normalized) return normalized;
  }
  return null;
}

/**
 * Discovers trending URLs from X (Twitter) and TikTok using Puppeteer.
 */
async function discoverTrends(): Promise<{ twitter: string[]; tiktok: string[] }> {
  const context = await getCloudflareContext();
  const env = context.env as { clipkeep_db: D1Database; browser_rendering: Fetcher };

  const twitterUrls: string[] = [];
  const tiktokUrls: string[] = [];
  const [recentTwitterUrls, recentTikTokUrls] = await Promise.all([
    getRecentlySeenUrls("twitter"),
    getRecentlySeenUrls("tiktok"),
  ]);

  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;
  try {
    browser = await puppeteer.launch(env.browser_rendering);
  } catch (error) {
    console.error("[AutoTrend] Browser launch failed:", error);
    return { twitter: [], tiktok: [] };
  }
  try {
    console.log("[AutoTrend] Scraping TikTok Explore...");
    const ttPage = await browser.newPage();
    try {
      await ttPage.goto("https://www.tiktok.com/explore", { waitUntil: "networkidle2", timeout: 30000 });
      const ttCandidates = await ttPage.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href*="/video/"], a[href*="/@"]')) as HTMLAnchorElement[];
        const hrefs = links.map((a) => a.href);
        const html = document.documentElement.innerHTML;
        const regex = /https:\/\/(?:www\.)?tiktok\.com\/@[^"'\\\s<]+\/video\/\d+/g;
        const inline = html.match(regex) ?? [];
        return [...new Set([...hrefs, ...inline])];
      });
      const ttLinks = ttCandidates
        .map((url) => normalizeTikTokUrl(url))
        .filter((value): value is string => Boolean(value))
        .filter((url) => !recentTikTokUrls.has(url))
        .slice(0, 6);
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
        if (twitterUrls.length >= TARGET_PER_PLATFORM) break;
        try {
          await xPage.goto(`https://search.yahoo.co.jp/realtime/search?p=${encodeURIComponent(keyword)}&ei=UTF-8`, { waitUntil: "networkidle2", timeout: 15000 });
          const tweetCandidates = await xPage.evaluate(() => {
            const links = Array.from(document.querySelectorAll("a")) as HTMLAnchorElement[];
            const hrefs = links.map((a) => a.href);
            const html = document.documentElement.innerHTML;
            return { hrefs, html };
          });
          const tweetLinks = [
            ...tweetCandidates.hrefs.map((href) => normalizeTwitterUrl(href)).filter((value): value is string => Boolean(value)),
            ...extractMatches(
              tweetCandidates.html,
              /https:\/\/(?:www\.)?(?:x|twitter)\.com\/[^"'\\\s<]+\/status\/\d+/g,
              normalizeTwitterUrl
            ),
          ].filter((url, index, array) => array.indexOf(url) === index && !recentTwitterUrls.has(url));
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
    twitter: [...new Set(twitterUrls)].slice(0, TARGET_PER_PLATFORM),
    tiktok: [...new Set(tiktokUrls)].slice(0, TARGET_PER_PLATFORM),
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
    if (twitter[0]) allItems.push({ url: twitter[0], platform: "twitter" });
    if (tiktok[0]) allItems.push({ url: tiktok[0], platform: "tiktok" });

    if (allItems.length === 0) {
      console.warn("[AutoTrend] No fresh candidates discovered. Falling back to existing public items.");
      const [fallbackTwitter, fallbackTikTok] = await Promise.all([
        getFallbackCandidate("twitter"),
        getFallbackCandidate("tiktok"),
      ]);
      if (fallbackTwitter) allItems.push({ url: fallbackTwitter, platform: "twitter" });
      if (fallbackTikTok) allItems.push({ url: fallbackTikTok, platform: "tiktok" });
    }

    if (allItems.length === 0) {
      console.warn("[AutoTrend] No fallback candidates available. Skipping this cycle.");
      return { status: "success", processed: 0, skipped: true, reason: "no_candidates" };
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

      // Cache-hit completed jobs should still receive a light visibility bump.
      if (job.status === "completed") {
        await recordAccess(job.id, "ja");
        console.log(`[AutoTrend] Reused existing completed job with access bump: ${job.id}`);
        return;
      }

      if (job.status === "failed") {
        console.log(`[AutoTrend] Reused existing failed job without bump: ${job.id}`);
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
