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

type ExtractErrorCode =
  | "AUTH"
  | "FETCH"
  | "PARSE"
  | "DOWNLOAD"
  | "TRANSCODE"
  | "TIMEOUT"
  | "RATE_LIMIT"
  | "UNKNOWN";

type CircuitState = {
  failures: number[];
  blockedUntil: number;
};

const CIRCUIT_WINDOW_MS = 2 * 60 * 1000;
const CIRCUIT_BLOCK_MS = 60 * 1000;
const CIRCUIT_FAILURE_THRESHOLD = 5;
const circuitByPlatform = new Map<Platform, CircuitState>();

function logExtractEvent(event: string, payload: Record<string, unknown>): void {
  console.log(JSON.stringify({
    service: "extractor",
    event,
    timestamp: nowIso(),
    ...payload,
  }));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCircuitState(platform: Platform): CircuitState {
  const existing = circuitByPlatform.get(platform);
  if (existing) return existing;
  const created: CircuitState = { failures: [], blockedUntil: 0 };
  circuitByPlatform.set(platform, created);
  return created;
}

function isCircuitOpen(platform: Platform): boolean {
  const state = getCircuitState(platform);
  if (state.blockedUntil <= Date.now()) {
    state.blockedUntil = 0;
    return false;
  }
  return true;
}

function registerCircuitFailure(platform: Platform): void {
  const now = Date.now();
  const state = getCircuitState(platform);
  state.failures = state.failures.filter((ts) => now - ts <= CIRCUIT_WINDOW_MS);
  state.failures.push(now);

  if (state.failures.length >= CIRCUIT_FAILURE_THRESHOLD) {
    state.blockedUntil = now + CIRCUIT_BLOCK_MS;
    logExtractEvent("extract_circuit_opened", {
      platform,
      failure_window_ms: CIRCUIT_WINDOW_MS,
      threshold: CIRCUIT_FAILURE_THRESHOLD,
      blocked_until: new Date(state.blockedUntil).toISOString(),
    });
  }
}

function registerCircuitSuccess(platform: Platform): void {
  const state = getCircuitState(platform);
  if (state.failures.length > 0 || state.blockedUntil > 0) {
    state.failures = [];
    state.blockedUntil = 0;
    logExtractEvent("extract_circuit_reset", { platform });
  }
}

async function evaluatePlatformQualityGate(platform: Platform): Promise<void> {
  const db = await getDb();
  const dayAgoIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const rows = await db.prepare(
    `SELECT status
     FROM extractor_jobs
     WHERE platform = ?
       AND status IN ('completed', 'failed')
       AND updated_at >= ?
     ORDER BY updated_at DESC
     LIMIT 20`
  ).bind(platform, dayAgoIso).all<{ status: "completed" | "failed" }>();

  const recent = rows.results ?? [];
  if (recent.length < 10) return;

  const successCount = recent.filter((row) => row.status === "completed").length;
  const successRate = successCount / recent.length;
  if (successRate < 0.65) {
    logExtractEvent("quality_gate_alert", {
      platform,
      sample_size: recent.length,
      success_rate: Number(successRate.toFixed(3)),
      threshold: 0.65,
      window: "24h",
    });
  }
}

function classifyExtractionError(err: unknown): { code: ExtractErrorCode; retryable: boolean; message: string } {
  const message = err instanceof Error ? err.message : String(err);
  const normalized = message.toLowerCase();

  if (normalized.includes("timeout") || normalized.includes("aborted")) return { code: "TIMEOUT", retryable: true, message };
  if (normalized.includes("rate limit") || normalized.includes("rate_limited")) return { code: "RATE_LIMIT", retryable: true, message };
  if (normalized.includes("bot_challenged") || normalized.includes("anti_bot")) return { code: "AUTH", retryable: true, message };
  if (normalized.includes("parse") || normalized.includes("json")) return { code: "PARSE", retryable: false, message };
  if (normalized.includes("download") || normalized.includes("expired")) return { code: "DOWNLOAD", retryable: true, message };
  if (normalized.includes("fetch failed") || normalized.includes("network")) return { code: "FETCH", retryable: true, message };

  return { code: "UNKNOWN", retryable: false, message };
}

async function runExtraction(platform: Platform, sourceUrl: string): Promise<ExtractionMedia[]> {
  if (platform === "telegram") {
    return await extractTelegram(sourceUrl) as ExtractionMedia[];
  }
  if (platform === "twitter") {
    return await extractTwitter(sourceUrl) as ExtractionMedia[];
  }
  if (platform === "tiktok") {
    return await extractTikTok(sourceUrl) as ExtractionMedia[];
  }
  if (platform === "reddit") {
    const results = await extractReddit(sourceUrl);
    return results.length > 0 ? results : await extractWithBrowser(sourceUrl);
  }
  if (platform === "pinterest") {
    const results = await extractPinterest(sourceUrl);
    return results.length > 0 ? results : await extractWithBrowser(sourceUrl);
  }
  if (platform === "bluesky") {
    const results = await extractBluesky(sourceUrl);
    return results.length > 0 ? results : await extractWithBrowser(sourceUrl);
  }
  if (platform === "lemon8") {
    const results = await extractLemon8(sourceUrl);
    return results.length > 0 ? results : await extractWithBrowser(sourceUrl);
  }
  if (platform === "bilibili") {
    const results = await extractBilibili(sourceUrl);
    if (results.length > 0) return results;
    return (await extractWithBrowser(sourceUrl)).filter((item) => item.type === "video");
  }
  if (platform === "discord") {
    const results = await extractDiscord(sourceUrl);
    return results.length > 0 ? results : await extractWithBrowser(sourceUrl);
  }
  if (platform === "threads") {
    const results = await extractThreads(sourceUrl);
    return results.length > 0 ? results : await extractWithBrowser(sourceUrl);
  }
  if (platform === "facebook") {
    const results = await extractFacebook(sourceUrl) as ExtractionMedia[];
    return results.length > 0 ? results : await extractWithBrowser(sourceUrl);
  }
  return [];
}

async function runExtractionWithRetry(platform: Platform, sourceUrl: string, jobId: string): Promise<ExtractionMedia[]> {
  if (isCircuitOpen(platform)) {
    throw new Error("UPSTREAM_TEMPORARY_FAILURE");
  }
  const maxAttempts = 3;
  const timeoutMs = 25000;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const started = Date.now();
    let timer: NodeJS.Timeout | undefined;
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Extraction timed out after 25 seconds")), timeoutMs);
      });
      const results = await Promise.race([runExtraction(platform, sourceUrl), timeoutPromise]);
      logExtractEvent("extract_attempt", {
        job_id: jobId,
        platform,
        attempt,
        max_attempts: maxAttempts,
        timeout_ms: timeoutMs,
        duration_ms: Date.now() - started,
        result: "success",
        media_count: results.length,
      });
      registerCircuitSuccess(platform);
      return results;
    } catch (err: unknown) {
      registerCircuitFailure(platform);
      const classified = classifyExtractionError(err);
      const shouldRetry = attempt < maxAttempts && classified.retryable;
      const backoffMs = shouldRetry ? Math.min(500 * (2 ** (attempt - 1)), 2000) : 0;
      logExtractEvent("extract_attempt", {
        job_id: jobId,
        platform,
        attempt,
        max_attempts: maxAttempts,
        timeout_ms: timeoutMs,
        duration_ms: Date.now() - started,
        result: "failed",
        error_code: classified.code,
        error_message: classified.message,
        retryable: classified.retryable,
        backoff_ms: backoffMs,
      });
      if (!shouldRetry) throw err;
      await sleep(backoffMs);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  return [];
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

/**
 * Atomically inserts a new queued job using INSERT OR IGNORE.
 * Returns true if this caller won the race and owns the extraction,
 * false if another concurrent request already inserted the same job.
 */
async function tryClaimJob(job: ExtractJob, locale: string = "en"): Promise<boolean> {
  const db = await getDb();
  const resultPayload = JSON.stringify({ media: [], warnings: [] });
  const isPublic = job.platform === "telegram" ? 0 : 1;

  const result = await db.prepare(
    `INSERT OR IGNORE INTO extractor_jobs
       (id, platform, source_url, status, progress, result_payload, thumbnail_url, is_public, created_at, updated_at, locale)
     VALUES (?, ?, ?, 'queued', 0, ?, NULL, ?, ?, ?, ?)`
  ).bind(
    job.id,
    job.platform,
    job.sourceUrl,
    resultPayload,
    isPublic,
    job.createdAt,
    job.updatedAt,
    locale,
  ).run();

  return (result.meta.rows_written ?? 0) > 0;
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
  if (errorMsg === "UPSTREAM_FORMAT_CHANGED") {
    return "The upstream platform response format changed and media could not be resolved. Please try again later.";
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

export async function createJob(
  platform: Platform,
  sourceUrl: string,
  locale: string = "en",
  options?: { forceRefresh?: boolean }
): Promise<ExtractJob> {
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
  if (existingJob && !options?.forceRefresh) {
    const updatedAt = new Date(existingJob.updatedAt).getTime();
    const nowTime = Date.now();

    if (existingJob.status === "completed") {
      const ageMinutes = Math.floor((nowTime - updatedAt) / (60 * 1000));
      console.log(`[Store] Cache hit (Success) for ${id} [age=${ageMinutes}m]`);
      return existingJob;
    }

    if (existingJob.status === "failed" && (nowTime - updatedAt) < 10 * 60 * 1000) {
      console.log(`[Store] Cache hit (Failed) for ${id}`);
      return existingJob;
    }

    // Extraction already running — do not restart it.
    if (existingJob.status === "queued" || existingJob.status === "processing") {
      console.log(`[Store] Extraction already in progress for ${id} [status=${existingJob.status}]`);
      return existingJob;
    }
  }

  if (existingJob && options?.forceRefresh) {
    // Avoid restarting an extraction that is already in-flight.
    if (existingJob.status === "queued" || existingJob.status === "processing") {
      console.log(`[Store] Force refresh skipped: extraction already in progress for ${id} [status=${existingJob.status}]`);
      return existingJob;
    }

    // Requeue existing deterministic job id and start a fresh extraction pass.
    await saveJobToDb(job, locale);
  } else {
    // Atomically claim the job slot. If another concurrent request beat us to it,
    // return their job instead of starting a duplicate extraction.
    const claimed = await tryClaimJob(job, locale);
    if (!claimed) {
      const concurrent = await getJob(id);
      if (concurrent) {
        console.log(`[Store] Concurrent claim detected for ${id}, deferring to existing job`);
        return concurrent;
      }
    }
  }

  const cloudflare = await getCloudflareContext();
  if (cloudflare && cloudflare.ctx && cloudflare.ctx.waitUntil) {
    cloudflare.ctx.waitUntil((async () => {
      const processingJob = { ...job, status: "processing" as const, progress: 10, updatedAt: nowIso() };

      try {
        logExtractEvent("extract_start", {
          job_id: id,
          platform,
          source_url: sourceUrl,
        });
        await saveJobToDb(processingJob);
        const results = await runExtractionWithRetry(platform, sourceUrl, id);

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
              text: res.text,
              authorName: res.authorName,
              authorHandle: res.authorHandle,
              publishedAt: res.publishedAt,
              groupIndex: res.groupIndex,
              sourcePath: res.sourcePath,
            })),
            updatedAt: nowIso(),
          };
          await saveJobToDb(completed);
          await evaluatePlatformQualityGate(platform);
          logExtractEvent("extract_done", {
            job_id: id,
            platform,
            job_result: "success",
            downloaded_files: completed.media.length,
            output_formats: [...new Set(completed.media.map((item) => item.type))],
          });
        } else {
          // Keep previously completed media available if refresh fails.
          if (existingJob?.status === "completed" && existingJob.media.length > 0) {
            await saveJobToDb({
              ...existingJob,
              warnings: ["Media refresh failed; serving the last successful extraction."],
              updatedAt: nowIso(),
            });
          } else {
            await saveJobToDb({
              ...processingJob,
              status: "failed",
              warnings: ["Media could not be found. The post might be private, deleted, or the URL format is unsupported."],
              updatedAt: nowIso(),
            });
            await evaluatePlatformQualityGate(platform);
            logExtractEvent("extract_done", {
              job_id: id,
              platform,
              job_result: "failed",
              failure_point: "media_not_found",
            });
          }
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

        // Keep previously completed media available if refresh errors out.
        if (existingJob?.status === "completed" && existingJob.media.length > 0) {
          await saveJobToDb({
            ...existingJob,
            warnings: [userMessage],
            updatedAt: nowIso(),
          });
        } else {
          await saveJobToDb({
            ...processingJob,
            status: "failed",
            warnings: [userMessage],
            updatedAt: nowIso(),
          });
          await evaluatePlatformQualityGate(platform);
          const classified = classifyExtractionError(error);
          logExtractEvent("extract_done", {
            job_id: id,
            platform,
            job_result: "failed",
            failure_point: classified.code,
            error_message: classified.message,
          });
        }
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












