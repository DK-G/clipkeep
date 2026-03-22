import { getDb } from "@/lib/db/d1";
import { success, failure } from "@/lib/api/response";
import { getRequestId } from "@/lib/api/request-id";


export async function GET(request: Request) {
  const requestId = await getRequestId();
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");
  const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);
  const offset = parseInt(searchParams.get("offset") || "0");

  if (!platform) {
    return failure({
      status: 400,
      requestId,
      error: { code: "MISSING_PLATFORM", message: "platform query param is required", details: {} },
    });
  }

  try {
    const db = await getDb();
    const { results } = await db.prepare(
      `SELECT id, platform, source_url, thumbnail_url, access_count, created_at
       FROM extractor_jobs
       WHERE ${platform === 'all' ? '1=1' : 'platform = ?'} AND status = 'completed' AND is_public = 1 AND thumbnail_url IS NOT NULL
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`
    ).bind(...[
      ...(platform === 'all' ? [] : [platform]),
      limit, 
      offset
    ]).all();

    return success({
      status: 200,
      requestId,
      data: results,
    });
  } catch (err) {
    console.error("DEBUG: Recent API Error", err);
    // Return empty data instead of 500 to allow pages to render static content even if DB fails
    return success({
      status: 200,
      requestId,
      data: [],
    });
  }
}
