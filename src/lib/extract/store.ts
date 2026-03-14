import type { ExtractJob, Platform } from "@/lib/extract/types";
import { extractTelegram, type TelegramMedia } from "@/lib/extract/telegram";
import { extractTwitter, type TwitterMedia } from "@/lib/extract/twitter";
import { getDb } from "@/lib/db/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Persists or updates a job in D1.
 */
async function saveJobToDb(job: ExtractJob): Promise<void> {
  const db = await getDb();
  const resultPayload = JSON.stringify({
    media: job.media,
    warnings: job.warnings,
  });

  await db.prepare(
    `INSERT INTO extractor_jobs (id, platform, source_url, status, progress, result_payload, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       status = excluded.status,
       progress = excluded.progress,
       result_payload = excluded.result_payload,
       updated_at = excluded.updated_at`
  ).bind(
    job.id,
    job.platform,
    job.sourceUrl,
    job.status,
    job.progress,
    resultPayload,
    job.createdAt,
    job.updatedAt
  ).run();
}

export async function createJob(platform: Platform, sourceUrl: string): Promise<ExtractJob> {
  const now = nowIso();
  const id = `job_${crypto.randomUUID()}`;

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
  await saveJobToDb(job);

  // Background Extraction using waitUntil
  const cloudflare = await getCloudflareContext();
  if (cloudflare && cloudflare.ctx && cloudflare.ctx.waitUntil) {
    cloudflare.ctx.waitUntil((async () => {
      try {
        // Update to processing
        const processingJob = { ...job, status: "processing" as const, progress: 10, updatedAt: nowIso() };
        await saveJobToDb(processingJob);

        let results: Array<TelegramMedia | TwitterMedia> = [];
        if (platform === "telegram") {
          results = await extractTelegram(sourceUrl);
        } else if (platform === "twitter") {
          results = await extractTwitter(sourceUrl);
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
          await saveJobToDb({
            ...processingJob,
            status: "failed",
            warnings: ["Could not extract media from the provided URL. Make sure it contains a public video."],
            updatedAt: nowIso(),
          });
        }
      } catch (error) {
        console.error("Extraction error:", error);
        await saveJobToDb({
          ...job,
          status: "failed",
          warnings: ["An internal error occurred during extraction."],
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

