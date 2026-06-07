import type { Metadata } from 'next';
import { LatestPageClient } from '@/components/latest-page-client';
import { HubAnalytics } from '@/components/analytics/hub-analytics';
import { normalizeLocale, menuText } from '@/lib/i18n/ui';
import {
  buildLocaleAlternates,
  getGalleryQueryGuard,
  getLocalizedUrl,
  getRangeDescription,
  normalizeGalleryRange,
} from '@/lib/metadata-helper';

interface LatestPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const DEFAULT_LATEST_RANGE = 'month';

export async function generateMetadata({ searchParams }: LatestPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = menuText[locale] || menuText.en;
  const range = normalizeGalleryRange(typeof sp.range === 'string' ? sp.range : undefined, DEFAULT_LATEST_RANGE);
  const description = getRangeDescription(locale, 'latest', range);
  const guard = getGalleryQueryGuard(sp, 'latest');
  const canonicalUrl = getLocalizedUrl(guard.canonicalPath, locale);

  return {
    title: `${t.latest} | ClipKeep`,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLocaleAlternates(guard.canonicalPath).languages,
    },
    robots: guard.shouldNoindex ? { index: false, follow: true, googleBot: { index: false, follow: true } } : undefined,
    openGraph: { title: `${t.latest} | ClipKeep`, description, url: canonicalUrl, type: 'website' },
    twitter: { card: 'summary_large_image', title: `${t.latest} | ClipKeep`, description },
  };
}

export default async function LatestPage({ searchParams }: LatestPageProps) {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = menuText[locale] || menuText.en;
  const range = normalizeGalleryRange(typeof sp.range === 'string' ? sp.range : undefined, DEFAULT_LATEST_RANGE);
  const description = getRangeDescription(locale, 'latest', range);
  const guard = getGalleryQueryGuard(sp, 'latest');
  const url = getLocalizedUrl(guard.canonicalPath, locale);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${t.latest} | ClipKeep`,
    description,
    url,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HubAnalytics type="latest" />
      <LatestPageClient />
    </>
  );
}
