import type { Metadata } from 'next';
import { HubAnalytics } from '@/components/analytics/hub-analytics';
import { TrendingPageClient } from '@/components/trending-page-client';
import { TrendTopicsNav } from '@/components/trend-topics-nav';
import { loadLiveTopics } from '@/lib/trends/live';
import { normalizeLocale, homeText } from '@/lib/i18n/ui';
import {
  buildLocaleAlternates,
  getGalleryQueryGuard,
  getLocalizedUrl,
  getRangeDescription,
  normalizeGalleryRange,
} from '@/lib/metadata-helper';

interface TrendingPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const DEFAULT_TRENDING_RANGE = 'week';

export async function generateMetadata({ searchParams }: TrendingPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = homeText[locale] || homeText.en;
  const range = normalizeGalleryRange(typeof sp.range === 'string' ? sp.range : undefined, DEFAULT_TRENDING_RANGE);
  const description = getRangeDescription(locale, 'trending', range);
  const guard = getGalleryQueryGuard(sp, 'trending');
  const canonicalUrl = getLocalizedUrl(guard.canonicalPath, locale);

  return {
    title: `${t.globalTrending || 'Trending Hub'} | ClipKeep`,
    description,
    alternates: buildLocaleAlternates(guard.canonicalPath, locale),
    robots: guard.shouldNoindex ? { index: false, follow: true, googleBot: { index: false, follow: true } } : undefined,
    openGraph: { title: `${t.globalTrending || 'Trending Hub'} | ClipKeep`, description, url: canonicalUrl, type: 'website' },
    twitter: { card: 'summary_large_image', title: `${t.globalTrending || 'Trending Hub'} | ClipKeep`, description },
  };
}

export default async function TrendingPage({ searchParams }: TrendingPageProps) {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = homeText[locale] || homeText.en;
  const range = normalizeGalleryRange(typeof sp.range === 'string' ? sp.range : undefined, DEFAULT_TRENDING_RANGE);
  const description = getRangeDescription(locale, 'trending', range);
  const guard = getGalleryQueryGuard(sp, 'trending');
  const url = getLocalizedUrl(guard.canonicalPath, locale);
  const liveTopics = await loadLiveTopics();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${t.globalTrending || 'Trending Hub'} | ClipKeep`,
    description,
    url,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HubAnalytics type="trending" />
      <TrendTopicsNav topics={liveTopics} locale={locale} />
      <TrendingPageClient />
    </>
  );
}
