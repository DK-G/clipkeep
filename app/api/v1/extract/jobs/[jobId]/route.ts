import { getRequestId } from "@/lib/api/request-id";
import { failure, success } from "@/lib/api/response";
import { createJob, getJob } from "@/lib/extract/store";
import { shouldRefreshTelegramJob, shouldRefreshThreadsJob, shouldRefreshTikTokJob, shouldRefreshTwitterJob } from "@/lib/extract/freshness";

type Context = {
  params: Promise<{ jobId: string }>;
};

function ensureProxyDownloadUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("/api/v1/extract/proxy?")) return url;
  if (/^https?:\/\//i.test(url)) {
    return `/api/v1/extract/proxy?url=${encodeURIComponent(url)}&dl=1`;
  }
  return url;
}

export async function GET(_request: Request, context: Context) {
  const requestId = await getRequestId();
  const { jobId } = await context.params;

  const job = await getJob(jobId);
  if (!job) {
    return failure({
      status: 404,
      requestId,
      error: {
        code: "JOB_NOT_FOUND",
        message: "Job not found",
        details: { jobId },
      },
    });
  }

  if (shouldRefreshTikTokJob(job) || shouldRefreshTwitterJob(job) || shouldRefreshTelegramJob(job) || shouldRefreshThreadsJob(job)) {
    await createJob(job.platform, job.sourceUrl, "en", { forceRefresh: true });
    return success({
      requestId,
      data: {
        id: job.id,
        platform: job.platform,
        status: "processing",
        progress: 10,
        variants: [],
        source_url: job.sourceUrl,
        warnings: ["Refreshing expiring media links. Please wait a moment."],
      },
    });
  }

  if (job.status === "completed") {
    return success({
      requestId,
      data: {
        id: job.id,
        platform: job.platform,
        status: job.status,
        variants: job.media.map(m => ({
          url: ensureProxyDownloadUrl(m.downloadUrl || m.url),
          quality: m.quality,
          ext: m.type === 'video' ? 'mp4' : m.type === 'image' ? 'jpg' : 'mp3',
          type: m.type,
          thumbUrl: m.thumbUrl,
        })),
        source_url: job.sourceUrl,
        author_name: job.media[0]?.authorName,
        author_handle: job.media[0]?.authorHandle,
        title: job.media[0]?.text || job.media[0]?.title,
        thumbnail_url: job.media[0]?.thumbUrl,
        warnings: job.warnings,
      },
    });
  }

  return success({
    requestId,
    data: {
      id: job.id,
      platform: job.platform,
      status: job.status,
      progress: job.progress,
      variants: [],
      source_url: job.sourceUrl,
      warnings: job.warnings || [],
    },
  });
}
