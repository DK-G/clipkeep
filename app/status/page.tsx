'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { statusText, normalizeLocale, localeDir } from '@/lib/i18n/ui';

function StatusContent() {
  const searchParams = useSearchParams();
  const locale = normalizeLocale(searchParams.get('locale'));
  const dir = localeDir(locale);
  const t = statusText[locale];

  return (
    <main dir={dir} style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>{t.title}</h1>
      <p>{t.liveHealth}: <Link href="/api/v1/health">/api/v1/health</Link></p>

      <h2>{t.currentTitle}</h2>
      <p>{t.currentBody}</p>

      <h2>{t.incidentTitle}</h2>

      <section style={{ border: '1px solid #eee', borderRadius: 10, padding: 12, marginBottom: 12 }}>
        <h3>{t.partialDegradation.title}</h3>
        <p>{t.partialDegradation.body}</p>
        <p>{t.partialDegradation.nextUpdate}</p>
      </section>

      <section style={{ border: '1px solid #eee', borderRadius: 10, padding: 12, marginBottom: 12 }}>
        <h3>{t.scheduledMaintenance.title}</h3>
        <p>{t.scheduledMaintenance.body}</p>
        <p>{t.scheduledMaintenance.window}</p>
      </section>

      <section style={{ border: '1px solid #eee', borderRadius: 10, padding: 12 }}>
        <h3>{t.majorOutage.title}</h3>
        <p>{t.majorOutage.body}</p>
        <p>{t.majorOutage.nextUpdate}</p>
      </section>
    </main>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StatusContent />
    </Suspense>
  );
}

