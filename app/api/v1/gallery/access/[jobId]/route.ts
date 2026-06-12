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
    const mediaIndexRaw = searchParams.get('index');
    const locale = searchParams.get('locale') || 'en';

    let mediaIndex: number | undefined;
    if (mediaIndexRaw !== null) {
      const parsed = parseInt(mediaIndexRaw, 10);
      if (Number.isNaN(parsed) || parsed < 0) {
        return failure({ status: 400, requestId, error: { code: "INVALID_INDEX", message: "index must be a non-negative integer", details: {} } });
      }
      mediaIndex = parsed;
    }

    await recordAccess(jobId, locale, mediaIndex);
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

