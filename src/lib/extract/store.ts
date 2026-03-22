import type { ExtractJob, Platform } from "./types";
import { extractTelegram, type TelegramMedia } from "./telegram";
import { extractTwitter, type TwitterMedia } from "./twitter";
import { extractInstagram, type InstagramMedia } from "./instagram";
import { extractTikTok, type TikTokMedia } from "./tiktok";
import { extractReddit } from "./reddit";
import { extractPinterest } from "./pinterest";
import { extractBluesky } from "./bluesky";
import { extractLemon8 } from "./lemon8";
import { extractBilibili } from "./bilibili";
import { extractDiscord } from "./discord";
import { extractThreads } from "./threads";
import { extractFacebook } from "./facebook";
import { getDb } from "@/lib/db/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Normalizes a URL by stripping tracking parameters and ensuring consistent format.
 */
function normalizeUrl(url: string, platform: Platform): string {
  try {
    const u = new URL(url.trim());
    u.protocol = 'https:'; // Force https
    
    // Remove common trackers
    const trackers = ['s', 't', 'ref', 'utm_source', 'utm_medium', 'utm_campaign', 'feature'];
    trackers.forEach(t => u.searchParams.delete(t));

    // Platform-specific normalization
    if (platform === 'twitter') {
      // Remove trailing slash and query entirely for status URLs
      if (u.pathname.includes('/status/')) {
        u.search = ''; 
      }
    } else if (platform === 'tiktok' || platform === 'lemon8' || platform === 'facebook') {
      // TikTok, Lemon8, and Facebook often have many trackers
      if (platform === 'facebook') {
        const kept = ['v'];
        const currentParams = Array.from(u.searchParams.keys());
        currentParams.forEach(k => {
          if (!kept.includes(k)) u.searchParams.delete(k);
        });
      } else {
        u.search = '';
      }
    } else if (platform === 'reddit') {
      // Normalize reddit URLs (remove search, consolidate domains)
      u.search = '';
      if (u.hostname === 'old.reddit.com') u.hostname = 'www.reddit.com';
    } else if (platform === 'threads') {
      u.search = '';
    }

    return u.toString().toLowerCase().replace(/\/$/, "");
  } catch {
    return url.trim().toLowerCase().replace(/\/$/, "");
  }
}

/**
 * Generates a deterministic Job ID based on the normalized URL.
 * Uses a simple prefix and a truncated part of the URL (or hash if available).
 */
async function getDeterministicJobId(platform: Platform, sourceUrl: string): Promise<string> {
  const normalized = normalizeUrl(sourceUrl, platform);
  
  // Use a hash for the final ID to avoid length issues and special characters
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `job_${platform}_${hashHex.substring(0, 16)}`;
}

/**
 * Persists or updates a job in D1.
 */
async function saveJobToDb(job: ExtractJob, locale: string = 'en'): Promise<void> {
  const db = await getDb();
  const resultPayload = JSON.stringify({
    media: job.media,
    warnings: job.warnings,
  });

  // Extract first thumbnail URL for easier access in gallery lists
  const firstThumb = job.media.find(m => m.thumbUrl)?.thumbUrl || null;

  // Telegram bundle jobs should not be public by default if they have media.
  // We want only individual "accessed" media to appear.
  const isPublic = job.platform === 'telegram' ? 0 : 1;

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

export async function createJob(platform: Platform, sourceUrl: string, locale: string = 'en'): Promise<ExtractJob> {
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

  // Initial persist
  await saveJobToDb(job, locale);

  // Background Extraction using waitUntil
  const cloudflare = await getCloudflareContext();
  if (cloudflare && cloudflare.ctx && cloudflare.ctx.waitUntil) {
    cloudflare.ctx.waitUntil((async () => {
      try {
        // Update to processing
        const processingJob = { ...job, status: "processing" as const, progress: 10, updatedAt: nowIso() };
        await saveJobToDb(processingJob);

        let results: Array<TelegramMedia | TwitterMedia | InstagramMedia | TikTokMedia> = [];
        if (platform === "telegram") {
          results = await extractTelegram(sourceUrl);
        } else if (platform === "twitter") {
          results = await extractTwitter(sourceUrl);
        } else if (platform === "instagram") {
          results = await extractInstagram(sourceUrl);
        } else if (platform === "tiktok") {
          results = await extractTikTok(sourceUrl);
        } else if (platform === "reddit") {
          results = await extractReddit(sourceUrl);
        } else if (platform === "pinterest") {
          results = await extractPinterest(sourceUrl);
        } else if (platform === "bluesky") {
          results = await extractBluesky(sourceUrl);
        } else if (platform === "lemon8") {
          results = await extractLemon8(sourceUrl);
        } else if (platform === "bilibili") {
          results = await extractBilibili(sourceUrl);
        } else if (platform === "discord") {
          results = await extractDiscord(sourceUrl);
        } else if (platform === "threads") {
          results = await extractThreads(sourceUrl);
        } else if (platform === "facebook") {
          results = await extractFacebook(sourceUrl);
        }

        if (results && results.length > 0) {
          const completed: ExtractJob = {
            ...processingJob,
            status: "completed",
            progress: 100,
            media: results.map((res) => ({
              mediaId: `m_${crypto.randomUUID()}`,
              type: res.type,
              quality: "original",
              downloadUrl: res.url,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              thumbUrl: res.thumbUrl,
            })),
            updatedAt: nowIso(),
          };
          await saveJobToDb(completed);
        } else {
          // If the extraction returned empty without throwing, it's usually because 
          // nothing was found (private account, deleted post, or unsupported format)
          await saveJobToDb({
            ...processingJob,
            status: "failed",
            warnings: ["Media could not be found. The post might be private, deleted, or the URL format is unsupported."],
            updatedAt: nowIso(),
          });
        }
      } catch (error: unknown) {
        console.error("Extraction error:", error);
        
        let userMessage = "An internal error occurred during extraction. Please try again later.";
        
        // Categorize errors based on message or type if available
        const errorStr = String(error).toLowerCase();
        if (errorStr.includes("private") || errorStr.includes("login")) {
          userMessage = "This content appears to be private or requires login. We can only download public posts.";
        } else if (errorStr.includes("404") || errorStr.includes("not found")) {
          userMessage = "The post could not be found. It may have been deleted.";
        } else if (errorStr.includes("timeout") || errorStr.includes("fetch failed")) {
          userMessage = "The extraction service timed out or is temporarily unavailable. Please try again in a few minutes.";
        }

        await saveJobToDb({
          ...job,
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

/**
 * Increments the access count for a job and updates its visibility window.
 * For Telegram, it creates a specific "gallery entry" job if a media index is provided.
 */
export async function recordAccess(jobId: string, locale: string = 'en', mediaIndex?: number): Promise<void> {
  const db = await getDb();
  const now = nowIso();
  const today = new Date().toISOString().split('T')[0];
  
  // Base access record
  await db.prepare(
    `UPDATE extractor_jobs 
     SET access_count = access_count + 1, 
         last_accessed_at = ?
     WHERE id = ?`
  ).bind(now, jobId).run();

  // Update daily stats for trending
  await db.prepare(
    `INSERT INTO job_stats (job_id, locale, date, count)
     VALUES (?, ?, ?, 1)
     ON CONFLICT(job_id, locale, date) DO UPDATE SET
       count = job_stats.count + 1`
  ).bind(jobId, locale, today).run();

  // Telegram specialized gallery logic: 
  // If a media index is specified, we ensure a "public" entry exists for this specific media.
  if (mediaIndex !== undefined) {
    const original = await getJob(jobId);
    if (original && original.platform === 'telegram' && original.media[mediaIndex]) {
      const media = original.media[mediaIndex];
      const galleryId = `gal_${jobId}_${mediaIndex}`;
      
      // We use a separate ID to allow multiple media from one job to appear independently
      // We copy the payload but focus it on this media for the gallery
      const payload = JSON.stringify({
        media: [media],
        warnings: [],
        sourceJobId: jobId
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

