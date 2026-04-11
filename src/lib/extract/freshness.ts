import type { ExtractJob } from "./types";

const STALE_SOON_MS = 2 * 60 * 1000;

function shouldRefreshExpiringJob(job: ExtractJob, platforms: ReadonlyArray<ExtractJob["platform"]>): boolean {
  if (!platforms.includes(job.platform)) return false;
  if (job.status !== "completed") return false;
  if (!job.media || job.media.length === 0) return false;

  const now = Date.now();
  return job.media.some((media) => {
    if (!media.expiresAt) return true;
    const expiresAt = Date.parse(media.expiresAt);
    if (Number.isNaN(expiresAt)) return true;
    return expiresAt <= now + STALE_SOON_MS;
  });
}

export function shouldRefreshTikTokJob(job: ExtractJob): boolean {
  return shouldRefreshExpiringJob(job, ["tiktok"]);
}

export function shouldRefreshTwitterJob(job: ExtractJob): boolean {
  return shouldRefreshExpiringJob(job, ["twitter"]);
}

export function shouldRefreshTelegramJob(job: ExtractJob): boolean {
  return shouldRefreshExpiringJob(job, ["telegram"]);
}

export function shouldRefreshThreadsJob(job: ExtractJob): boolean {
  return shouldRefreshExpiringJob(job, ["threads"]);
}
