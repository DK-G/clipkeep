import type { ExtractJob } from "./types";

const STALE_SOON_MS = 2 * 60 * 1000;

export function shouldRefreshTikTokJob(job: ExtractJob): boolean {
  if (job.platform !== "tiktok") return false;
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

