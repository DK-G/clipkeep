import puppeteer from "@cloudflare/puppeteer";
import { createJob, getJob, recordAccess } from "./extract/store";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { recordTopicLinks, recordRunMeta, type TopicLink, type DiscoveryDiag } from "./trends/topic-store";

type TrendPlatform = "twitter" | "tiktok";
const TARGET_PER_PLATFORM = 3;

/** A discovered candidate with the trend label (keyword/hashtag) it came from. */
type TrendItem = { url: string; topic: string | null };

function dedupeByUrl(items: TrendItem[]): TrendItem[] {
  const seen = new Set<string>();
  const out: TrendItem[] = [];
  for (const item of items) {
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    out.push(item);
  }
  return out;
}

async function getTrendKv(): Promise<KVNamespace | null> {
  const env = (await getCloudflareContext()).env as { TREND_KV?: KVNamespace };
  return env.TREND_KV ?? null;
}

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
         AND created_at > datetime('now', '-7 days')
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
async function discoverTrends(): Promise<{ twitter: TrendItem[]; tiktok: TrendItem[]; diag: DiscoveryDiag }> {
  const context = await getCloudflareContext();
  const env = context.env as { clipkeep_db: D1Database; browser_rendering: Fetcher };

  const twitterItems: TrendItem[] = [];
  const tiktokItems: TrendItem[] = [];
  // 段階別診断（柱2 捕捉ゼロの真因切り分け用）。fallbackUsed は呼び出し側で確定する。
  const diag: DiscoveryDiag = {
    browserLaunched: false,
    tiktokRaw: 0,
    tiktokKept: 0,
    twittrendKeywords: 0,
    twitterKept: 0,
    fallbackUsed: false,
    stageErrors: [],
  };
  const [recentTwitterUrls, recentTikTokUrls] = await Promise.all([
    getRecentlySeenUrls("twitter"),
    getRecentlySeenUrls("tiktok"),
  ]);

  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;
  try {
    browser = await puppeteer.launch(env.browser_rendering);
    diag.browserLaunched = true;
  } catch (error) {
    console.error("[AutoTrend] Browser launch failed:", error);
    diag.stageErrors.push("browser_launch");
    return { twitter: [], tiktok: [], diag };
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
      diag.tiktokRaw = ttCandidates.length;
      const ttLinks = ttCandidates
        .map((url) => normalizeTikTokUrl(url))
        .filter((value): value is string => Boolean(value))
        .filter((url) => !recentTikTokUrls.has(url))
        .slice(0, 6);
      diag.tiktokKept = ttLinks.length;
      // TikTok explore does not expose a reliable per-URL topic label yet (Phase 0).
      tiktokItems.push(...ttLinks.map((url) => ({ url, topic: null as string | null })));
    } catch (e) {
      console.warn("[AutoTrend] TikTok scrape failed:", e);
      diag.stageErrors.push("tiktok_scrape");
    }
    await ttPage.close();

    console.log("[AutoTrend] Scraping X Trends via twittrend.jp...");
    const xPage = await browser.newPage();
    try {
      await xPage.goto("https://twittrend.jp/", { waitUntil: "networkidle2", timeout: 30000 });
      const xKeywords = await xPage.evaluate(() => {
        const items = Array.from(document.querySelectorAll(".trend a")) as HTMLAnchorElement[];
        return items.map((a) => a.innerText.trim()).filter((t) => t.length > 0).slice(0, 10);
      });
      diag.twittrendKeywords = xKeywords.length;

      for (const keyword of xKeywords) {
        if (twitterItems.length >= TARGET_PER_PLATFORM) break;
        try {
          await xPage.goto(`https://search.yahoo.co.jp/realtime/search?p=${encodeURIComponent(keyword)}&ei=UTF-8`, { waitUntil: "networkidle2", timeout: 15000 });
          const tweetCandidates = await xPage.evaluate(() => {
            const timeLinks = Array.from(document.querySelectorAll("time a")) as HTMLAnchorElement[];
            const hrefs = timeLinks.map((a) => a.href);
            const allLinks = Array.from(document.querySelectorAll("a")) as HTMLAnchorElement[];
            const allHrefs = allLinks.map((a) => a.href);
            const html = document.documentElement.innerHTML;
            return { hrefs: [...new Set([...hrefs, ...allHrefs])], html };
          });
          const tweetLinks = [
            ...tweetCandidates.hrefs.map((href) => normalizeTwitterUrl(href)).filter((value): value is string => Boolean(value)),
            ...extractMatches(
              tweetCandidates.html,
              /https:\/\/(?:www\.)?(?:x|twitter)\.com\/[^"'\\\s<]+\/status\/\d+/g,
              normalizeTwitterUrl
            ),
          ].filter((url, index, array) => array.indexOf(url) === index && !recentTwitterUrls.has(url));
          if (tweetLinks.length > 0) twitterItems.push({ url: tweetLinks[0], topic: keyword });
        } catch (e) {
          console.warn(`[AutoTrend] Failed tweet find for ${keyword}:`, e);
          diag.stageErrors.push("yahoo_realtime");
        }
      }
    } catch (e) {
      console.warn("[AutoTrend] X scrape failed:", e);
      diag.stageErrors.push("twittrend_scrape");
    }
    await xPage.close();
  } finally {
    await browser.close();
  }

  const twitter = dedupeByUrl(twitterItems).slice(0, TARGET_PER_PLATFORM);
  diag.twitterKept = twitter.length;
  return {
    twitter,
    tiktok: dedupeByUrl(tiktokItems).slice(0, TARGET_PER_PLATFORM),
    diag,
  };
}

async function waitForCompletion(jobId: string, attempts = 20, intervalMs = 2000) {
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
    const { twitter, tiktok, diag } = await discoverTrends();
    console.log(`[AutoTrend] Discovered ${twitter.length} X and ${tiktok.length} TikTok URLs`);

    const allItems: Array<{ url: string; platform: "twitter" | "tiktok"; topic: string | null }> = [];
    if (twitter[0]) allItems.push({ url: twitter[0].url, platform: "twitter", topic: twitter[0].topic });
    if (tiktok[0]) allItems.push({ url: tiktok[0].url, platform: "tiktok", topic: tiktok[0].topic });

    if (allItems.length === 0) {
      console.warn("[AutoTrend] No fresh candidates discovered. Falling back to existing public items.");
      const [fallbackTwitter, fallbackTikTok] = await Promise.all([
        getFallbackCandidate("twitter"),
        getFallbackCandidate("tiktok"),
      ]);
      // Fallback items have no trend topic.
      if (fallbackTwitter) allItems.push({ url: fallbackTwitter, platform: "twitter", topic: null });
      if (fallbackTikTok) allItems.push({ url: fallbackTikTok, platform: "tiktok", topic: null });
      diag.fallbackUsed = allItems.length > 0;
    }

    if (allItems.length === 0) {
      console.warn("[AutoTrend] No fallback candidates available. Skipping this cycle.");
      // Heartbeat so an empty cycle is still observable in KV.
      try {
        const kv = await getTrendKv();
        if (kv) {
          await recordRunMeta(kv, {
            discovered: { twitter: twitter.length, tiktok: tiktok.length },
            topicsWritten: 0,
            jobsLinked: 0,
            diag,
          });
        }
      } catch (e) {
        console.error("[AutoTrend] Run-meta persistence failed:", e);
      }
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

      // Pre-register in job_stats immediately so the job surfaces in trending
      // as soon as extraction completes, even if waitForCompletion times out.
      try {
        await recordAccess(job.id, "ja");
        console.log(`[AutoTrend] Pre-registered job_stats entry for: ${job.id}`);
      } catch (e) {
        console.warn(`[AutoTrend] Pre-register recordAccess failed for ${job.id}:`, e);
      }

      try {
        const completed = await waitForCompletion(job.id);
        if (completed?.status === "completed") {
          await recordAccess(job.id, "ja");
          console.log(`[AutoTrend] Successfully queued and boosted: ${job.id}`);
        } else if (completed?.status === "failed") {
          console.warn(`[AutoTrend] Job failed before completion bump: ${job.id}`);
        } else {
          console.warn(`[AutoTrend] Job did not complete in time for completion bump: ${job.id}`);
        }
      } catch (e) {
        console.error(`[AutoTrend] Extraction follow-up error for ${item.url}:`, e);
      }
    });

    await Promise.allSettled(followUps);

    // ── Persist trend topic -> jobIds map (柱2 Phase 0, KV) ──────────────────
    try {
      const kv = await getTrendKv();
      if (kv) {
        const topicLinks: TopicLink[] = [];
        for (const result of createdJobs) {
          if (result.status !== "fulfilled") continue;
          const { item, job } = result.value;
          if (!item.topic) continue;
          topicLinks.push({ topic: item.topic, platform: item.platform, jobId: job.id, sourceUrl: item.url });
        }

        const { topicsWritten, jobsLinked } = topicLinks.length
          ? await recordTopicLinks(kv, topicLinks, "ja")
          : { topicsWritten: 0, jobsLinked: 0 };

        await recordRunMeta(kv, {
          discovered: { twitter: twitter.length, tiktok: tiktok.length },
          topicsWritten,
          jobsLinked,
          diag,
        });
        console.log(`[AutoTrend] KV topics written=${topicsWritten} jobsLinked=${jobsLinked}`);
      } else {
        console.warn("[AutoTrend] TREND_KV binding missing; skipped topic persistence.");
      }
    } catch (e) {
      console.error("[AutoTrend] Topic persistence failed:", e);
    }

    return { status: "success", processed: allItems.length };
  } catch (error) {
    console.error("[AutoTrend] Update failed:", error);
    throw error;
  }
}
