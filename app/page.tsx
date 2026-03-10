'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { homeText, localeDir, normalizeLocale } from '@/lib/i18n/ui';
import { DegradedBanner } from '@/components/degraded-banner';
import { trackEvent } from '@/lib/analytics/gtag';

type Platform = 'telegram' | 'twitter' | 'tiktok';
type DegradedReason = 'manual' | 'error_ratio' | 'queue_wait' | 'active_jobs' | 'recovered' | 'none';

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
      reason?: DegradedReason;
    };
  };
};

type HealthResponse = {
  degraded: boolean;
  data: {
    degradedReason: DegradedReason;
  };
};

const PLATFORM_OPTIONS: Array<{ value: Platform; label: string; labelAr: string; disabled?: boolean }> = [
  { value: 'telegram', label: 'Telegram (Priority)', labelAr: 'تيليجرام (الأولوية)', disabled: false },
  { value: 'twitter', label: 'X / Twitter (Next)', labelAr: 'X / تويتر (التالي)', disabled: false },
  { value: 'tiktok', label: 'TikTok (Later)', labelAr: 'تيك توك (لاحقًا)', disabled: true },
];

export default function HomePage() {
  const router = useRouter();
  const [sourceUrl, setSourceUrl] = useState('');
  const [platform, setPlatform] = useState<Platform>('telegram');
  const [locale, setLocale] = useState<'en' | 'ar'>('en');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(homeText.en.initialMessage);
  const [helpSlug, setHelpSlug] = useState<string | null>(null);
  const [retryAfterSec, setRetryAfterSec] = useState<number | undefined>(undefined);
  const [degraded, setDegraded] = useState<{ isDegraded: boolean; reason: DegradedReason }>({ isDegraded: false, reason: 'none' });

  const l = homeText[locale];
  const dir = localeDir(locale);

  const canSubmit = useMemo(() => {
    return sourceUrl.trim().length > 0 && (platform === 'telegram' || platform === 'twitter') && !submitting;
  }, [platform, sourceUrl, submitting]);

  useEffect(() => {
    let cancelled = false;
    const loadHealth = async () => {
      try {
        const res = await fetch('/api/v1/health', { method: 'GET' });
        const payload = (await res.json()) as HealthResponse;
        if (!cancelled && res.ok) {
          setDegraded({ isDegraded: payload.degraded, reason: payload.data.degradedReason });
        }
      } catch {
        // no-op
      }
    };
    loadHealth();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(l.creatingJob);
    setHelpSlug(null);
    setRetryAfterSec(undefined);

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
          setMessage(l.degradedMessage);
          setHelpSlug(payload.error.details?.helpPageSlug ?? 'extractor-temporary-limited');
          setRetryAfterSec(payload.error.details?.retryAfterSec);
          setDegraded({ isDegraded: true, reason: payload.error.details?.reason ?? 'none' });
          trackEvent('extract_submit_degraded', { platform, locale });
          return;
        }

        setMessage(l.invalidRequest);
        return;
      }

      router.push(`/result/${payload.data.jobId}?locale=${locale}`);
    } catch {
      setMessage(l.networkError);
    } finally {
      setSubmitting(false);
    }
  };

  const onLocaleChange = (value: string) => {
    const next = normalizeLocale(value);
    setLocale(next);
    setMessage(homeText[next].initialMessage);
  };

  return (
    <main dir={dir} style={{ maxWidth: 860, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      {degraded.isDegraded && <DegradedBanner locale={locale} reason={degraded.reason} helpSlug={helpSlug ?? 'extractor-temporary-limited'} retryAfterSec={retryAfterSec} />}

      <h1 style={{ marginBottom: 8 }}>{l.title}</h1>
      <p style={{ marginTop: 0, color: '#444' }}>{l.subtitle}</p>

      <form onSubmit={onSubmit} style={{ border: '1px solid #ddd', borderRadius: 10, padding: 16, background: '#fafafa' }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>{l.platformLabel}</label>
        <select value={platform} onChange={(e) => setPlatform(e.target.value as Platform)} style={{ width: '100%', padding: 10, marginBottom: 12 }}>
          {PLATFORM_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {locale === 'ar' ? opt.labelAr : opt.label}
            </option>
          ))}
        </select>

        <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>{l.sourceUrlLabel}</label>
        <input
          type="url"
          required
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          placeholder={platform === 'telegram' ? 'https://t.me/...' : 'https://x.com/...'}
          style={{ width: '100%', padding: 10, marginBottom: 12 }}
        />

        <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>{l.localeLabel}</label>
        <select value={locale} onChange={(e) => onLocaleChange(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 12 }}>
          <option value="en">{l.localeEn}</option>
          <option value="ar">{l.localeAr}</option>
        </select>

        <button type="submit" disabled={!canSubmit} style={{ padding: '10px 14px' }}>
          {submitting ? l.submitting : l.submit}
        </button>
      </form>

      <section style={{ marginTop: 16, border: '1px solid #eee', borderRadius: 10, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>{l.status}</h2>
        <p>{message}</p>
        {helpSlug && (
          <p>
            {l.helpPage}: <a href={`/solution/${helpSlug}?locale=${locale}`}>/solution/{helpSlug}</a>
          </p>
        )}
      </section>
    </main>
  );
}
