const DEFAULT_WINDOW_MS = 60000;
const DEFAULT_LIMIT = 30;

type Bucket = {
  timestamps: number[];
};

const buckets = new Map<string, Bucket>();

function trim(bucket: Bucket, now: number, windowMs: number): void {
  const threshold = now - windowMs;
  bucket.timestamps = bucket.timestamps.filter((t: number) => t > threshold);
}

function checkInMemory(key: string, now: number, windowMs: number, limit: number): { limited: boolean; retryAfterSec: number } {
  const bucket = buckets.get(key) ?? { timestamps: [] };
  trim(bucket, now, windowMs);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0];
    const retryAfterMs = Math.max(0, oldest + windowMs - now);
    buckets.set(key, bucket);
    return { limited: true, retryAfterSec: Math.ceil(retryAfterMs / 1000) };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { limited: false, retryAfterSec: 0 };
}

async function checkViaEndpoint(endpoint: string, key: string, windowMs: number, limit: number): Promise<{ limited: boolean; retryAfterSec: number } | null> {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key, windowMs, limit }),
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
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
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? String(DEFAULT_WINDOW_MS), 10);
  const limit = parseInt(process.env.RATE_LIMIT_LIMIT ?? String(DEFAULT_LIMIT), 10);
  const endpoint = process.env.RATE_LIMIT_DO_ENDPOINT?.trim();
  const now = Date.now();

  if (endpoint) {
    const fromDo = await checkViaEndpoint(endpoint, key, windowMs, limit);
    if (fromDo) {
      return { ...fromDo, source: 'do', limit, windowMs };
    }
  }

  const local = checkInMemory(key, now, windowMs, limit);
  return { ...local, source: 'fallback', limit, windowMs };
}

export function getClientKey(request: Request): string {
  const direct = request.headers.get('cf-connecting-ip')?.trim();
  if (direct) return direct;

  const xff = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (xff) return xff;

  return 'unknown';
}
