'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ExtractorForm } from '@/components/extractor-form';
import { AdsterraNative } from '@/components/ads/native-banner';
import { tiktokText, normalizeLocale, localeDir } from '@/lib/i18n/ui';

function TikTokDownloaderContent() {
  const searchParams = useSearchParams();
  const locale = normalizeLocale(searchParams.get('locale'));
  const dir = localeDir(locale);
  const t = tiktokText[locale];

  const [message, setMessage] = useState(t.subtitle);
  const [helpSlug, setHelpSlug] = useState<string | null>(null);

  const handleStatusChange = (msg: string, slug: string | null) => {
    setMessage(msg);
    setHelpSlug(slug);
  };

  return (
    <main dir={dir} style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1a1a1a', lineHeight: 1.6 }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>{t.title}</h1>
      <p style={{ fontSize: '1.2rem', color: '#444', marginBottom: '2rem' }}>
        {t.subtitle}
      </p>

      {t.note && (
        <div style={{ padding: '24px', backgroundColor: '#fff8e1', border: '1px solid #ffe082', borderRadius: '12px', marginBottom: '3rem' }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#827717' }}>{t.note}</p>
          <p style={{ margin: '8px 0 0', color: '#555', fontSize: '0.95rem' }}>{t.noteBody}</p>
        </div>
      )}

      <div style={{ marginBottom: '3rem' }}>
        <ExtractorForm platform="tiktok" onStatusChange={handleStatusChange} />
        
        <AdsterraNative />

        <div style={{ marginTop: '12px', padding: '12px', borderRadius: '8px', backgroundColor: '#f9f9f9', fontSize: '0.9rem' }}>
          <strong>{t.statusLabel}:</strong> {message}
          {helpSlug && <span style={{ marginLeft: 8 }}>| View Guide: <a href={`/solution/${helpSlug}`}>/solution/{helpSlug}</a></span>}
        </div>
      </div>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>{t.howToTitle}</h2>
        <ol style={{ paddingLeft: '20px', paddingRight: dir === 'rtl' ? '20px' : '0' }}>
          {t.howToSteps.map((step, i) => (
            <li key={i} style={{ marginBottom: '12px' }}>{step}</li>
          ))}
        </ol>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>{t.whyTitle}</h2>
        <p>{t.whyBody}</p>
        <ul style={{ paddingLeft: '20px', paddingRight: dir === 'rtl' ? '20px' : '0' }}>
          {t.whyPoints.map((point, i) => (
            <li key={i} style={{ marginBottom: '8px' }}>{point}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: '1.8rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>{t.faqTitle}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {t.faqItems.map((item, i) => (
            <div key={i}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{item.q}</h3>
              <p style={{ margin: 0, color: '#555' }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function TikTokDownloaderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TikTokDownloaderContent />
    </Suspense>
  );
}
