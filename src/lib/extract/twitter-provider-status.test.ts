import { describe, expect, it } from 'vitest';
import { classifyProviderStatus } from './twitter';

// Regression cover for the 2026-07 twitter outage: fxTwitter answers our
// Workers egress with 401, and the previous inline status chain named only
// 403/429/404/ok -- so 401 produced neither a failure class nor a log line.
// The contract fixed here is "every status is classified, nothing is silent".

describe('classifyProviderStatus', () => {
  it('classifies 401 explicitly instead of letting it fall through', () => {
    expect(classifyProviderStatus(401)).toEqual({
      class: 'unauthorized',
      failure: 'PROVIDER_UNAUTHORIZED',
      cooldown: true,
    });
  });

  it('treats 403 and 429 as bot challenges that cool the provider down', () => {
    for (const status of [403, 429]) {
      expect(classifyProviderStatus(status)).toEqual({
        class: 'bot_challenged',
        failure: 'BOT_CHALLENGED',
        cooldown: true,
      });
    }
  });

  it('maps 404 to a terminal not-found without a cooldown', () => {
    expect(classifyProviderStatus(404)).toEqual({
      class: 'not_found',
      failure: 'POST_NOT_FOUND',
      cooldown: false,
    });
  });

  it('accepts the whole 2xx range as usable', () => {
    for (const status of [200, 204, 299]) {
      expect(classifyProviderStatus(status)).toEqual({
        class: 'ok',
        failure: null,
        cooldown: false,
      });
    }
  });

  it('labels every other non-ok status with its code rather than dropping it', () => {
    expect(classifyProviderStatus(500)).toEqual({
      class: 'http_error',
      failure: 'PROVIDER_HTTP_500',
      cooldown: false,
    });
    expect(classifyProviderStatus(402).failure).toBe('PROVIDER_HTTP_402');
    expect(classifyProviderStatus(412).failure).toBe('PROVIDER_HTTP_412');
    expect(classifyProviderStatus(302).failure).toBe('PROVIDER_HTTP_302');
  });

  it('never returns a null failure label for a status it cannot use', () => {
    const statuses = [301, 302, 400, 401, 403, 404, 408, 412, 429, 451, 500, 502, 503, 504];
    for (const status of statuses) {
      const verdict = classifyProviderStatus(status);
      expect(verdict.class).not.toBe('ok');
      expect(verdict.failure).toBeTruthy();
    }
  });
});
