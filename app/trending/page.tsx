import type { Metadata } from 'next';
import { normalizeLocale, homeText } from '@/lib/i18n/ui';
import { SITE_URL } from '@/lib/site-url';
import { TrendingPageClient } from '@/components/trending-page-client';
import { getGalleryQueryGuard, getRangeDescription, normalizeGalleryRange } from '@/lib/metadata-helper';

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
  const canonicalUrl = `${SITE_URL}${guard.canonicalPath}${locale !== 'en' ? `?locale=${locale}` : ''}`;

  return {
    title: `${t.globalTrending || 'Trending Hub'} | ClipKeep`,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}${guard.canonicalPath}`,
        ja: `${SITE_URL}${guard.canonicalPath}?locale=ja`,
        ar: `${SITE_URL}${guard.canonicalPath}?locale=ar`,
        es: `${SITE_URL}${guard.canonicalPath}?locale=es`,
        pt: `${SITE_URL}${guard.canonicalPath}?locale=pt`,
        fr: `${SITE_URL}${guard.canonicalPath}?locale=fr`,
        id: `${SITE_URL}${guard.canonicalPath}?locale=id`,
        hi: `${SITE_URL}${guard.canonicalPath}?locale=hi`,
        de: `${SITE_URL}${guard.canonicalPath}?locale=de`,
        tr: `${SITE_URL}${guard.canonicalPath}?locale=tr`,
        'x-default': `${SITE_URL}${guard.canonicalPath}`,
      },
    },
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
  const url = `${SITE_URL}${guard.canonicalPath}${locale !== 'en' ? `?locale=${locale}` : ''}`;
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
      <TrendingPageClient />
    </>
  );
}
