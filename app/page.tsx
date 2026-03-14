'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { homeText, localeDir, normalizeLocale } from '@/lib/i18n/ui';
import { DegradedBanner } from '@/components/degraded-banner';
import { ExtractorForm } from '@/components/extractor-form';
import Link from 'next/link';

type DegradedReason = 'manual' | 'error_ratio' | 'queue_wait' | 'active_jobs' | 'recovered' | 'none';

type HealthResponse = {
  degraded: boolean;
  data: {
    degradedReason: DegradedReason;
  };
};

import { AdsterraNative } from '@/components/ads/native-banner';

function HomePageContent() {
  const searchParams = useSearchParams();
  const locale = normalizeLocale(searchParams.get('locale'));
  const [message, setMessage] = useState(homeText[locale].initialMessage);
  const [helpSlug, setHelpSlug] = useState<string | null>(null);
  const [retryAfterSec, setRetryAfterSec] = useState<number | undefined>(undefined);
  const [degraded, setDegraded] = useState<{ isDegraded: boolean; reason: DegradedReason }>({ isDegraded: false, reason: 'none' });

  const l = homeText[locale];
  const dir = localeDir(locale);

  useEffect(() => {
    setMessage(homeText[locale].initialMessage);
  }, [locale]);

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

  const handleStatusChange = (msg: string, slug: string | null, retry: number | undefined) => {
    setMessage(msg);
    setHelpSlug(slug);
    setRetryAfterSec(retry);
    if (slug) setDegraded((prev) => ({ ...prev, isDegraded: true }));
  };

  return (
    <main dir={dir} style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
      {degraded.isDegraded && <DegradedBanner locale={locale} reason={degraded.reason} helpSlug={helpSlug ?? 'extractor-temporary-limited'} retryAfterSec={retryAfterSec} />}

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">{l.title}</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">{l.subtitle}</p>
      </div>

      <div className="max-w-2xl mx-auto mb-16">
        <ExtractorForm platform="telegram" locale={locale} onStatusChange={handleStatusChange} />
        
        <AdsterraNative />
      </div>

      <section style={{ marginTop: 16, border: '1px solid #eee', borderRadius: 10, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>{l.status}</h2>
        <p>{message}</p>
        {helpSlug && (
          <p>
            {l.helpPage}: <Link href={`/solution/${helpSlug}?locale=${locale}`}>/solution/{helpSlug}</Link>
          </p>
        )}
      </section>

      <section style={{ marginTop: 32, padding: '24px 0', borderTop: '1px solid #f0f0f0' }}>
        <h2>{l.supportedTools}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <Link href={`/download-telegram-video?locale=${locale}`} style={{ padding: 16, border: '1px solid #eee', borderRadius: 12, textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ margin: '0 0 8px' }}>{l.telegramTitle}</h3>
            <p style={{ margin: 0, fontSize: 14, color: '#666' }}>{l.telegramDesc}</p>
          </Link>
          <Link href={`/download-twitter-video?locale=${locale}`} style={{ padding: 16, border: '1px solid #eee', borderRadius: 12, textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ margin: '0 0 8px' }}>{l.twitterTitle}</h3>
            <p style={{ margin: 0, fontSize: 14, color: '#666' }}>{l.twitterDesc}</p>
          </Link>
          <Link href={`/download-tiktok-video?locale=${locale}`} style={{ padding: 16, border: '1px solid #eee', borderRadius: 12, textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ margin: '0 0 8px' }}>{l.tiktokTitle}</h3>
            <p style={{ margin: 0, fontSize: 14, color: '#666' }}>{l.tiktokDesc}</p>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ padding: 80, textAlign: 'center', color: '#666' }}>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
