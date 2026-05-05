declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const IS_DEV = process.env.NODE_ENV === 'development';

export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (IS_DEV) {
    const isSilent = typeof window !== 'undefined' && window.localStorage?.getItem('clipkeep_analytics_silent') === 'true';
    if (!isSilent) {
      console.log(`[Analytics] Event: ${name}`, params);
    }
  }

  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') {
    if (IS_DEV) console.warn('[Analytics] gtag not found');
    return;
  }
  
  window.gtag('event', name, params);
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
    if (IS_DEV) console.warn('[Analytics] gtag not found for pageview');
    return;
  }

  window.gtag('config', gaId, {
    page_path: url,
  });
}

export {};


