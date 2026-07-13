// Track A (linkable asset) — machine-readable export of the platform-status data.
//
// This is the single source of truth for BOTH the public JSON distribution
// (/api/v1/platform-status) and the schema.org/Dataset JSON-LD on the HTML page.
// Keeping one builder means the human page, the JSON file external tools fetch,
// and the Dataset metadata Google Dataset Search harvests can never drift apart.
import { SITE_URL } from '@/lib/site-url';
import {
  ALSO_SUPPORTED,
  computeUptime,
  overallStatus,
  type HistorySample,
  type ProbeStatus,
  type StatusSnapshot,
} from './probes';

export const STATUS_PAGE_URL = `${SITE_URL}/platform-status`;
export const STATUS_DATA_URL = `${SITE_URL}/api/v1/platform-status`;
export const STATUS_LICENSE = 'https://creativecommons.org/licenses/by/4.0/';
export const PROBE_CADENCE_HOURS = 6;

export const STATUS_DATASET_NAME = 'ClipKeep Video Platform Download Status';
export const STATUS_DATASET_DESCRIPTION =
  'Server-side availability probes for the video platforms ClipKeep downloads from ' +
  '(Twitter/X, Telegram, Reddit, Threads, Bluesky, TikTok). Each platform is probed against ' +
  'the same public upstream endpoint its extractor depends on and classified with the same ' +
  'accepted-status sets as ClipKeep’s release gate. Refreshed every ~10 minutes; rolling ' +
  'uptime is sampled every ~6 hours. Free, open data (CC BY 4.0) — cite or embed it.';
export const STATUS_METHODOLOGY =
  'One request per platform to its public upstream endpoint from ClipKeep servers; HTTP status ' +
  'and latency recorded. "operational" = upstream reachable and responding as expected (using ' +
  'the release gate’s accepted-status sets; 403/429 to datacenter IPs are expected for ' +
  'Reddit/Threads and count as reachable). TikTok is probed against the third-party fixers it ' +
  'uses and is operational if any is reachable. Reflects upstream reachability, not a guarantee ' +
  'for any specific video.';

export interface PlatformExport {
  platform: string;
  label: string;
  upstream: string;
  status: ProbeStatus;
  httpStatus: number | null;
  latencyMs: number | null;
  uptimePct: number | null;
  uptimeSamples: number;
}

export interface StatusExport {
  dataset: string;
  description: string;
  source: string;
  license: string;
  methodology: string;
  checkedAt: string;
  overall: ProbeStatus;
  uptimeWindow: { samples: number; cadenceHours: number };
  platforms: PlatformExport[];
  alsoSupported: string[];
}

/** Machine-readable snapshot served at /api/v1/platform-status and mirrored in the Dataset JSON-LD. */
export function buildStatusExport(snapshot: StatusSnapshot, history: HistorySample[]): StatusExport {
  const uptime = computeUptime(history);
  const platforms: PlatformExport[] = snapshot.results.map((r) => ({
    platform: r.platform,
    label: r.label,
    upstream: r.upstream,
    status: r.status,
    httpStatus: r.httpStatus,
    latencyMs: r.latencyMs,
    uptimePct: uptime[r.platform]?.pct ?? null,
    uptimeSamples: uptime[r.platform]?.total ?? 0,
  }));

  return {
    dataset: STATUS_DATASET_NAME,
    description: STATUS_DATASET_DESCRIPTION,
    source: STATUS_PAGE_URL,
    license: STATUS_LICENSE,
    methodology: STATUS_METHODOLOGY,
    checkedAt: snapshot.checkedAt,
    overall: overallStatus(snapshot.results),
    uptimeWindow: { samples: history.length, cadenceHours: PROBE_CADENCE_HOURS },
    platforms,
    alsoSupported: [...ALSO_SUPPORTED],
  };
}

/**
 * schema.org temporalCoverage for the uptime series: "<firstSample>/<checkedAt>".
 * Returns undefined when there is no history yet (avoids emitting a bogus range).
 */
export function statusTemporalCoverage(
  history: HistorySample[],
  checkedAt: string,
): string | undefined {
  if (history.length === 0) return undefined;
  const first = history[0]?.at;
  if (!first) return undefined;
  const start = new Date(first);
  const end = new Date(checkedAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return undefined;
  return `${start.toISOString()}/${end.toISOString()}`;
}

/**
 * schema.org/Dataset JSON-LD for the platform-status page. Built from the same
 * export so metadata Google harvests matches the JSON distribution byte-for-byte.
 */
export function buildDatasetJsonLd(data: StatusExport, temporalCoverage?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: data.dataset,
    description: data.description,
    url: STATUS_PAGE_URL,
    keywords: [
      'video downloader status',
      'platform availability',
      'uptime',
      'Twitter downloader',
      'Telegram downloader',
      'Reddit downloader',
      'TikTok downloader',
    ],
    creator: { '@type': 'Organization', name: 'ClipKeep', url: SITE_URL },
    license: data.license,
    isAccessibleForFree: true,
    measurementTechnique: 'Server-side HTTP availability probing of each platform’s public upstream endpoint',
    dateModified: data.checkedAt,
    ...(temporalCoverage ? { temporalCoverage } : {}),
    variableMeasured: data.platforms.map((p) => ({
      '@type': 'PropertyValue',
      name: `${p.label} availability`,
      value: p.status,
      ...(p.uptimePct != null ? { unitText: 'percent uptime', maxValue: p.uptimePct } : {}),
    })),
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: STATUS_DATA_URL,
      },
    ],
  };
}
