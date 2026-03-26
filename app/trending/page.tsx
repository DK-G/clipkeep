import type { Metadata } from 'next';
import { normalizeLocale, homeText } from '@/lib/i18n/ui';
import { SITE_URL } from '@/lib/site-url';
import { TrendingPageClient } from '@/components/trending-page-client';

interface TrendingPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: TrendingPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = homeText[locale] || homeText.en;
  const base = SITE_URL;
  const url = `${base}/trending${locale !== 'en' ? `?locale=${locale}` : ''}`;

  return {
    title: `${t.globalTrending || 'Trending Hub'} | ClipKeep`,
    description: t.globalTrendingSubtitle || 'Discover popular clips across all platforms.',
    alternates: {
      canonical: url,
      languages: {
        en: `${base}/trending`,
        ja: `${base}/trending?locale=ja`,
        ar: `${base}/trending?locale=ar`,
        es: `${base}/trending?locale=es`,
        pt: `${base}/trending?locale=pt`,
        fr: `${base}/trending?locale=fr`,
        id: `${base}/trending?locale=id`,
        hi: `${base}/trending?locale=hi`,
        de: `${base}/trending?locale=de`,
        tr: `${base}/trending?locale=tr`,
        'x-default': `${base}/trending`,
      },
    },
    openGraph: {
      title: `${t.globalTrending || 'Trending Hub'} | ClipKeep`,
      description: t.globalTrendingSubtitle || 'Discover popular clips across all platforms.',
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t.globalTrending || 'Trending Hub'} | ClipKeep`,
      description: t.globalTrendingSubtitle || 'Discover popular clips across all platforms.',
    },
  };
}

export default async function TrendingPage({ searchParams }: TrendingPageProps) {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = homeText[locale] || homeText.en;
  const base = SITE_URL;
  const url = `${base}/trending${locale !== 'en' ? `?locale=${locale}` : ''}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${t.globalTrending || 'Trending Hub'} | ClipKeep`,
    description: t.globalTrendingSubtitle || 'Discover popular clips across all platforms.',
    url,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TrendingPageClient />
    </>
  );
}
