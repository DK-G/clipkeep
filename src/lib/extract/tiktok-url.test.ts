import { describe, expect, it } from 'vitest';
import { isTikTokShortHost, normalizeTikTokInputUrl } from './tiktok-url';

describe('isTikTokShortHost', () => {
  it('recognizes both share-link hosts regardless of case', () => {
    expect(isTikTokShortHost('vt.tiktok.com')).toBe(true);
    expect(isTikTokShortHost('VM.TikTok.com')).toBe(true);
  });

  it('does not treat canonical hosts as short hosts', () => {
    expect(isTikTokShortHost('www.tiktok.com')).toBe(false);
  });
});

describe('normalizeTikTokInputUrl', () => {
  it('keeps the canonical video path and strips tracking params and fragments', () => {
    expect(
      normalizeTikTokInputUrl('https://www.tiktok.com/@user/video/7123456789?is_from_webapp=1#play'),
    ).toBe('https://www.tiktok.com/@user/video/7123456789');
  });

  it('accepts every canonical host and upgrades http to https', () => {
    expect(normalizeTikTokInputUrl('http://tiktok.com/@user/video/7123456789')).toBe(
      'https://tiktok.com/@user/video/7123456789',
    );
    expect(normalizeTikTokInputUrl('  https://m.tiktok.com/@user/video/7123456789  ')).toBe(
      'https://m.tiktok.com/@user/video/7123456789',
    );
  });

  it('passes short share links through untouched (they still need a network resolve)', () => {
    expect(normalizeTikTokInputUrl('https://vt.tiktok.com/ZSabc123/?k=1')).toBe(
      'https://vt.tiktok.com/ZSabc123/',
    );
    expect(normalizeTikTokInputUrl('https://vm.tiktok.com/ZSabc123/')).toBe(
      'https://vm.tiktok.com/ZSabc123/',
    );
  });

  it('rejects anything that is not a single video URL', () => {
    // Profile, photo carousel, live, and lookalike hosts all share one error code.
    expect(() => normalizeTikTokInputUrl('https://www.tiktok.com/@user')).toThrow('INVALID_TIKTOK_URL');
    expect(() => normalizeTikTokInputUrl('https://www.tiktok.com/@user/photo/7123456789')).toThrow(
      'INVALID_TIKTOK_URL',
    );
    expect(() => normalizeTikTokInputUrl('https://www.tiktok.com/@user/live')).toThrow('INVALID_TIKTOK_URL');
    expect(() => normalizeTikTokInputUrl('https://www.tiktok.com/@user/video/abc')).toThrow(
      'INVALID_TIKTOK_URL',
    );
    expect(() => normalizeTikTokInputUrl('https://tiktok.com.evil.test/@user/video/7123456789')).toThrow(
      'INVALID_TIKTOK_URL',
    );
  });

  it('throws on input that is not a URL at all', () => {
    expect(() => normalizeTikTokInputUrl('not a url')).toThrow();
  });
});
