import { getDb } from "@/lib/db/d1";
import { success, failure } from "@/lib/api/response";
import { getRequestId } from "@/lib/api/request-id";

function getStartDate(range: string | null, fallbackDays: number) {
  const days = range === 'today' ? 1 : range === 'month' ? 30 : fallbackDays;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
}

export async function GET(request: Request) {
  const requestId = await getRequestId();
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");
  const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);
  const offset = parseInt(searchParams.get("offset") || "0");
  const range = searchParams.get('range');

  if (!platform) {
    return failure({ status: 400, requestId, error: { code: "MISSING_PLATFORM", message: "platform query param is required", details: {} } });
  }

  try {
    const db = await getDb();
    const startDate = getStartDate(range, 7);

    // LEFT JOIN so jobs with no job_stats entries (e.g. newly created or bot-missed)
    // still appear, ranked by period stats first then by lifetime access_count.
    const { results } = await db.prepare(
      `SELECT j.id, j.platform, j.source_url, j.thumbnail_url,
              COALESCE(s.total_access, j.access_count, 0) as access_count, j.created_at
       FROM extractor_jobs j
       LEFT JOIN (
         SELECT job_id, SUM(count) as total_access
         FROM job_stats
         WHERE date >= ?
         GROUP BY job_id
       ) s ON j.id = s.job_id
       WHERE ${platform === 'all' ? '1=1' : 'j.platform = ?'}
         AND j.status = 'completed'
         AND j.is_public = 1
         AND j.thumbnail_url IS NOT NULL
       ORDER BY COALESCE(s.total_access, 0) DESC, j.access_count DESC, j.created_at DESC
       LIMIT ? OFFSET ?`
    ).bind(...[
      startDate,
      ...(platform === 'all' ? [] : [platform]),
      limit,
      offset,
    ]).all();

    return success({ status: 200, requestId, data: results });
  } catch (err) {
    console.error("DEBUG: Trending API Error", err);
    return success({ status: 200, requestId, data: [] });
  }
}
