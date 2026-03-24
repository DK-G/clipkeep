'use client';

import { FormEvent, useMemo, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { homeText, Locale } from '@/lib/i18n/ui';
import { trackEvent } from '@/lib/analytics/gtag';

type TurnstileRenderOptions = {
  sitekey: string;
  callback: (token: string) => void;
  'expired-callback': () => void;
  'error-callback': () => void;
  theme: 'auto' | 'light' | 'dark';
  size: 'normal' | 'compact' | 'invisible';
};

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: TurnstileRenderOptions) => string;
      reset: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string;
      remove: (widgetId?: string) => void;
    };
  }
}

export type Platform = 'telegram' | 'twitter' | 'tiktok' | 'reddit' | 'pinterest' | 'threads' | 'bluesky' | 'lemon8' | 'bilibili' | 'discord' | 'facebook';

type PrepareSuccess = {
  requestId: string;
  data: {
    jobId: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    pollAfterMs: number;
  };
};

type ApiError = {
  requestId: string;
  error: {
    code: string;
    message: string;
    details?: {
      retryAfterSec?: number;
      helpPageSlug?: string;
      reason?: unknown;
    };
  };
};

const platformPatterns: Record<string, RegExp> = {
  telegram: /t\.me\//i,
  twitter: /(x|twitter)\.com\//i,
  tiktok: /tiktok\.com\//i,
  reddit: /reddit\.com\/(r|user|comments)/i,
  pinterest: /(pinterest\.com\/pin\/|pin\.it\/)/i,
  threads: /threads\.(com|net)\//i,
  bluesky: /bsky\.app\/profile\//i,
  lemon8: /(lemon8-app\.com\/|v\.lemon8-app\.com\/)/i,
  bilibili: /(bilibili\.com\/video\/|b23\.tv\/)/i,
  discord: /(discord\.com\/channels\/|discord\.com\/attachments\/|cdn\.discordapp\.com\/|media\.discordapp\.net\/)/i,
  facebook: /(facebook\.com\/|fb\.watch\/|fb\.com\/)/i,
};

const platformColors: Record<string, string> = {
  twitter: 'border-slate-900 shadow-slate-900/10',
  tiktok: 'border-slate-950 shadow-slate-950/10',
  telegram: 'border-blue-400 shadow-blue-400/10',
  reddit: 'border-orange-600 shadow-orange-600/10',
  pinterest: 'border-red-600 shadow-red-600/10',
  threads: 'border-slate-900 shadow-slate-900/10',
  bluesky: 'border-blue-400 shadow-blue-400/10',
  lemon8: 'border-yellow-400 shadow-yellow-400/10',
  bilibili: 'border-pink-400 shadow-pink-400/10',
  discord: 'border-indigo-500 shadow-indigo-500/10',
  facebook: 'border-blue-600 shadow-blue-600/10',
};

interface ExtractorFormProps {
  platform?: Platform;
  locale?: Locale;
  onStatusChange?: (message: string, helpSlug: string | null, retryAfterSec: number | undefined) => void;
  hero?: boolean;
}

export function ExtractorForm({ platform: initialPlatform = 'telegram', locale = 'en', onStatusChange, hero = false }: ExtractorFormProps) {
  const router = useRouter();
  const [sourceUrl, setSourceUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [detectedPlatform, setDetectedPlatform] = useState<Platform | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const [localStatus, setLocalStatus] = useState<string | null>(null);

  const l = homeText[locale];

  const updateStatus = (message: string, helpSlug: string | null = null, retryAfterSec: number | undefined = undefined) => {
    if (onStatusChange) {
      onStatusChange(message, helpSlug, retryAfterSec);
    } else {
      setLocalStatus(message);
    }
  };

  const activePlatform = detectedPlatform || initialPlatform;

  const handleUrlChange = (url: string) => {
    setSourceUrl(url);
    if (localStatus) setLocalStatus(null);
    if (!url) {
      setDetectedPlatform(null);
      return;
    }

    for (const [p, regex] of Object.entries(platformPatterns)) {
      if (regex.test(url)) {
        setDetectedPlatform(p as Platform);
        return;
      }
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const initTurnstile = () => {
      if (window.turnstile && turnstileContainerRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
          callback: (token: string) => {
            setTurnstileToken(token);
            setLocalStatus(null);
          },
          'expired-callback': () => setTurnstileToken(null),
          'error-callback': () => {
            setTurnstileToken(null);
            updateStatus('Turnstile Error. Please try again.');
          },
          theme: 'auto',
          size: 'normal',
        });
      } else if (!window.turnstile) {
        timer = setTimeout(initTurnstile, 500);
      }
    };
    initTurnstile();
    return () => {
      if (timer) clearTimeout(timer);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  const canSubmit = useMemo(() => {
    return !!sourceUrl && !submitting && !!turnstileToken;
  }, [sourceUrl, submitting, turnstileToken]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setLocalStatus(null);
    updateStatus(l.creatingJob);

    trackEvent('extract_submit', { platform: activePlatform, locale });

    try {
      const res = await fetch('/api/v1/extract/prepare', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ 
          url: sourceUrl, 
          platform: activePlatform, 
          locale,
          turnstileToken
        }),
      });

      const payload = (await res.json()) as PrepareSuccess | ApiError;

      if (!res.ok || !('data' in payload)) {
        if ('error' in payload) {
          if (payload.error.code === 'SERVICE_DEGRADED') {
            updateStatus(
              l.degradedMessage,
              payload.error.details?.helpPageSlug ?? 'extractor-temporary-limited',
              payload.error.details?.retryAfterSec
            );
            trackEvent('extract_submit_degraded', { platform: activePlatform, locale });
            return;
          }
          
          updateStatus(payload.error.message || l.invalidRequest);
          return;
        }

        updateStatus(l.invalidRequest);
        return;
      }

      router.push(`/result/${payload.data.jobId}?locale=${locale}`);
    } catch {
      updateStatus(l.networkError);
    } finally {
      setSubmitting(false);
      // Reset Turnstile after each attempt
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
      setTurnstileToken(null);
    }
  };

  return (
    <form 
      onSubmit={onSubmit} 
      className={`${hero ? 'max-w-3xl mx-auto' : ''} glass-panel p-1.5 rounded-2xl transition-all duration-500 ${detectedPlatform ? platformColors[detectedPlatform] : 'border-transparent'}`}
    >
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="url"
            required
            value={sourceUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={
              activePlatform === 'telegram' ? 'https://t.me/...' : 
              activePlatform === 'twitter' ? 'https://x.com/...' :
              activePlatform === 'reddit' ? 'https://reddit.com/...' :
              activePlatform === 'pinterest' ? 'https://pinterest.com/...' :
              activePlatform === 'threads' ? 'https://threads.net/...' :
              activePlatform === 'bluesky' ? 'https://bsky.app/...' :
              activePlatform === 'lemon8' ? 'https://lemon8-app.com/...' :
              activePlatform === 'bilibili' ? 'https://bilibili.com/...' :
              activePlatform === 'discord' ? 'https://discord.com/...' :
              activePlatform === 'facebook' ? 'https://facebook.com/...' :
              'https://tiktok.com/...'
            }
            className="w-full h-14 sm:h-16 pl-6 pr-4 glass-input rounded-xl outline-none text-base sm:text-lg appearance-none text-slate-900 dark:text-white"
          />
          {detectedPlatform && (
            <div className={`absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg animate-in fade-in zoom-in duration-300 ${platformColors[detectedPlatform].split(' ')[0].replace('border-', 'bg-')}`}>
              {detectedPlatform}
            </div>
          )}
        </div>
 
        <button 
          type="submit" 
          disabled={!canSubmit} 
          className={`h-14 sm:h-16 px-8 rounded-xl font-black text-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${
            canSubmit 
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.4)]' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
          }`}
        >
          {submitting ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {l.submit}
            </>
          )}
        </button>
      </div>

      {localStatus && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {localStatus}
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <div ref={turnstileContainerRef} />
      </div>
    </form>
  );
}




