import { describe, expect, it } from 'vitest';
import type { HistorySample, StatusSnapshot } from './probes';
import {
  buildStatusExport,
  buildDatasetJsonLd,
  statusTemporalCoverage,
  STATUS_DATA_URL,
} from './export';

const snapshot: StatusSnapshot = {
  checkedAt: '2026-07-14T00:00:00.000Z',
  results: [
    { platform: 'twitter', label: 'Twitter / X', upstream: 'fxTwitter API', status: 'operational', httpStatus: 200, latencyMs: 120 },
    { platform: 'reddit', label: 'Reddit', upstream: 'reddit.com JSON', status: 'limited', httpStatus: 429, latencyMs: 340 },
  ],
};

const history: HistorySample[] = [
  { at: '2026-07-10T00:00:00.000Z', perPlatform: { twitter: 'operational', reddit: 'operational' } },
  { at: '2026-07-11T00:00:00.000Z', perPlatform: { twitter: 'operational', reddit: 'limited' } },
];

describe('buildStatusExport', () => {
  it('projects probe results with per-platform uptime derived from history', () => {
    const out = buildStatusExport(snapshot, history);
    expect(out.checkedAt).toBe(snapshot.checkedAt);
    expect(out.overall).toBe('limited'); // one limited platform
    expect(out.uptimeWindow).toEqual({ samples: 2, cadenceHours: 6 });

    const twitter = out.platforms.find((p) => p.platform === 'twitter')!;
    expect(twitter.uptimePct).toBe(100); // 2/2 operational
    expect(twitter.uptimeSamples).toBe(2);

    const reddit = out.platforms.find((p) => p.platform === 'reddit')!;
    expect(reddit.uptimePct).toBe(50); // 1/2 operational
    expect(reddit.status).toBe('limited');
    expect(reddit.httpStatus).toBe(429);
  });

  it('yields null uptime and zero samples when there is no history', () => {
    const out = buildStatusExport(snapshot, []);
    expect(out.uptimeWindow.samples).toBe(0);
    for (const p of out.platforms) {
      expect(p.uptimePct).toBeNull();
      expect(p.uptimeSamples).toBe(0);
    }
  });
});

describe('statusTemporalCoverage', () => {
  it('spans first history sample to checkedAt', () => {
    expect(statusTemporalCoverage(history, snapshot.checkedAt)).toBe(
      '2026-07-10T00:00:00.000Z/2026-07-14T00:00:00.000Z',
    );
  });

  it('is undefined with no history (no bogus range)', () => {
    expect(statusTemporalCoverage([], snapshot.checkedAt)).toBeUndefined();
  });
});

describe('buildDatasetJsonLd', () => {
  it('emits a harvestable Dataset with JSON distribution and PropertyValue variables', () => {
    const data = buildStatusExport(snapshot, history);
    const ld = buildDatasetJsonLd(data, statusTemporalCoverage(history, snapshot.checkedAt));

    expect(ld['@type']).toBe('Dataset');
    expect(ld.distribution[0].contentUrl).toBe(STATUS_DATA_URL);
    expect(ld.distribution[0].encodingFormat).toBe('application/json');
    expect(ld.temporalCoverage).toBe('2026-07-10T00:00:00.000Z/2026-07-14T00:00:00.000Z');
    expect(ld.variableMeasured).toHaveLength(2);
    expect(ld.variableMeasured[0]['@type']).toBe('PropertyValue');
    expect(ld.dateModified).toBe(snapshot.checkedAt);
    expect(ld.isAccessibleForFree).toBe(true);
  });

  it('omits temporalCoverage when not provided', () => {
    const data = buildStatusExport(snapshot, []);
    const ld = buildDatasetJsonLd(data, undefined);
    expect('temporalCoverage' in ld).toBe(false);
  });
});
