import type { ExtractJob, Platform, ExtractionMedia } from "./types";
import { extractTelegram } from "./telegram";
import { extractTwitter } from "./twitter";
import { extractTikTok } from "./tiktok";
import { extractReddit } from "./reddit";
import { extractPinterest } from "./pinterest";
import { extractBluesky } from "./bluesky";
import { extractBilibili } from "./bilibili";
import { extractFacebook } from "./facebook";
import { extractDiscord } from "./discord";
import { extractLemon8 } from "./lemon8";
import { extractThreads } from "./threads";
import { extractWithBrowser } from "./browser";
import { getDb } from "@/lib/db/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeUrl(url: string, platform: Platform): string {
  try {
    const u = new URL(url.trim());
    u.protocol = "https:";

    const trackers = ["s", "t", "ref", "utm_source", "utm_medium", "utm_campaign", "feature"];
    trackers.forEach((t) => u.searchParams.delete(t));

    if (platform === "twitter") {
      if (u.hostname === "x.com") u.hostname = "twitter.com";
      const statusMatch = u.pathname.match(/\/status\/(\d+)/i);
      if (statusMatch) {
        u.pathname = `/status/${statusMatch[1]}`;
        u.search = "";
      }
    } else if (platform === "tiktok" || platform === "lemon8" || platform === "facebook") {
      if (platform === "facebook") {
        const kept = ["v"];
        const currentParams = Array.from(u.searchParams.keys());
        currentParams.forEach((k) => {
          if (!kept.includes(k)) u.searchParams.delete(k);
        });
      } else {
        u.search = "";
      }
    } else if (platform === "reddit") {
      u.search = "";
      if (u.hostname === "old.reddit.com") u.hostname = "www.reddit.com";
    } else if (platform === "threads") {
      u.search = "";
    } else if (platform === "bilibili") {
      u.search = "";
      // Strip trailing slash and ensure www.bilibili.com
      if (u.hostname === "bilibili.com") u.hostname = "www.bilibili.com";
    }

    return u.toString().toLowerCase().replace(/\/$/, "");
  } catch {
    return url.trim().toLowerCase().replace(/\/$/, "");
  }
}

async function getDeterministicJobId(platform: Platform, sourceUrl: string): Promise<string> {
  const normalized = normalizeUrl(sourceUrl, platform);
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return `job_${platform}_${hashHex.substring(0, 16)}`;
}

async function saveJobToDb(job: ExtractJob, locale: string = "en"): Promise<void> {
  const db = await getDb();
  const resultPayload = JSON.stringify({
    media: job.media,
    warnings: job.warnings,
  });

  const firstThumb = job.media.find((m) => m.thumbUrl)?.thumbUrl || null;
  const isPublic = job.platform === "telegram" ? 0 : 1;

  await db.prepare(
    `INSERT INTO extractor_jobs (id, platform, source_url, status, progress, result_payload, thumbnail_url, is_public, created_at, updated_at, locale)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       status = excluded.status,
       progress = excluded.progress,
       result_payload = excluded.result_payload,
       thumbnail_url = coalesce(excluded.thumbnail_url, extractor_jobs.thumbnail_url),
       is_public = excluded.is_public,
       updated_at = excluded.updated_at,
       locale = coalesce(extractor_jobs.locale, excluded.locale)`
  ).bind(
    job.id,
    job.platform,
    job.sourceUrl,
    job.status,
    job.progress,
    resultPayload,
    firstThumb,
    isPublic,
    job.createdAt,
    job.updatedAt,
    locale
  ).run();
}

function mapExtractionError(errorMsg: string): string {
  if (errorMsg === "PRIVATE_POST" || errorMsg === "PRIVATE_OR_RESTRICTED") {
    return "This content appears to be private. We can only download public posts.";
  }
  if (errorMsg === "INVALID_X_URL") {
    return "The provided X/Twitter URL is invalid.";
  }
  if (errorMsg === "POST_NOT_FOUND") {
    return "The post could not be found. It may have been deleted or is unavailable.";
  }
  if (errorMsg === "BOT_CHALLENGED" || errorMsg === "ANTI_BOT_BLOCKED") {
    return "We encountered a temporary restriction from the platform. Please try again later.";
  }
  if (errorMsg === "MEDIA_NOT_FOUND") {
    return "No downloadable media was found in this post.";
  }
  if (errorMsg === "SHORT_URL_RESOLVE_FAILED") {
    return "We could not resolve the short URL for this post.";
  }
  if (errorMsg === "RATE_LIMITED") {
    return "The upstream platform temporarily rate-limited extraction. Please try again later.";
  }
  if (errorMsg === "DOWNLOAD_EXPIRED" || errorMsg === "DIRECT_URL_EXPIRED") {
    return "The media link expired before download could complete. Please retry.";
  }
  if (errorMsg === "LOGIN_WALL") {
    return "This content currently requires login and is not supported.";
  }
  if (errorMsg === "VIDEO_URL_NOT_RESOLVED" || errorMsg === "CID_NOT_RESOLVED") {
    return "A downloadable video URL could not be resolved for this post.";
  }
  if (errorMsg === "MESSAGE_NOT_FOUND") {
    return "The Telegram post could not be found. It may have been deleted.";
  }
  if (errorMsg === "PIN_NOT_FOUND") {
    return "The Pinterest pin could not be found or is unavailable.";
  }
  if (errorMsg === "PIN_DATA_NOT_FOUND") {
    return "Pinterest did not expose downloadable media data for this pin.";
  }
  if (errorMsg === "UNSUPPORTED_URL") {
    return "This link format is not supported right now.";
  }
  if (errorMsg === "UPSTREAM_TEMPORARY_FAILURE") {
    return "The upstream platform temporarily failed to return the media. Please try again later.";
  }
  if (errorMsg === "ACCESS_DENIED") {
    return "The media URL is no longer accessible with the current Discord permissions or signature.";
  }
  if (errorMsg === "REGION_RESTRICTED") {
    return "This content is not available in the current region.";
  }
  if (errorMsg === "AGE_GATED") {
    return "This content is age-restricted and is not supported.";
  }
  return "An internal error occurred during extraction. Please try again later.";
}

export async function createJob(platform: Platform, sourceUrl: string, locale: string = "en"): Promise<ExtractJob> {
  const now = nowIso();
  const id = await getDeterministicJobId(platform, sourceUrl);

  const job: ExtractJob = {
    id,
    platform,
    sourceUrl,
    status: "queued",
    progress: 0,
    media: [],
    warnings: [],
    createdAt: now,
    updatedAt: now,
  };

  const existingJob = await getJob(id);
  if (existingJob) {
    const updatedAt = new Date(existingJob.updatedAt).getTime();
    const nowTime = Date.now();

    if (existingJob.status === "completed" && (nowTime - updatedAt) < 24 * 60 * 60 * 1000) {
      console.log(`[Store] Cache hit (Success) for ${id}`);
      return existingJob;
    }

    if (existingJob.status === "failed" && (nowTime - updatedAt) < 10 * 60 * 1000) {
      console.log(`[Store] Cache hit (Failed) for ${id}`);
      return existingJob;
    }
  }

  await saveJobToDb(job, locale);

  const cloudflare = await getCloudflareContext();
  if (cloudflare && cloudflare.ctx && cloudflare.ctx.waitUntil) {
    cloudflare.ctx.waitUntil((async () => {
      const processingJob = { ...job, status: "processing" as const, progress: 10, updatedAt: nowIso() };

      try {
        console.log(`[Store] Starting extraction for ${id} (${platform})`);
        await saveJobToDb(processingJob);

        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Extraction timed out after 25 seconds")), 25000);
        });

        let results: ExtractionMedia[] = [];

        await Promise.race([
          (async () => {
            if (platform === "telegram") {
              results = await extractTelegram(sourceUrl) as ExtractionMedia[];
            } else if (platform === "twitter") {
              results = await extractTwitter(sourceUrl) as ExtractionMedia[];            } else if (platform === "tiktok") {
              results = await extractTikTok(sourceUrl) as ExtractionMedia[];
            } else if (platform === "reddit") {
              results = await extractReddit(sourceUrl);
              if (results.length === 0) results = await extractWithBrowser(sourceUrl);
            } else if (platform === "pinterest") {
              results = await extractPinterest(sourceUrl);
              if (results.length === 0) results = await extractWithBrowser(sourceUrl);
            } else if (platform === "bluesky") {
              results = await extractBluesky(sourceUrl);
              if (results.length === 0) results = await extractWithBrowser(sourceUrl);
            } else if (platform === "lemon8") {
              results = await extractLemon8(sourceUrl);
              if (results.length === 0) results = await extractWithBrowser(sourceUrl);
            } else if (platform === "bilibili") {
              results = await extractBilibili(sourceUrl);
              if (results.length === 0) {
                results = (await extractWithBrowser(sourceUrl)).filter((item) => item.type === "video");
              }
            } else if (platform === "discord") {
              results = await extractDiscord(sourceUrl);
              if (results.length === 0) results = await extractWithBrowser(sourceUrl);
            } else if (platform === "threads") {
              results = await extractThreads(sourceUrl);
              if (results.length === 0) results = await extractWithBrowser(sourceUrl);
            } else if (platform === "facebook") {
              results = await extractFacebook(sourceUrl) as ExtractionMedia[];
              if (results.length === 0) results = await extractWithBrowser(sourceUrl);
            }
          })(),
          timeoutPromise,
        ]);

        console.log(`[Store] Extraction results for ${id}: ${results.length} items`);

        if (results.length > 0) {
          const completed: ExtractJob = {
            ...processingJob,
            status: "completed",
            progress: 100,
            media: results.map((res) => ({
              mediaId: `m_${crypto.randomUUID()}`,
              type: res.type,
              quality: res.quality || "original",
              url: res.url,
              downloadUrl: res.downloadUrl || res.url,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              thumbUrl: res.thumbUrl,
              title: res.title,
              sourcePath: res.sourcePath,
            })),
            updatedAt: nowIso(),
          };
          await saveJobToDb(completed);
        } else {
          await saveJobToDb({
            ...processingJob,
            status: "failed",
            warnings: ["Media could not be found. The post might be private, deleted, or the URL format is unsupported."],
            updatedAt: nowIso(),
          });
        }
      } catch (error: unknown) {
        console.error("Extraction error:", error);
        const errorMsg = error instanceof Error ? error.message : String(error);
        let userMessage = mapExtractionError(errorMsg);

        if (userMessage === "An internal error occurred during extraction. Please try again later.") {
          const errorStr = errorMsg.toLowerCase();
          if (errorStr.includes("private") || errorStr.includes("login")) {
            userMessage = "This content requires login or is private. Only public posts are supported.";
          } else if (errorStr.includes("404") || errorStr.includes("not found")) {
            userMessage = "The post could not be found. It may have been deleted.";
          } else if (errorStr.includes("timeout") || errorStr.includes("fetch failed")) {
            userMessage = "The service timed out. Please try again later.";
          }
        }

        await saveJobToDb({
          ...processingJob,
          status: "failed",
          warnings: [userMessage],
          updatedAt: nowIso(),
        });
      }
    })());
  }

  return job;
}

export async function getJob(jobId: string): Promise<ExtractJob | undefined> {
  const db = await getDb();
  const row = (await db.prepare(
    "SELECT * FROM extractor_jobs WHERE id = ?"
  ).bind(jobId).first()) as {
    id: string;
    platform: string;
    source_url: string;
    status: string;
    progress: number;
    result_payload: string;
    created_at: string;
    updated_at: string;
  } | null;

  if (!row) return undefined;

  const payload = JSON.parse(row.result_payload || '{"media":[],"warnings":[]}');

  return {
    id: row.id,
    platform: row.platform as Platform,
    sourceUrl: row.source_url,
    status: row.status as ExtractJob["status"],
    progress: row.progress,
    media: payload.media,
    warnings: payload.warnings,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function recordAccess(jobId: string, locale: string = "en", mediaIndex?: number): Promise<void> {
  const db = await getDb();
  const now = nowIso();
  const today = new Date().toISOString().split("T")[0];

  await db.prepare(
    `UPDATE extractor_jobs 
     SET access_count = access_count + 1, 
         last_accessed_at = ?
     WHERE id = ?`
  ).bind(now, jobId).run();

  await db.prepare(
    `INSERT INTO job_stats (job_id, locale, date, count)
     VALUES (?, ?, ?, 1)
     ON CONFLICT(job_id, locale, date) DO UPDATE SET
       count = job_stats.count + 1`
  ).bind(jobId, locale, today).run();

  if (mediaIndex !== undefined) {
    const original = await getJob(jobId);
    if (original && original.platform === "telegram" && original.media[mediaIndex]) {
      const media = original.media[mediaIndex];
      const galleryId = `gal_${jobId}_${mediaIndex}`;
      const payload = JSON.stringify({
        media: [media],
        warnings: [],
        sourceJobId: jobId,
      });

      await db.prepare(
        `INSERT INTO extractor_jobs (id, platform, source_url, status, progress, result_payload, thumbnail_url, is_public, access_count, created_at, updated_at, last_accessed_at, locale)
         VALUES (?, ?, ?, 'completed', 100, ?, ?, 1, 1, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           access_count = extractor_jobs.access_count + 1,
           last_accessed_at = excluded.last_accessed_at,
           updated_at = excluded.updated_at,
           locale = coalesce(extractor_jobs.locale, excluded.locale)`
      ).bind(
        galleryId,
        original.platform,
        original.sourceUrl,
        payload,
        media.thumbUrl,
        original.createdAt,
        now,
        now,
        locale
      ).run();
    }
  }
}











