'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { homeText, Locale } from '@/lib/i18n/ui';
import { trackEvent } from '@/lib/analytics/gtag';

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
  threads: /threads\.net\//i,
  bluesky: /(bsky\.app\/profile\/|at:\/\/|bsky\.social\/)/i,
  lemon8: /lemon8-app\.com\//i,
  bilibili: /(bilibili\.com\/video\/|b23\.tv\/)/i,
  discord: /(discord\.com\/channels\/|discord\.com\/attachments\/|cdn\.discordapp\.com\/)/i,
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

  const l = homeText[locale];

  const activePlatform = detectedPlatform || initialPlatform;

  const handleUrlChange = (url: string) => {
    setSourceUrl(url);
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

  const canSubmit = useMemo(() => {
    return !!sourceUrl && !submitting;
  }, [sourceUrl, submitting]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    if (onStatusChange) onStatusChange(l.creatingJob, null, undefined);

    trackEvent('extract_submit', { platform: activePlatform, locale });

    try {
      const res = await fetch('/api/v1/extract/prepare', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: sourceUrl, platform: activePlatform, locale }),
      });

      const payload = (await res.json()) as PrepareSuccess | ApiError;

      if (!res.ok || !('data' in payload)) {
        if ('error' in payload && payload.error.code === 'SERVICE_DEGRADED') {
          if (onStatusChange) {
            onStatusChange(
              l.degradedMessage,
              payload.error.details?.helpPageSlug ?? 'extractor-temporary-limited',
              payload.error.details?.retryAfterSec
            );
          }
          trackEvent('extract_submit_degraded', { platform: activePlatform, locale });
          return;
        }

        if (onStatusChange) onStatusChange(l.invalidRequest, null, undefined);
        return;
      }

      router.push(`/result/${payload.data.jobId}?locale=${locale}`);
    } catch {
      if (onStatusChange) onStatusChange(l.networkError, null, undefined);
    } finally {
      setSubmitting(false);
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
    </form>
  );
}
