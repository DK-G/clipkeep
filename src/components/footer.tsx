'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { footerText, normalizeLocale } from '@/lib/i18n/ui';
import { Suspense } from 'react';

function FooterContent() {
  const searchParams = useSearchParams();
  const locale = normalizeLocale(searchParams.get('locale'));
  const t = footerText[locale];

  const buildUrl = (path: string) => {
    return `${path}?locale=${locale}`;
  };

  return (
    <footer style={{ maxWidth: 980, margin: '32px auto 24px', padding: '0 24px', fontSize: 13, color: '#555' }}>
      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
        <Link href={buildUrl('/about')}>{t.about}</Link>
        <Link href={buildUrl('/faq')}>{t.faq}</Link>
        <Link href={buildUrl('/legal/terms')}>{t.terms}</Link>
        <Link href={buildUrl('/legal/privacy')}>{t.privacy}</Link>
        <Link href={buildUrl('/legal/cookies')}>{t.cookies}</Link>
        <Link href={buildUrl('/legal/dmca')}>{t.dmca}</Link>
        <Link href={buildUrl('/contact')}>{t.contact}</Link>
        <Link href={buildUrl('/status')}>{t.status}</Link>
      </nav>
      <p style={{ margin: 0 }}>{t.adsDisclaimer}</p>
    </footer>
  );
}

export function Footer() {
  return (
    <Suspense fallback={<footer style={{ height: 60 }} />}>
      <FooterContent />
    </Suspense>
  );
}
