import { recordAccess } from "@/lib/extract/store";
import { success, failure } from "@/lib/api/response";
import { getRequestId } from "@/lib/api/request-id";


export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const requestId = await getRequestId();
  const { jobId } = await params;

  if (!jobId) {
    return failure({
      status: 400,
      requestId,
      error: { code: "MISSING_JOB_ID", message: "jobId is required", details: { jobId } },
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const mediaIndex = searchParams.get('index');
    await recordAccess(jobId, mediaIndex ? parseInt(mediaIndex) : undefined);
    return success({
      status: 200,
      requestId,
      data: { recorded: true },
    });
  } catch {
    return failure({
      status: 500,
      requestId,
      error: { code: "TRACKING_ERROR", message: "Failed to record access", details: {} },
    });
  }
}
