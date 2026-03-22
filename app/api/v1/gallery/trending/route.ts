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
    // Trending = Most accessed in the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const locale = searchParams.get("locale"); // For future localized trends

    const { results } = await db.prepare(
      `SELECT j.id, j.platform, j.source_url, j.thumbnail_url, s.total_access as access_count, j.created_at
       FROM extractor_jobs j
       JOIN (
         SELECT job_id, SUM(count) as total_access
         FROM job_stats
         WHERE date >= ?
         ${locale ? "AND locale = ?" : ""}
         GROUP BY job_id
       ) s ON j.id = s.job_id
       WHERE j.platform = ? 
         AND j.status = 'completed' 
         AND j.is_public = 1 
         AND j.thumbnail_url IS NOT NULL
       ORDER BY s.total_access DESC, j.created_at DESC
       LIMIT ? OFFSET ?`
    ).bind(...[
      sevenDaysAgo, 
      ...(locale ? [locale] : []), 
      platform, 
      limit, 
      offset
    ]).all();

    return success({
      status: 200,
      requestId,
      data: results,
    });
  } catch (err) {
    console.error("DEBUG: Trending API Error", err);
    // Return empty data instead of 500 to allow pages to render static content even if DB fails
    return success({
      status: 200,
      requestId,
      data: [],
    });
  }
}
