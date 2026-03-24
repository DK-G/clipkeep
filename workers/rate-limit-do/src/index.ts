export interface Env {
  RATE_LIMITER: DurableObjectNamespace;
}

type CheckRequest = {
  key: string;
  windowMs?: number;
  limit?: number;
};

type CheckResponse = {
  limited: boolean;
  retryAfterSec: number;
};

const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_LIMIT = 30;

export class RateLimiterDO {
  constructor(private readonly state: DurableObjectState) {}

  async fetch(request: Request): Promise<Response> {
    if (request.method !== "POST") {
      return json({ error: "method_not_allowed" }, 405);
    }

    let body: CheckRequest;
    try {
      body = (await request.json()) as CheckRequest;
    } catch {
      return json({ error: "invalid_json" }, 400);
    }

    const key = body.key?.trim();
    if (!key) {
      return json({ error: "key_required" }, 400);
    }

    const windowMs = clamp(body.windowMs ?? DEFAULT_WINDOW_MS, 1_000, 10 * 60_000);
    const limit = clamp(body.limit ?? DEFAULT_LIMIT, 1, 10_000);

    const now = Date.now();
    const storageKey = `k:${key}`;
    const stored = ((await this.state.storage.get(storageKey)) as number[] | undefined) ?? [];

    const threshold = now - windowMs;
    const active = stored.filter((t) => t > threshold);

    let result: CheckResponse;
    if (active.length >= limit) {
      const oldest = active[0];
      const retryAfterSec = Math.ceil(Math.max(0, oldest + windowMs - now) / 1000);
      result = { limited: true, retryAfterSec };
    } else {
      active.push(now);
      result = { limited: false, retryAfterSec: 0 };
    }

    await this.state.storage.put(storageKey, active);
    await this.state.storage.setAlarm(now + windowMs + 5_000);

    return json(result, 200);
  }

  async alarm(): Promise<void> {
    const now = Date.now();
    const entries = await this.state.storage.list<number[]>();
    for (const [k, timestamps] of entries.entries()) {
      const keep = timestamps.filter((t) => t > now - 10 * 60_000);
      if (keep.length === 0) {
        await this.state.storage.delete(k);
      } else if (keep.length !== timestamps.length) {
        await this.state.storage.put(k, keep);
      }
    }
  }
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return json({ error: "method_not_allowed" }, 405);
    }

    let body: CheckRequest;
    try {
      body = (await request.json()) as CheckRequest;
    } catch {
      return json({ error: "invalid_json" }, 400);
    }

    const key = body.key?.trim();
    if (!key) {
      return json({ error: "key_required" }, 400);
    }

    const id = env.RATE_LIMITER.idFromName(key);
    const stub = env.RATE_LIMITER.get(id);

    return stub.fetch("https://rate-limit.internal/check", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  },
};

