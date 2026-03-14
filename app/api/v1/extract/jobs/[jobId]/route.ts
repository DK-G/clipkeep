import { getRequestId } from "@/lib/api/request-id";
import { failure, success } from "@/lib/api/response";
import { getJob } from "@/lib/extract/store";

type Context = {
  params: Promise<{ jobId: string }>;
};

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

  if (job.status === "completed") {
    return success({
      requestId,
      data: {
        jobId: job.id,
        status: job.status,
        media: job.media,
        warnings: job.warnings,
      },
    });
  }

  return success({
    requestId,
    data: {
      jobId: job.id,
      status: job.status,
      progress: job.progress,
    },
  });
}
