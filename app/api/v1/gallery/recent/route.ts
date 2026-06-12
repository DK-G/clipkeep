import { getDb } from "@/lib/db/d1";
import { success, failure } from "@/lib/api/response";
import { getRequestId } from "@/lib/api/request-id";

const VALID_PLATFORMS = new Set(['all', 'twitter', 'tiktok', 'telegram', 'threads', 'instagram']);

function getStartDate(range: string | null) {
  const days = range === 'today' ? 1 : range === 'week' ? 7 : 30;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function parseIntParam(value: string | null, fallback: number, max?: number): number | null {
  const parsed = parseInt(value ?? String(fallback), 10);
  if (Number.isNaN(parsed) || parsed < 0) return null;
  return max !== undefined ? Math.min(parsed, max) : parsed;
}

export async function GET(request: Request) {
  const requestId = await getRequestId();
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");
  const range = searchParams.get('range');

  if (!platform) {
    return failure({ status: 400, requestId, error: { code: "MISSING_PLATFORM", message: "platform query param is required", details: {} } });
  }

  if (!VALID_PLATFORMS.has(platform)) {
    return failure({ status: 400, requestId, error: { code: "INVALID_PLATFORM", message: "Invalid platform value", details: { platform } } });
  }

  const limit = parseIntParam(searchParams.get("limit"), 12, 50);
  const offset = parseIntParam(searchParams.get("offset"), 0);

  if (limit === null || offset === null) {
    return failure({ status: 400, requestId, error: { code: "INVALID_PARAMS", message: "limit and offset must be non-negative integers", details: {} } });
  }

  try {
    const db = await getDb();
    const startDate = getStartDate(range);
    const { results } = await db.prepare(
      `SELECT id, platform, source_url, thumbnail_url, access_count, created_at, last_accessed_at
       FROM extractor_jobs
       WHERE ${platform === 'all' ? '1=1' : 'platform = ?'}
         AND status = 'completed'
         AND is_public = 1
         AND thumbnail_url IS NOT NULL
         AND COALESCE(last_accessed_at, created_at) >= ?
       ORDER BY COALESCE(last_accessed_at, created_at) DESC
       LIMIT ? OFFSET ?`
    ).bind(...[
      ...(platform === 'all' ? [] : [platform]),
      startDate,
      limit,
      offset
    ]).all();

    return success({ status: 200, requestId, data: results });
  } catch (err) {
    console.error("Recent API Error", err);
    return failure({ status: 500, requestId, error: { code: "DB_ERROR", message: "Failed to fetch recent items", details: {} } });
  }
}
