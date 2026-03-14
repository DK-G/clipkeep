'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { homeText, Locale } from '@/lib/i18n/ui';
import { trackEvent } from '@/lib/analytics/gtag';

export type Platform = 'telegram' | 'twitter' | 'tiktok';

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
    return sourceUrl.trim().length > 0 && (platform === 'telegram' || platform === 'twitter') && !submitting;
  }, [platform, sourceUrl, submitting]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    if (onStatusChange) onStatusChange(l.creatingJob, null, undefined);

    trackEvent('extract_submit', { platform, locale });

    try {
      // Trigger Popunder injection on click
      const popScript = document.createElement('script');
      popScript.src = 'https://pl28915034.effectivegatecpm.com/e3/85/b8/e385b8653df6d49480f4caab7d312227.js';
      document.body.appendChild(popScript);

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
    <form onSubmit={onSubmit} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{l.sourceUrlLabel}</label>
        <div className="relative">
          <input
            type="url"
            required
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder={platform === 'telegram' ? 'https://t.me/...' : 'https://x.com/...'}
            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition duration-200 outline-none"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={!canSubmit} 
        className={`w-full py-4 rounded-xl font-bold text-lg transition duration-200 transform active:scale-95 shadow-lg ${
          canSubmit 
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
        }`}
      >
        {submitting ? l.submitting : l.submit}
      </button>
    </form>
  );
}
