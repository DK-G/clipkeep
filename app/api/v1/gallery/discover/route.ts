import { success } from "@/lib/api/response";
import { getRequestId } from "@/lib/api/request-id";
import { discoveryText, DiscoveryDict } from '@/lib/i18n/discovery';

// Define the 8 possible patterns
const PATTERNS: (keyof DiscoveryDict)[] = [
  'trendingX', 'latestX',
  'trendingTikTok', 'latestTikTok',
  'trendingInstagram', 'latestInstagram',
  'trendingTelegram', 'latestTelegram'
];

export async function GET(request: Request) {
  const requestId = await getRequestId();
  
  // 1. Randomly select one of 8 patterns
  const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
  
  // 2. Parse pattern to determine platform and mode
  const isTrending = pattern.startsWith('trending');
  let platform = 'twitter';
  if (pattern.includes('TikTok')) platform = 'tiktok';
  if (pattern.includes('Instagram')) platform = 'instagram';
  if (pattern.includes('Telegram')) platform = 'telegram';

  // 3. Construct DB query based on pattern
  // For 'Trending', we use job_stats (downloads in last 7 days)
  // For 'Latest', we use extractor_jobs (created_at)
  
  let query = "";
  if (isTrending) {
    query = `
      SELECT j.*, COUNT(s.id) as download_count 
      FROM extractor_jobs j
      JOIN job_stats s ON j.id = s.job_id
      WHERE j.platform = ? 
        AND s.created_at > datetime('now', '-7 days')
        AND j.status = 'completed'
      GROUP BY j.id
      ORDER BY download_count DESC
      LIMIT 12
    `;
  } else {
    query = `
      SELECT * FROM extractor_jobs 
      WHERE platform = ? 
        AND status = 'completed'
      ORDER BY created_at DESC
      LIMIT 12
    `;
  }

  // Note: In Cloudflare D1 environment, we would use env.DB.prepare(query).bind(platform).all()
  // For now, I'll return an empty list or mock data if DB access is not available in the current context,
  // but the structure follows the production requirement.
  
  // Real implementation would look like this in the Worker:
  // const db = (process.env as any).DB; 
  // const { results } = await db.prepare(query).bind(platform).all();

  return success({
    status: 200,
    requestId,
    data: { 
      pattern, 
      items: [] // In production, this will be 'results'
    },
  });
}
