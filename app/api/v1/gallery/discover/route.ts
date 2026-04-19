import { getDb } from "@/lib/db/d1";
import { success, failure } from "@/lib/api/response";
import { getRequestId } from "@/lib/api/request-id";

const PATTERNS = [
  { key: 'trendingX', platform: 'twitter', mode: 'trending' },
  { key: 'latestX', platform: 'twitter', mode: 'latest' },
  { key: 'trendingTikTok', platform: 'tiktok', mode: 'trending' },
  { key: 'latestTikTok', platform: 'tiktok', mode: 'latest' },
  { key: 'trendingTelegram', platform: 'telegram', mode: 'trending' },
  { key: 'latestTelegram', platform: 'telegram', mode: 'latest' },
  { key: 'globalTrending', platform: null, mode: 'trending' },
] as const;

export async function GET() {
  const requestId = await getRequestId();
  const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];

  try {
    const db = await getDb();
    let results: unknown[] = [];

    if (pattern.mode === 'trending') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      const query = `SELECT j.id, j.platform, j.source_url, j.thumbnail_url, s.total_access as access_count, j.created_at
         FROM extractor_jobs j
         JOIN (
           SELECT job_id, SUM(count) as total_access
           FROM job_stats
           WHERE date >= ?
           GROUP BY job_id
         ) s ON j.id = s.job_id
         WHERE ${pattern.platform ? 'j.platform = ? AND' : ''} j.status = 'completed'
           AND j.is_public = 1
           AND j.thumbnail_url IS NOT NULL
         ORDER BY s.total_access DESC, j.created_at DESC
         LIMIT 12`;
      const bindings = pattern.platform ? [sevenDaysAgo, pattern.platform] : [sevenDaysAgo];
      ({ results } = await db.prepare(query).bind(...bindings).all());
    } else {
      const query = `SELECT id, platform, source_url, thumbnail_url, access_count, created_at
         FROM extractor_jobs
         WHERE ${pattern.platform ? 'platform = ? AND' : ''} status = 'completed'
           AND is_public = 1
           AND thumbnail_url IS NOT NULL
         ORDER BY created_at DESC
         LIMIT 12`;
      const bindings = pattern.platform ? [pattern.platform] : [];
      ({ results } = await db.prepare(query).bind(...bindings).all());
    }

    return success({
      status: 200,
      requestId,
      data: {
        pattern: pattern.key,
        items: results,
      },
    });
  } catch (err) {
    console.error("Discover API Error", err);
    return failure({
      status: 500,
      requestId,
      error: { code: "DB_ERROR", message: "Failed to fetch discover items", details: {} },
    });
  }
}
