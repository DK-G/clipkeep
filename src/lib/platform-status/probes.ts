// Track A (linkable asset) — per-platform live availability probes.
//
// We probe the public upstream each ClipKeep extractor depends on and classify
// the result using the SAME accepted-status sets the release gate uses
// (scripts/prod_release_check.ps1). "operational" therefore means exactly what
// ClipKeep's own health gate means: the upstream is reachable and responding as
// expected. Results are cached in KV (~10 min) so page views never hammer the
// third-party endpoints regardless of traffic.
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { fetchWithTimeout } from '@/lib/extract/m3u8';

export type ProbeStatus = 'operational' | 'limited' | 'down';

export interface ProbeResult {
  platform: string;
  label: string;
  upstream: string;
  status: ProbeStatus;
  httpStatus: number | null;
  latencyMs: number | null;
}

export interface StatusSnapshot {
  checkedAt: string; // ISO
  results: ProbeResult[];
}

interface ProbeTarget {
  platform: string;
  label: string;
  upstream: string;
  candidates: ProbeCandidate[];
}

interface ProbeCandidate {
  url: string;
  method: 'GET' | 'HEAD';
  // Statuses that mean "reachable / healthy" (mirrors release gate ExpectedList).
  operational: number[];
  // Sent verbatim so the probe sees what the extractor sees: Pinterest needs its
  // PWS handler header, Bilibili's API 412s without a browser UA + Referer.
  headers?: Record<string, string>;
}

// Same browser UA the extractors send; several upstreams answer differently
// (or not at all) to a default fetch agent.
const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Pinterest's PinResource API answers `id=1` with a well-formed "Pin not found"
// (HTTP 404) — a healthy endpoint without depending on any real pin surviving.
const PINTEREST_RESOURCE_URL =
  'https://www.pinterest.com/resource/PinResource/get/?data=' +
  encodeURIComponent(JSON.stringify({ options: { field_set_key: 'unauth_react_main_pin', id: '1' } }));

// Upstreams mirror scripts/prod_release_check.ps1 so status semantics match the
// release gate exactly. 403/429 are accepted for Reddit/Threads because those are
// the normal responses to datacenter IPs and do NOT mean the user-facing
// downloader is broken (see methodology note on the page). TikTok has no single
// official endpoint (it relies on third-party fixers with fallback), so it is
// probed against multiple fixers and reported operational if ANY is reachable.
//
// Pinterest/Facebook/Bilibili deliberately do NOT accept 401/403/429: for those
// extractors an anti-bot block, a login wall or 412 風控 is exactly the failure
// that breaks a real download, so it must surface as "limited", not operational.
const TARGETS: ProbeTarget[] = [
  {
    platform: 'twitter',
    label: 'Twitter / X',
    upstream: 'fxTwitter API',
    candidates: [{ url: 'https://api.fxtwitter.com/i/status/20', method: 'GET', operational: [200, 400, 404] }],
  },
  {
    platform: 'telegram',
    label: 'Telegram',
    upstream: 't.me embed',
    candidates: [{ url: 'https://t.me/durov/1?embed=1', method: 'GET', operational: [200, 301, 302, 307, 308, 400, 404] }],
  },
  {
    platform: 'reddit',
    label: 'Reddit',
    upstream: 'reddit.com JSON',
    candidates: [{ url: 'https://www.reddit.com/r/popular/.json?limit=1', method: 'GET', operational: [200, 301, 302, 307, 308, 400, 401, 403, 404, 429] }],
  },
  {
    platform: 'threads',
    label: 'Threads',
    upstream: 'threads.com',
    candidates: [{ url: 'https://www.threads.com/@zuck/post/CuPoFQ7L0r5', method: 'GET', operational: [200, 301, 302, 307, 308, 400, 401, 403, 404, 429] }],
  },
  {
    platform: 'bluesky',
    label: 'Bluesky',
    upstream: 'bsky public API',
    candidates: [{ url: 'https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=bsky.app', method: 'GET', operational: [200, 400, 404] }],
  },
  {
    platform: 'tiktok',
    label: 'TikTok',
    upstream: 'TikWM / Lovetik fixers',
    candidates: [
      { url: 'https://www.tikwm.com/', method: 'GET', operational: [200, 301, 302, 307, 308, 400, 403, 404] },
      { url: 'https://lovetik.com/', method: 'GET', operational: [200, 301, 302, 307, 308, 400, 403, 404] },
    ],
  },
  {
    platform: 'pinterest',
    label: 'Pinterest',
    upstream: 'pinterest.com PinResource API',
    candidates: [
      {
        url: PINTEREST_RESOURCE_URL,
        method: 'GET',
        operational: [200, 400, 404],
        headers: {
          'X-Pinterest-PWS-Handler': 'www/signup.js',
          Accept: 'application/json',
          'User-Agent': BROWSER_UA,
        },
      },
    ],
  },
  {
    platform: 'facebook',
    label: 'Facebook',
    upstream: 'facebook.com watch page',
    candidates: [
      {
        url: 'https://www.facebook.com/watch/',
        method: 'GET',
        operational: [200],
        headers: { 'User-Agent': BROWSER_UA },
      },
    ],
  },
  {
    platform: 'bilibili',
    label: 'Bilibili',
    upstream: 'api.bilibili.com view API',
    candidates: [
      {
        url: 'https://api.bilibili.com/x/web-interface/view?bvid=BV1xx411c7mD',
        method: 'GET',
        operational: [200],
        headers: { 'User-Agent': BROWSER_UA, Referer: 'https://www.bilibili.com/' },
      },
    ],
  },
];

const KV_KEY = 'platform-status:v1';
const CACHE_TTL_SECONDS = 600; // 10 min
const PROBE_TIMEOUT_MS = 6000;

const STATUS_RANK: Record<ProbeStatus, number> = { operational: 3, limited: 2, down: 1 };

function classify(candidate: ProbeCandidate, httpStatus: number): ProbeStatus {
  if (candidate.operational.includes(httpStatus)) return 'operational';
  if (httpStatus >= 500) return 'down';
  return 'limited';
}

interface CandidateOutcome {
  status: ProbeStatus;
  httpStatus: number | null;
  latencyMs: number;
}

async function probeCandidate(candidate: ProbeCandidate): Promise<CandidateOutcome> {
  const started = Date.now();
  try {
    const res = await fetchWithTimeout(candidate.url, {
      method: candidate.method,
      redirect: 'manual',
      cache: 'no-store',
      timeoutMs: PROBE_TIMEOUT_MS,
      ...(candidate.headers ? { headers: candidate.headers } : {}),
    });
    return { status: classify(candidate, res.status), httpStatus: res.status, latencyMs: Date.now() - started };
  } catch {
    // Network error or timeout — treat as down.
    return { status: 'down', httpStatus: null, latencyMs: Date.now() - started };
  }
}

// Probe every candidate upstream and report the best outcome (operational beats
// limited beats down): a platform with fixer fallback is "operational" when at
// least one fixer is reachable.
async function probeOne(target: ProbeTarget): Promise<ProbeResult> {
  const outcomes = await Promise.all(target.candidates.map(probeCandidate));
  let best = outcomes[0];
  for (const o of outcomes) {
    if (STATUS_RANK[o.status] > STATUS_RANK[best.status]) best = o;
  }
  return {
    platform: target.platform,
    label: target.label,
    upstream: target.upstream,
    status: best.status,
    httpStatus: best.httpStatus,
    latencyMs: best.latencyMs,
  };
}

async function runProbes(): Promise<StatusSnapshot> {
  const results = await Promise.all(TARGETS.map((t) => probeOne(t)));
  return { checkedAt: new Date().toISOString(), results };
}

async function getKv(): Promise<KVNamespace | null> {
  try {
    const env = (await getCloudflareContext()).env as { TREND_KV?: KVNamespace };
    return env.TREND_KV ?? null;
  } catch {
    return null;
  }
}

function isFresh(snapshot: StatusSnapshot): boolean {
  const age = Date.now() - new Date(snapshot.checkedAt).getTime();
  return Number.isFinite(age) && age >= 0 && age < CACHE_TTL_SECONDS * 1000;
}

/**
 * Live per-platform availability. Serves a KV-cached snapshot when fresh
 * (<10 min); otherwise re-probes the upstreams and writes the snapshot back.
 * KV-less environments (local/build) probe directly. Never throws.
 */
export async function getPlatformStatuses(): Promise<StatusSnapshot> {
  const kv = await getKv();
  if (kv) {
    try {
      const cached = await kv.get(KV_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as StatusSnapshot;
        if (parsed?.results?.length && isFresh(parsed)) return parsed;
      }
    } catch {
      // fall through to a fresh probe
    }
  }

  const snapshot = await runProbes();

  if (kv) {
    try {
      await kv.put(KV_KEY, JSON.stringify(snapshot), { expirationTtl: CACHE_TTL_SECONDS });
    } catch {
      // caching is best-effort
    }
  }

  return snapshot;
}

/** Overall roll-up: down if any upstream is down, limited if any limited, else operational. */
export function overallStatus(results: ProbeResult[]): ProbeStatus {
  if (results.some((r) => r.status === 'down')) return 'down';
  if (results.some((r) => r.status === 'limited')) return 'limited';
  return 'operational';
}

// ── A-v1: rolling uptime history ────────────────────────────────────────────
// The 6h cron calls probeAndRecord() (via /api/admin/status-probe), appending a
// compact sample so the page can show real uptime over the last N checks.
const HISTORY_KEY = 'platform-status:history';
const HISTORY_MAX = 56; // ~14 days at 4 samples/day

export interface HistorySample {
  at: string;
  perPlatform: Record<string, ProbeStatus>;
}

export interface UptimeStat {
  total: number;
  operational: number;
  pct: number | null; // null when no samples yet
}

/** Rolling history samples (oldest→newest). Empty-safe. */
export async function getStatusHistory(): Promise<HistorySample[]> {
  const kv = await getKv();
  if (!kv) return [];
  try {
    const raw = await kv.get(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistorySample[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Per-platform uptime% (operational / samples) over the given history. */
export function computeUptime(history: HistorySample[]): Record<string, UptimeStat> {
  const out: Record<string, UptimeStat> = {};
  for (const t of TARGETS) {
    let total = 0;
    let operational = 0;
    for (const s of history) {
      const st = s.perPlatform?.[t.platform];
      if (!st) continue;
      total += 1;
      if (st === 'operational') operational += 1;
    }
    out[t.platform] = { total, operational, pct: total ? Math.round((operational / total) * 100) : null };
  }
  return out;
}

/**
 * Cron entry: probe fresh (bypassing the read cache), refresh the cache, and
 * append one sample to the rolling history. Never throws.
 */
export async function probeAndRecord(): Promise<StatusSnapshot> {
  const snapshot = await runProbes();
  const kv = await getKv();
  if (!kv) return snapshot;

  try {
    await kv.put(KV_KEY, JSON.stringify(snapshot), { expirationTtl: CACHE_TTL_SECONDS });
  } catch {
    // best-effort cache
  }
  try {
    const raw = await kv.get(HISTORY_KEY);
    const prev: HistorySample[] = raw ? (JSON.parse(raw) as HistorySample[]) : [];
    const sample: HistorySample = {
      at: snapshot.checkedAt,
      perPlatform: Object.fromEntries(snapshot.results.map((r) => [r.platform, r.status])),
    };
    const next = [...(Array.isArray(prev) ? prev : []), sample].slice(-HISTORY_MAX);
    await kv.put(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // best-effort history
  }
  return snapshot;
}

/**
 * Platforms ClipKeep supports but that do not yet have a live upstream probe.
 * Discord and Lemon8 resolve per-post CDN/app URLs with no single stable public
 * endpoint that a synthetic probe could represent honestly.
 */
export const ALSO_SUPPORTED = ['Discord', 'Lemon8'];

/** Platforms with a live probe (stable order — used by tests and docs). */
export const PROBED_PLATFORMS = TARGETS.map((t) => t.platform);
