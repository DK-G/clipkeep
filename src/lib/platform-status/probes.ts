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
  url: string;
  method: 'GET' | 'HEAD';
  // Statuses that mean "reachable / healthy" (mirrors release gate ExpectedList).
  operational: number[];
}

// Upstreams mirror scripts/prod_release_check.ps1 so status semantics match the
// release gate exactly. 403/429 are accepted for Reddit/Threads because those
// are the normal responses to datacenter IPs and do NOT mean the user-facing
// downloader is broken (see methodology note on the page).
const TARGETS: ProbeTarget[] = [
  {
    platform: 'twitter',
    label: 'Twitter / X',
    upstream: 'fxTwitter API',
    url: 'https://api.fxtwitter.com/i/status/20',
    method: 'GET',
    operational: [200, 400, 404],
  },
  {
    platform: 'telegram',
    label: 'Telegram',
    upstream: 't.me embed',
    url: 'https://t.me/durov/1?embed=1',
    method: 'GET',
    operational: [200, 301, 302, 307, 308, 400, 404],
  },
  {
    platform: 'reddit',
    label: 'Reddit',
    upstream: 'reddit.com JSON',
    url: 'https://www.reddit.com/r/popular/.json?limit=1',
    method: 'GET',
    operational: [200, 301, 302, 307, 308, 400, 401, 403, 404, 429],
  },
  {
    platform: 'threads',
    label: 'Threads',
    upstream: 'threads.com',
    url: 'https://www.threads.com/@zuck/post/CuPoFQ7L0r5',
    method: 'GET',
    operational: [200, 301, 302, 307, 308, 400, 401, 403, 404, 429],
  },
];

const KV_KEY = 'platform-status:v1';
const CACHE_TTL_SECONDS = 600; // 10 min
const PROBE_TIMEOUT_MS = 6000;

function classify(target: ProbeTarget, httpStatus: number): ProbeStatus {
  if (target.operational.includes(httpStatus)) return 'operational';
  if (httpStatus >= 500) return 'down';
  return 'limited';
}

async function probeOne(target: ProbeTarget): Promise<ProbeResult> {
  const started = Date.now();
  try {
    const res = await fetchWithTimeout(target.url, {
      method: target.method,
      redirect: 'manual',
      cache: 'no-store',
      timeoutMs: PROBE_TIMEOUT_MS,
    });
    const latencyMs = Date.now() - started;
    return {
      platform: target.platform,
      label: target.label,
      upstream: target.upstream,
      status: classify(target, res.status),
      httpStatus: res.status,
      latencyMs,
    };
  } catch {
    // Network error or timeout — treat as down.
    return {
      platform: target.platform,
      label: target.label,
      upstream: target.upstream,
      status: 'down',
      httpStatus: null,
      latencyMs: Date.now() - started,
    };
  }
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

/** Platforms ClipKeep supports but that do not yet have a live upstream probe. */
export const ALSO_SUPPORTED = [
  'TikTok', 'Pinterest', 'Facebook', 'Bluesky', 'Lemon8', 'Bilibili', 'Discord',
];
