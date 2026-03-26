import type { Metadata } from 'next';
import { normalizeLocale, menuText } from '@/lib/i18n/ui';
import { SITE_URL } from '@/lib/site-url';
import { LatestPageClient } from '@/components/latest-page-client';

interface LatestPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: LatestPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = menuText[locale] || menuText.en;
  const base = SITE_URL;
  const url = `${base}/latest${locale !== 'en' ? `?locale=${locale}` : ''}`;

  return {
    title: `${t.latest} | ClipKeep`,
    description: t.latestPageSubtitle || 'Discover the most recent global extractions across the platform.',
    alternates: {
      canonical: url,
      languages: {
        en: `${base}/latest`,
        ja: `${base}/latest?locale=ja`,
        ar: `${base}/latest?locale=ar`,
        es: `${base}/latest?locale=es`,
        pt: `${base}/latest?locale=pt`,
        fr: `${base}/latest?locale=fr`,
        id: `${base}/latest?locale=id`,
        hi: `${base}/latest?locale=hi`,
        de: `${base}/latest?locale=de`,
        tr: `${base}/latest?locale=tr`,
        'x-default': `${base}/latest`,
      },
    },
    openGraph: {
      title: `${t.latest} | ClipKeep`,
      description: t.latestPageSubtitle || 'Discover the most recent global extractions across the platform.',
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t.latest} | ClipKeep`,
      description: t.latestPageSubtitle || 'Discover the most recent global extractions across the platform.',
    },
  };
}

export default async function LatestPage({ searchParams }: LatestPageProps) {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = menuText[locale] || menuText.en;
  const base = SITE_URL;
  const url = `${base}/latest${locale !== 'en' ? `?locale=${locale}` : ''}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${t.latest} | ClipKeep`,
    description: t.latestPageSubtitle || 'Discover the most recent global extractions across the platform.',
    url,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LatestPageClient />
    </>
  );
}
