import type { Metadata } from 'next';
import { Suspense } from 'react';
import { normalizeLocale, homeText } from '@/lib/i18n/ui';
import { SITE_URL } from '@/lib/site-url';
import { HistoryPageContent } from '@/components/history-page-content';

interface HistoryPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: HistoryPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = homeText[locale] || homeText.en;

  return {
    title: `${t.historyTitle} | ClipKeep`,
    description: t.historyTitle,
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${SITE_URL}/history`,
    },
  };
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-10 animate-pulse" />}>
      <HistoryPageContent />
    </Suspense>
  );
}
