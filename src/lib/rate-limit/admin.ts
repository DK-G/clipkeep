type Bucket = { timestamps: number[] };
const buckets = new Map<string, Bucket>();

export function checkInMemory(key: string, now: number, windowMs: number, limit: number): { limited: boolean; retryAfterSec: number } {
  const bucket = buckets.get(key) ?? { timestamps: [] };
  const threshold = now - windowMs;
  bucket.timestamps = bucket.timestamps.filter(t => t > threshold);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0];
    const retryAfterSec = Math.ceil(Math.max(0, oldest + windowMs - now) / 1000);
    buckets.set(key, bucket);
    return { limited: true, retryAfterSec };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { limited: false, retryAfterSec: 0 };
}

export function getClientKey(request: Request): string {
  const direct = request.headers.get('cf-connecting-ip')?.trim();
  if (direct) return direct;
  const xff = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (xff) return xff;
  return 'unknown';
}
