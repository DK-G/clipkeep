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
    <footer className="max-w-2xl mx-auto mt-8 mb-12 px-4 text-xs text-slate-400 border-t border-slate-50 dark:border-slate-800/50 pt-6">
      <nav className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
        <Link href={buildUrl('/about')} className="hover:text-blue-500 transition-colors uppercase font-bold tracking-tighter">{t.about}</Link>
        <Link href={buildUrl('/faq')} className="hover:text-blue-500 transition-colors uppercase font-bold tracking-tighter">{t.faq}</Link>
        <Link href={buildUrl('/legal/terms')} className="hover:text-blue-500 transition-colors uppercase font-bold tracking-tighter">{t.terms}</Link>
        <Link href={buildUrl('/legal/privacy')} className="hover:text-blue-500 transition-colors uppercase font-bold tracking-tighter">{t.privacy}</Link>
        <Link href={buildUrl('/legal/cookies')} className="hover:text-blue-500 transition-colors uppercase font-bold tracking-tighter">{t.cookies}</Link>
        <Link href={buildUrl('/legal/dmca')} className="hover:text-blue-500 transition-colors uppercase font-bold tracking-tighter">{t.dmca}</Link>
        <Link href={buildUrl('/contact')} className="hover:text-blue-500 transition-colors uppercase font-bold tracking-tighter">{t.contact}</Link>
        <Link href={buildUrl('/status')} className="hover:text-blue-500 transition-colors uppercase font-bold tracking-tighter">{t.status}</Link>
      </nav>
      <p className="leading-relaxed opacity-70">{t.adsDisclaimer}</p>
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
