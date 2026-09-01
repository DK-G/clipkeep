import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkExtractRateLimit, getClientKey } from './extract';

// HC-9 (backlog #010 優先3): pin the rate-limit layer's contract so that the
// fail-closed behaviour cannot regress silently.
//
// `checkInMemory` is module-private and the in-memory bucket map is module
// state, so everything here goes through the public `checkExtractRateLimit`.
// Two consequences shape these tests:
//   - buckets are shared across the whole file -> every test uses a fresh key.
//   - time is controlled by stubbing `Date.now`, not by fake timers, because
//     `checkViaEndpoint` builds an `AbortSignal.timeout(5000)` that would
//     otherwise be captured by the fake clock.

const ENV_KEYS = ['RATE_LIMIT_WINDOW_MS', 'RATE_LIMIT_LIMIT', 'RATE_LIMIT_DO_ENDPOINT'] as const;

let savedEnv: Record<string, string | undefined> = {};
let keySeq = 0;

/** A bucket key no other test has touched. */
function freshKey(name: string): string {
  keySeq += 1;
  return `${name}-${keySeq}`;
}

function setNow(ms: number): void {
  vi.spyOn(Date, 'now').mockReturnValue(ms);
}

function request(headers: Record<string, string>): Request {
  return new Request('https://clipkeep.net/api/v1/extract/prepare', { headers });
}

beforeEach(() => {
  savedEnv = {};
  for (const key of ENV_KEYS) {
    savedEnv[key] = process.env[key];
    delete process.env[key];
  }
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) delete process.env[key];
    else process.env[key] = savedEnv[key];
  }
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('getClientKey', () => {
  it('prefers cf-connecting-ip over x-forwarded-for', () => {
    const key = getClientKey(request({ 'cf-connecting-ip': '203.0.113.7', 'x-forwarded-for': '198.51.100.1' }));
    expect(key).toBe('203.0.113.7');
  });

  it('falls back to the first x-forwarded-for entry (the client, not the proxies)', () => {
    const key = getClientKey(request({ 'x-forwarded-for': '198.51.100.1, 203.0.113.9, 192.0.2.44' }));
    expect(key).toBe('198.51.100.1');
  });

  it('trims surrounding whitespace on both header paths', () => {
    expect(getClientKey(request({ 'cf-connecting-ip': '  203.0.113.7  ' }))).toBe('203.0.113.7');
    expect(getClientKey(request({ 'x-forwarded-for': '  198.51.100.1 , 203.0.113.9' }))).toBe('198.51.100.1');
  });

  it('treats a blank cf-connecting-ip as absent and moves on to x-forwarded-for', () => {
    const key = getClientKey(request({ 'cf-connecting-ip': '   ', 'x-forwarded-for': '198.51.100.1' }));
    expect(key).toBe('198.51.100.1');
  });

  it('buckets unattributable callers together under "unknown" rather than throwing', () => {
    expect(getClientKey(request({}))).toBe('unknown');
    expect(getClientKey(request({ 'x-forwarded-for': '   ' }))).toBe('unknown');
  });
});

describe('checkExtractRateLimit - in-memory fallback', () => {
  it('allows exactly `limit` requests in a window, then limits', async () => {
    process.env.RATE_LIMIT_LIMIT = '3';
    process.env.RATE_LIMIT_WINDOW_MS = '60000';
    const key = freshKey('burst');
    setNow(1_000_000);

    for (let i = 0; i < 3; i += 1) {
      const result = await checkExtractRateLimit(key);
      expect(result.limited).toBe(false);
      expect(result.retryAfterSec).toBe(0);
    }

    const blocked = await checkExtractRateLimit(key);
    expect(blocked.limited).toBe(true);
    expect(blocked.source).toBe('fallback');
  });

  it('reports the effective limit and window it actually enforced', async () => {
    process.env.RATE_LIMIT_LIMIT = '7';
    process.env.RATE_LIMIT_WINDOW_MS = '15000';
    setNow(1_000_000);

    const result = await checkExtractRateLimit(freshKey('echo'));
    expect(result).toMatchObject({ limited: false, source: 'fallback', limit: 7, windowMs: 15000 });
  });

  it('defaults to 30 requests per 60s when the env is unset', async () => {
    setNow(1_000_000);
    const result = await checkExtractRateLimit(freshKey('defaults'));
    expect(result.limit).toBe(30);
    expect(result.windowMs).toBe(60000);
  });

  it('counts retry-after down as the oldest request ages out of the window', async () => {
    process.env.RATE_LIMIT_LIMIT = '1';
    process.env.RATE_LIMIT_WINDOW_MS = '60000';
    const key = freshKey('retry-after');

    setNow(1_000_000);
    await checkExtractRateLimit(key);

    setNow(1_000_000 + 10_000);
    const soon = await checkExtractRateLimit(key);
    expect(soon.limited).toBe(true);
    expect(soon.retryAfterSec).toBe(50);

    setNow(1_000_000 + 59_000);
    const later = await checkExtractRateLimit(key);
    expect(later.limited).toBe(true);
    expect(later.retryAfterSec).toBe(1);
  });

  it('never advertises a retry-after longer than the window', async () => {
    process.env.RATE_LIMIT_LIMIT = '1';
    process.env.RATE_LIMIT_WINDOW_MS = '60000';
    const key = freshKey('bounded');

    setNow(1_000_000);
    await checkExtractRateLimit(key);
    const blocked = await checkExtractRateLimit(key);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
    expect(blocked.retryAfterSec).toBeLessThanOrEqual(60);
  });

  it('lets the caller through again once the window has fully elapsed', async () => {
    process.env.RATE_LIMIT_LIMIT = '2';
    process.env.RATE_LIMIT_WINDOW_MS = '60000';
    const key = freshKey('slide');

    setNow(1_000_000);
    await checkExtractRateLimit(key);
    await checkExtractRateLimit(key);
    expect((await checkExtractRateLimit(key)).limited).toBe(true);

    setNow(1_000_000 + 60_001);
    expect((await checkExtractRateLimit(key)).limited).toBe(false);
  });

  it('keeps one caller from spending another caller budget', async () => {
    process.env.RATE_LIMIT_LIMIT = '1';
    process.env.RATE_LIMIT_WINDOW_MS = '60000';
    const alice = freshKey('alice');
    const bob = freshKey('bob');
    setNow(1_000_000);

    expect((await checkExtractRateLimit(alice)).limited).toBe(false);
    expect((await checkExtractRateLimit(alice)).limited).toBe(true);
    expect((await checkExtractRateLimit(bob)).limited).toBe(false);
  });

  it('does not spend budget on requests it rejects (a blocked caller stays blocked, not worse)', async () => {
    process.env.RATE_LIMIT_LIMIT = '1';
    process.env.RATE_LIMIT_WINDOW_MS = '60000';
    const key = freshKey('no-double-charge');

    setNow(1_000_000);
    await checkExtractRateLimit(key);
    for (let i = 0; i < 5; i += 1) {
      setNow(1_000_000 + 1_000 * i);
      expect((await checkExtractRateLimit(key)).limited).toBe(true);
    }

    // The single accepted request still ages out on its own schedule; the
    // rejected attempts did not extend the penalty.
    setNow(1_000_000 + 60_001);
    expect((await checkExtractRateLimit(key)).limited).toBe(false);
  });
});

describe('checkExtractRateLimit - Durable Object endpoint', () => {
  it('uses the DO verdict and labels the source when the endpoint answers', async () => {
    process.env.RATE_LIMIT_DO_ENDPOINT = 'https://do.example/rl';
    process.env.RATE_LIMIT_LIMIT = '30';
    process.env.RATE_LIMIT_WINDOW_MS = '60000';
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ limited: true, retryAfterSec: 42 }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    setNow(1_000_000);

    const result = await checkExtractRateLimit(freshKey('do-hit'));
    expect(result).toEqual({ limited: true, retryAfterSec: 42, source: 'do', limit: 30, windowMs: 60000 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('forwards the key, window and limit so the DO enforces the same policy', async () => {
    process.env.RATE_LIMIT_DO_ENDPOINT = 'https://do.example/rl';
    process.env.RATE_LIMIT_LIMIT = '5';
    process.env.RATE_LIMIT_WINDOW_MS = '30000';
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ limited: false }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    setNow(1_000_000);

    const key = freshKey('do-payload');
    await checkExtractRateLimit(key);

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://do.example/rl');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({ key, windowMs: 30000, limit: 5 });
  });

  it('treats a missing retryAfterSec as 0 rather than undefined', async () => {
    process.env.RATE_LIMIT_DO_ENDPOINT = 'https://do.example/rl';
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ limited: true }), { status: 200 })));
    setNow(1_000_000);

    const result = await checkExtractRateLimit(freshKey('do-no-retry'));
    expect(result.retryAfterSec).toBe(0);
  });

  it('falls back to the in-memory bucket when the endpoint errors, throws, or lies', async () => {
    process.env.RATE_LIMIT_DO_ENDPOINT = 'https://do.example/rl';
    process.env.RATE_LIMIT_LIMIT = '30';
    setNow(1_000_000);

    const cases: Array<[string, () => Promise<Response>]> = [
      ['non-2xx', async () => new Response('nope', { status: 500 })],
      ['unparseable body', async () => new Response('not json', { status: 200 })],
      ['limited is not a boolean', async () => new Response(JSON.stringify({ limited: 'yes' }), { status: 200 })],
      ['limited is absent', async () => new Response(JSON.stringify({ retryAfterSec: 9 }), { status: 200 })],
      ['fetch rejects', async () => { throw new Error('network down'); }],
    ];

    for (const [label, responder] of cases) {
      vi.stubGlobal('fetch', vi.fn(responder));
      const result = await checkExtractRateLimit(freshKey('do-degraded'));
      expect(result.source, label).toBe('fallback');
      expect(result.limited, label).toBe(false);
    }
  });

  it('still enforces the limit locally while the DO is unreachable (degrades closed, not open)', async () => {
    process.env.RATE_LIMIT_DO_ENDPOINT = 'https://do.example/rl';
    process.env.RATE_LIMIT_LIMIT = '2';
    process.env.RATE_LIMIT_WINDOW_MS = '60000';
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('network down'); }));
    const key = freshKey('do-down');
    setNow(1_000_000);

    expect((await checkExtractRateLimit(key)).limited).toBe(false);
    expect((await checkExtractRateLimit(key)).limited).toBe(false);
    const blocked = await checkExtractRateLimit(key);
    expect(blocked.limited).toBe(true);
    expect(blocked.source).toBe('fallback');
  });

  it('skips the endpoint entirely when it is unset or blank', async () => {
    process.env.RATE_LIMIT_DO_ENDPOINT = '   ';
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ limited: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    setNow(1_000_000);

    const result = await checkExtractRateLimit(freshKey('do-blank'));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.source).toBe('fallback');
  });
});

describe('checkExtractRateLimit - malformed env (HC-10 characterisation)', () => {
  // These tests DOCUMENT today's behaviour; they do not endorse it.
  // `parseInt` has no NaN guard (src/lib/rate-limit/extract.ts:59-60), so a
  // malformed RATE_LIMIT_LIMIT makes `length >= NaN` false forever, i.e. the
  // limiter fails OPEN. All three wrangler configs currently carry valid
  // values, so there is no live exposure. Fixing this changes a security
  // property and is deliberately held for HC-10 with production verification;
  // when that lands, these two expectations are the ones that must flip.
  it('fails OPEN on a non-numeric limit - known gap, tracked as HC-10', async () => {
    process.env.RATE_LIMIT_LIMIT = 'thirty';
    process.env.RATE_LIMIT_WINDOW_MS = '60000';
    const key = freshKey('nan-limit');
    setNow(1_000_000);

    for (let i = 0; i < 50; i += 1) {
      expect((await checkExtractRateLimit(key)).limited).toBe(false);
    }
    expect((await checkExtractRateLimit(key)).limit).toBeNaN();
  });

  it('fails OPEN on a non-numeric window - known gap, tracked as HC-10', async () => {
    process.env.RATE_LIMIT_LIMIT = '1';
    process.env.RATE_LIMIT_WINDOW_MS = '';
    const key = freshKey('nan-window');
    setNow(1_000_000);

    await checkExtractRateLimit(key);
    // now - NaN is NaN, so `t > NaN` is false: every timestamp is trimmed away
    // and the bucket can never reach the limit.
    expect((await checkExtractRateLimit(key)).limited).toBe(false);
  });
});
