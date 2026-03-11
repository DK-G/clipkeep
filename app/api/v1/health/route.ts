export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { evaluateDegraded } from "@/lib/degraded/evaluator";
import { getRequestId } from "@/lib/api/request-id";
import { success } from "@/lib/api/response";

export async function GET() {
  const requestId = await getRequestId();
  const degraded = evaluateDegraded();

  return success({
    requestId,
    degraded: degraded.isDegraded,
    data: {
      status: degraded.isDegraded ? "degraded" : "ok",
      services: {
        db: "ok",
        extractor: degraded.isDegraded ? "degraded" : "ok",
      },
      degradedReason: degraded.reason,
      metrics: degraded.metrics,
    },
  });
}
