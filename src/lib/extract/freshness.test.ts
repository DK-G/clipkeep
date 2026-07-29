import { describe, expect, it } from 'vitest';
import {
  shouldRefreshTelegramJob,
  shouldRefreshThreadsJob,
  shouldRefreshTikTokJob,
  shouldRefreshTwitterJob,
} from './freshness';
import type { ExtractJob, Platform } from './types';

// Media URLs from these platforms are signed and expire. A job is refreshed
// when we cannot prove its media is still valid — "unknown" must behave like
// "expired", otherwise the user gets a dead download link.

function makeJob(overrides: Partial<ExtractJob> = {}): ExtractJob {
  const now = new Date().toISOString();
  return {
    id: 'job-1',
    platform: 'twitter',
    sourceUrl: 'https://x.com/i/status/20',
    status: 'completed',
    progress: 100,
    media: [
      {
        mediaId: 'media-1',
        type: 'video',
        url: 'https://video.twimg.com/a.mp4',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      },
    ],
    warnings: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function withExpiry(expiresAt: string | undefined, platform: Platform = 'twitter'): ExtractJob {
  const job = makeJob({ platform });
  return {
    ...job,
    media: [{ ...job.media[0], expiresAt: expiresAt as string }],
  };
}

describe('shouldRefreshTwitterJob', () => {
  it('leaves a job alone while its media is comfortably in the future', () => {
    expect(shouldRefreshTwitterJob(makeJob())).toBe(false);
  });

  it('refreshes media that is already expired', () => {
    expect(shouldRefreshTwitterJob(withExpiry(new Date(Date.now() - 1000).toISOString()))).toBe(true);
  });

  it('refreshes media expiring inside the 2-minute stale-soon window', () => {
    expect(shouldRefreshTwitterJob(withExpiry(new Date(Date.now() + 60 * 1000).toISOString()))).toBe(true);
    // Just outside the window: still good.
    expect(shouldRefreshTwitterJob(withExpiry(new Date(Date.now() + 5 * 60 * 1000).toISOString()))).toBe(
      false,
    );
  });

  it('treats a missing or unparseable expiry as expired', () => {
    expect(shouldRefreshTwitterJob(withExpiry(undefined))).toBe(true);
    expect(shouldRefreshTwitterJob(withExpiry('not-a-date'))).toBe(true);
  });

  it('refreshes when any single media item is stale, not only when all are', () => {
    const job = makeJob();
    const stale = { ...job.media[0], mediaId: 'media-2', expiresAt: new Date(Date.now() - 1000).toISOString() };
    expect(shouldRefreshTwitterJob({ ...job, media: [job.media[0], stale] })).toBe(true);
  });

  it('never refreshes a job that has no usable result yet', () => {
    expect(shouldRefreshTwitterJob(makeJob({ status: 'processing' }))).toBe(false);
    expect(shouldRefreshTwitterJob(makeJob({ status: 'failed' }))).toBe(false);
    expect(shouldRefreshTwitterJob(makeJob({ media: [] }))).toBe(false);
  });

  it('ignores jobs from another platform', () => {
    expect(shouldRefreshTwitterJob(withExpiry(undefined, 'tiktok'))).toBe(false);
  });
});

describe('per-platform refresh guards', () => {
  const guards: Array<[Platform, (job: ExtractJob) => boolean]> = [
    ['tiktok', shouldRefreshTikTokJob],
    ['telegram', shouldRefreshTelegramJob],
    ['threads', shouldRefreshThreadsJob],
  ];

  for (const [platform, guard] of guards) {
    it(`${platform}: refreshes expired media on its own platform only`, () => {
      expect(guard(withExpiry(new Date(Date.now() - 1000).toISOString(), platform))).toBe(true);
      expect(guard(withExpiry(new Date(Date.now() + 60 * 60 * 1000).toISOString(), platform))).toBe(false);
      expect(guard(withExpiry(new Date(Date.now() - 1000).toISOString(), 'reddit'))).toBe(false);
    });
  }
});
