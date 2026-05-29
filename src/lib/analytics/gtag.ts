declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __clipkeepAnalyticsQueue?: AnalyticsCommand[];
  }
}

type AnalyticsCommand =
  | ['event', string, Record<string, unknown>]
  | ['config', string, Record<string, unknown>];

const IS_DEV = process.env.NODE_ENV === 'development';
const MAX_FLUSH_ATTEMPTS = 20;
const DEFAULT_EVENT_TIMEOUT_MS = 350;
let flushAttempts = 0;
let flushTimer: number | null = null;

function getQueue(): AnalyticsCommand[] {
  window.__clipkeepAnalyticsQueue ??= [];
  return window.__clipkeepAnalyticsQueue;
}

function queueCommand(command: AnalyticsCommand): void {
  getQueue().push(command);
  flushQueuedEvents();
}

function flushQueuedEvents(): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') {
    if (flushAttempts >= MAX_FLUSH_ATTEMPTS || flushTimer) return;

    flushAttempts += 1;
    flushTimer = window.setTimeout(() => {
      flushTimer = null;
      flushQueuedEvents();
    }, 250);
    return;
  }

  flushAttempts = 0;
  const queue = getQueue();
  while (queue.length > 0) {
    const command = queue.shift();
    if (!command) continue;
    window.gtag(...command);
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  sendEvent(name, params);
}

function sendEvent(
  name: string,
  params: Record<string, unknown> = {},
  callback?: () => void,
): void {
  if (IS_DEV) {
    const isSilent = typeof window !== 'undefined' && window.localStorage?.getItem('clipkeep_analytics_silent') === 'true';
    if (!isSilent) {
      console.log(`[Analytics] Event: ${name}`, params);
    }
  }

  if (typeof window === 'undefined') {
    callback?.();
    return;
  }

  let callbackCalled = false;
  const eventParams = {
    ...params,
    transport_type: 'beacon',
    ...(callback
      ? {
          event_timeout: DEFAULT_EVENT_TIMEOUT_MS,
          event_callback: () => {
            if (callbackCalled) return;
            callbackCalled = true;
            callback();
          },
        }
      : {}),
  };

  if (typeof window.gtag !== 'function') {
    queueCommand(['event', name, eventParams]);
    if (IS_DEV) console.warn('[Analytics] gtag not found; queued event');
    callback?.();
    return;
  }

  flushQueuedEvents();
  window.gtag('event', name, eventParams);
  if (callback) {
    window.setTimeout(() => {
      if (callbackCalled) return;
      callbackCalled = true;
      callback();
    }, DEFAULT_EVENT_TIMEOUT_MS);
  }
}

export function trackEventAndWait(
  name: string,
  params: Record<string, unknown> = {},
  timeoutMs = DEFAULT_EVENT_TIMEOUT_MS,
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      resolve();
    };

    sendEvent(name, params, finish);
    window.setTimeout(finish, timeoutMs);
  });
}

export function trackPageView(gaId: string, url: string): void {
  if (IS_DEV) {
    const isSilent = typeof window !== 'undefined' && window.localStorage?.getItem('clipkeep_analytics_silent') === 'true';
    if (!isSilent) {
      console.log(`[Analytics] PageView: ${url} (GA_ID: ${gaId})`);
    }
  }

  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') {
    queueCommand(['config', gaId, { page_path: url }]);
    if (IS_DEV) console.warn('[Analytics] gtag not found for pageview');
    return;
  }

  flushQueuedEvents();
  window.gtag('config', gaId, {
    page_path: url,
  });
}

export {};
