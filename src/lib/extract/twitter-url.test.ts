import { describe, expect, it } from 'vitest';
import { isTwitterShortHost, normalizeTwitterInputUrl } from './twitter-url';
import { extractStatusId } from './twitter';

// The extract layer is the critical path (and the layer where the current
// production outage lives). These tests cover only the network-free pure
// functions: URL normalization and status-id parsing.

describe('isTwitterShortHost', () => {
  it('recognizes t.co regardless of case', () => {
    expect(isTwitterShortHost('t.co')).toBe(true);
    expect(isTwitterShortHost('T.CO')).toBe(true);
  });

  it('does not treat canonical hosts as short hosts', () => {
    expect(isTwitterShortHost('x.com')).toBe(false);
    expect(isTwitterShortHost('twitter.com')).toBe(false);
  });
});

describe('normalizeTwitterInputUrl', () => {
  it('collapses every canonical host and path shape to one canonical status URL', () => {
    const cases = [
      'https://x.com/jack/status/20',
      'https://www.x.com/jack/status/20',
      'https://twitter.com/jack/status/20',
      'https://www.twitter.com/jack/status/20',
      'https://m.twitter.com/jack/status/20',
      'https://mobile.twitter.com/jack/status/20',
      'https://x.com/i/web/status/20',
      'https://x.com/i/status/20',
    ];
    for (const input of cases) {
      expect(normalizeTwitterInputUrl(input)).toBe('https://x.com/i/status/20');
    }
  });

  it('upgrades http to https, trims whitespace, and drops tracking params and fragments', () => {
    expect(normalizeTwitterInputUrl('  http://twitter.com/jack/status/20?s=20&t=abc#foo  ')).toBe(
      'https://x.com/i/status/20',
    );
  });

  it('reads the status id out of intent-style query params', () => {
    expect(normalizeTwitterInputUrl('https://twitter.com/intent/tweet?tweet_id=20')).toBe(
      'https://x.com/i/status/20',
    );
    expect(normalizeTwitterInputUrl('https://twitter.com/intent/tweet?in_reply_to=20')).toBe(
      'https://x.com/i/status/20',
    );
  });

  it('ignores a non-numeric tweet_id rather than building a bogus status URL', () => {
    expect(() => normalizeTwitterInputUrl('https://twitter.com/intent/tweet?tweet_id=abc')).toThrow(
      'INVALID_X_STATUS_URL',
    );
  });

  it('passes t.co short links through untouched (they still need a network resolve)', () => {
    expect(normalizeTwitterInputUrl('https://t.co/AbC123?src=x')).toBe('https://t.co/AbC123');
  });

  it('classifies failures so the API can return a specific error', () => {
    // Profile / home URLs are a distinct user mistake from a malformed status URL.
    expect(() => normalizeTwitterInputUrl('https://x.com/jack')).toThrow('X_PROFILE_URL_NOT_SUPPORTED');
    expect(() => normalizeTwitterInputUrl('https://x.com/')).toThrow('X_PROFILE_URL_NOT_SUPPORTED');
    expect(() => normalizeTwitterInputUrl('https://x.com/jack/photo/1')).toThrow('INVALID_X_STATUS_URL');
    expect(() => normalizeTwitterInputUrl('https://example.com/jack/status/20')).toThrow('UNSUPPORTED_HOST');
    // A lookalike host must not be accepted as canonical.
    expect(() => normalizeTwitterInputUrl('https://x.com.evil.test/jack/status/20')).toThrow('UNSUPPORTED_HOST');
  });

  it('throws on input that is not a URL at all', () => {
    expect(() => normalizeTwitterInputUrl('not a url')).toThrow();
  });
});

describe('extractStatusId', () => {
  it('extracts the id from canonical and user-facing status URLs', () => {
    expect(extractStatusId('https://x.com/i/status/20')).toBe('20');
    expect(extractStatusId('https://x.com/jack/status/1234567890123456789')).toBe('1234567890123456789');
    expect(extractStatusId('https://twitter.com/i/web/status/20?s=20')).toBe('20');
  });

  it('accepts a bare numeric path as an id', () => {
    expect(extractStatusId('https://x.com/20')).toBe('20');
  });

  it('returns null instead of throwing for unusable input', () => {
    expect(extractStatusId('https://x.com/jack')).toBeNull();
    expect(extractStatusId('https://x.com/')).toBeNull();
    expect(extractStatusId('not a url')).toBeNull();
  });
});
