'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { homeText, Locale } from '@/lib/i18n/ui';
import { trackEvent } from '@/lib/analytics/gtag';

export type Platform = 'telegram' | 'twitter' | 'tiktok' | 'instagram';

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

interface ExtractorFormProps {
  platform?: Platform;
  locale?: Locale;
  onStatusChange?: (message: string, helpSlug: string | null, retryAfterSec: number | undefined) => void;
}

export function ExtractorForm({ platform = 'telegram', locale = 'en', onStatusChange }: ExtractorFormProps) {
  const router = useRouter();
  const [sourceUrl, setSourceUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const l = homeText[locale];

  const canSubmit = useMemo(() => {
    return !!sourceUrl && !submitting;
  }, [sourceUrl, submitting]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    if (onStatusChange) onStatusChange(l.creatingJob, null, undefined);

    trackEvent('extract_submit', { platform, locale });

    try {
      const res = await fetch('/api/v1/extract/prepare', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: sourceUrl, platform, locale }),
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
          trackEvent('extract_submit_degraded', { platform, locale });
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
    <form onSubmit={onSubmit} className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-4">
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{l.sourceUrlLabel}</label>
        <div className="relative">
          <input
            type="url"
            required
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder={
              platform === 'telegram' ? 'https://t.me/...' : 
              platform === 'twitter' ? 'https://x.com/...' :
              platform === 'instagram' ? 'https://instagram.com/...' :
              'https://tiktok.com/...'
            }
            className="w-full min-w-[300px] px-3.5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 transition-colors duration-150 outline-none text-base placeholder:text-slate-500 dark:placeholder:text-slate-400 appearance-none text-slate-900 dark:text-white"
          />
        </div>
      </div>
 
      <button 
        type="submit" 
        disabled={!canSubmit} 
        className={`w-full py-3 rounded-md font-bold text-base transition-all duration-150 active:scale-[0.97] will-change-transform ${
          canSubmit 
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
            : 'bg-slate-100 text-slate-500 dark:text-slate-600 cursor-not-allowed shadow-none'
        }`}
      >
        {submitting ? l.submitting : l.submit}
      </button>
    </form>
  );
}
