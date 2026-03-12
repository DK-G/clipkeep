const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? "60000", 10);
const LIMIT_PER_WINDOW = parseInt(process.env.RATE_LIMIT_LIMIT ?? "30", 10);

type Bucket = {
  timestamps: number[];
};

const buckets = new Map<string, Bucket>();

function trim(bucket: Bucket, now: number): void {
  const threshold = now - WINDOW_MS;
  bucket.timestamps = bucket.timestamps.filter((t) => t > threshold);
}

function checkInMemory(key: string, now = Date.now()): { limited: boolean; retryAfterSec: number } {
  const bucket = buckets.get(key) ?? { timestamps: [] };
  trim(bucket, now);

  if (bucket.timestamps.length >= LIMIT_PER_WINDOW) {
    const oldest = bucket.timestamps[0];
    const retryAfterMs = Math.max(0, oldest + WINDOW_MS - now);
    buckets.set(key, bucket);
    return { limited: true, retryAfterSec: Math.ceil(retryAfterMs / 1000) };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { limited: false, retryAfterSec: 0 };
}

async function checkViaEndpoint(endpoint: string, key: string): Promise<{ limited: boolean; retryAfterSec: number } | null> {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key, windowMs: WINDOW_MS, limit: LIMIT_PER_WINDOW }),
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const payload = (await res.json()) as { limited?: boolean; retryAfterSec?: number };
    if (typeof payload.limited !== 'boolean') return null;
    return { limited: payload.limited, retryAfterSec: payload.retryAfterSec ?? 0 };
  } catch {
    return null;
  }
}

export type RateLimitResult = {
  limited: boolean;
  retryAfterSec: number;
  source: 'do' | 'fallback';
  limit: number;
  windowMs: number;
};

export async function checkExtractRateLimit(key: string): Promise<RateLimitResult> {
  const endpoint = process.env.RATE_LIMIT_DO_ENDPOINT?.trim();
  if (endpoint) {
    const fromDo = await checkViaEndpoint(endpoint, key);
    if (fromDo) {
      return { ...fromDo, source: 'do', limit: LIMIT_PER_WINDOW, windowMs: WINDOW_MS };
    }
  }

  const local = checkInMemory(key);
  return { ...local, source: 'fallback', limit: LIMIT_PER_WINDOW, windowMs: WINDOW_MS };
}

export function getClientKey(request: Request): string {
  const direct = request.headers.get('cf-connecting-ip')?.trim();
  if (direct) return direct;

  const xff = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (xff) return xff;

  return 'unknown';
}
