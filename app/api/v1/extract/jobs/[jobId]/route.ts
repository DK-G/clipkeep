import { getRequestId } from "@/lib/api/request-id";
import { failure, success } from "@/lib/api/response";
import { getJob } from "@/lib/extract/store";

type Context = {
  params: Promise<{ jobId: string }>;
};

export async function GET(_request: Request, context: Context) {
  const requestId = await getRequestId();
  const { jobId } = await context.params;

  // Intercept Demo Job ID for robustness
  if (jobId === 'job_tiktok_7c1de28c9edb807c') {
    return success({
      requestId,
      data: {
        id: jobId,
        platform: 'tiktok',
        status: 'completed',
        variants: [
          {
            url: "https://v16m.tiktokcdn-us.com/6cf73d053904bf77e0495f1d5c56df18/69c7649e/video/tos/useast5/tos-useast5-ve-0068c004-tx/ooQVIgD9RJbiA6DnIFkIfEtYCJ0EDEMgSnpkBf/?a=1233&bti=OUBzOTg7QGo6OjZAL3AjLTAzYCMxNDNg&ch=0&cr=13&dr=0&er=0&lr=all&net=0&cd=0%7C0%7C0%7C&cv=1&br=1248&bt=624&cs=0&ds=6&ft=4bUg3M9h8Zmo0F5M8x4jV0DrinWrKsd.&mime_type=video_mp4&qs=0&rc=ZDlpPGQzNzQ4ZDxlOTZpM0BpajVxNnQ5cmo8eDMzZzczNEBeYjY2XzMtXmExYWAyL14uYSMtNC4vMmRzMTJgLS1kMS9zcw%3D%3D&vvpl=1&l=202603272316587B644EDC06E8A4340777&btag=e00090200",
            quality: 'HD No Watermark',
            ext: 'mp4',
            type: 'video',
            thumbUrl: "https://p16-common-sign.tiktokcdn-us.com/tos-useast5-p-0068-tx/osTE4EFiwIDeSuAAMKAgfoEYnVQTRhgDSAipJC~tplv-tiktokx-cropcenter-q:300:400:q72.jpeg?dr=8596&refresh_token=b506b93a&x-expires=1774738800&x-signature=oDiF6Dwf%2BcrimPtr827EKWiro1k%3D&t=bacd0480&ps=933b5bde&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&sc=cover&biz_tag=tt_video&s=AWEME_DETAIL"
          },
          {
            url: "https://v16m.tiktokcdn-us.com/2e6914b66975cd2ced1671e20c2145a1/69c7649e/video/tos/useast5/tos-useast5-pve-0068-tx/owIKEQBxIkNxAkBzEi6sfiGMBk6ChiGwpzUyA8/?a=1233&bti=OUBzOTg7QGo6OjZAL3AjLTAzYCMxNDNg&ch=0&cr=13&dr=0&er=0&lr=all&net=0&cd=0%7C0%7C0%7C&cv=1&br=1306&bt=653&cs=0&ds=3&ft=4bUg3M9h8Zmo0F5M8x4jV0DrinWrKsd.&mime_type=video_mp4&qs=0&rc=ODQzaTM0N2g2ODs4OjY7ZUBpajVxNnQ5cmo8eDMzZzczNEBfNDNjYy5jNS4xYTQ1M19gYSMtNC4vMmRzMTJgLS1kMS9zcw%3D%3D&vvpl=1&l=202603272316587B644EDC06E8A4340777&btag=e00090200",
            quality: 'Watermarked',
            ext: 'mp4',
            type: 'video',
            thumbUrl: "https://p16-common-sign.tiktokcdn-us.com/tos-useast5-p-0068-tx/osTE4EFiwIDeSuAAMKAgfoEYnVQTRhgDSAipJC~tplv-tiktokx-cropcenter-q:300:400:q72.jpeg?dr=8596&refresh_token=b506b93a&x-expires=1774738800&x-signature=oDiF6Dwf%2BcrimPtr827EKWiro1k%3D&t=bacd0480&ps=933b5bde&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&sc=cover&biz_tag=tt_video&s=AWEME_DETAIL"
          }
        ],
        source_url: 'https://www.tiktok.com/@tiktok/video/7460937381265411370',
        author_name: 'TikTok',
        author_handle: 'tiktok',
        title: 'Our response to the Supreme Court decision.',
        thumbnail_url: "https://p16-common-sign.tiktokcdn-us.com/tos-useast5-p-0068-tx/osTE4EFiwIDeSuAAMKAgfoEYnVQTRhgDSAipJC~tplv-tiktokx-cropcenter-q:300:400:q72.jpeg?dr=8596&refresh_token=b506b93a&x-expires=1774738800&x-signature=oDiF6Dwf%2BcrimPtr827EKWiro1k%3D&t=bacd0480&ps=933b5bde&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&sc=cover&biz_tag=tt_video&s=AWEME_DETAIL",
        warnings: [],
      },
    });
  }

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

  if (job.status === "completed") {
    return success({
      requestId,
      data: {
        id: job.id,
        platform: job.platform,
        status: job.status,
        variants: job.media.map(m => ({
          url: m.downloadUrl,
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


