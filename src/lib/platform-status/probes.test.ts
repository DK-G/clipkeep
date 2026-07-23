import { describe, expect, it } from 'vitest';
import {
  ALSO_SUPPORTED,
  PROBED_PLATFORMS,
  computeUptime,
  overallStatus,
  type HistorySample,
} from './probes';

describe('probe coverage', () => {
  it('probes every platform that has a stable public upstream', () => {
    expect(PROBED_PLATFORMS).toEqual([
      'twitter',
      'telegram',
      'reddit',
      'threads',
      'bluesky',
      'tiktok',
      'pinterest',
      'facebook',
      'bilibili',
    ]);
  });

  it('never lists a probed platform as "also supported" (the page would contradict itself)', () => {
    const alsoLower = ALSO_SUPPORTED.map((p) => p.toLowerCase());
    for (const platform of PROBED_PLATFORMS) {
      expect(alsoLower).not.toContain(platform);
    }
  });
});

describe('computeUptime', () => {
  it('reports a stat for every probed platform, null until samples exist', () => {
    const uptime = computeUptime([]);
    expect(Object.keys(uptime).sort()).toEqual([...PROBED_PLATFORMS].sort());
    for (const platform of PROBED_PLATFORMS) {
      expect(uptime[platform]).toEqual({ total: 0, operational: 0, pct: null });
    }
  });

  it('counts only operational samples for the newly probed platforms', () => {
    const history: HistorySample[] = [
      { at: '2026-07-20T00:00:00.000Z', perPlatform: { pinterest: 'operational', facebook: 'limited', bilibili: 'operational' } },
      { at: '2026-07-20T06:00:00.000Z', perPlatform: { pinterest: 'limited', facebook: 'limited', bilibili: 'operational' } },
    ];
    const uptime = computeUptime(history);

    expect(uptime.pinterest).toEqual({ total: 2, operational: 1, pct: 50 });
    expect(uptime.facebook).toEqual({ total: 2, operational: 0, pct: 0 });
    expect(uptime.bilibili).toEqual({ total: 2, operational: 2, pct: 100 });
    // A platform absent from the samples stays "no data" rather than 0%.
    expect(uptime.twitter).toEqual({ total: 0, operational: 0, pct: null });
  });
});

describe('overallStatus', () => {
  it('degrades to limited when a newly probed upstream is blocked', () => {
    const results = [
      { platform: 'twitter', label: 'Twitter / X', upstream: 'fxTwitter API', status: 'operational' as const, httpStatus: 200, latencyMs: 100 },
      { platform: 'facebook', label: 'Facebook', upstream: 'facebook.com watch page', status: 'limited' as const, httpStatus: 302, latencyMs: 200 },
    ];
    expect(overallStatus(results)).toBe('limited');
  });
});
