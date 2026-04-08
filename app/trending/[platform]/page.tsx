import { normalizeLocale, homeText } from '@/lib/i18n/ui';
import { getGalleryMetadata, getRangeDescription, normalizeGalleryRange } from '@/lib/metadata-helper';
import { GalleryPageContent, type GalleryPlatform } from '@/components/gallery-page-content';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { SITE_URL } from '@/lib/site-url';

const SUPPORTED_PLATFORMS = [
  'tiktok', 'twitter', 'reddit', 'facebook', 'telegram',
  'pinterest', 'threads', 'bluesky', 'bilibili', 'discord', 'lemon8'
];
const DEFAULT_TRENDING_RANGE = 'week';

interface Props {
  params: Promise<{ platform: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  return SUPPORTED_PLATFORMS.map((platform) => ({ platform }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const p = await params;
  const sp = await searchParams;
  const platform = p.platform.toLowerCase();
  if (!SUPPORTED_PLATFORMS.includes(platform)) return {};

  const locale = typeof sp.locale === 'string' ? sp.locale : 'en';
  const range = normalizeGalleryRange(typeof sp.range === 'string' ? sp.range : undefined, DEFAULT_TRENDING_RANGE);
  const shouldNoindex = Object.keys(sp).some((key) => key !== 'locale');
  const description = getRangeDescription(normalizeLocale(locale), 'trending', range);
  return getGalleryMetadata('trending', platform, locale, shouldNoindex, description);
}

export default async function Page({ params, searchParams }: Props) {
  const p = await params;
  const sp = await searchParams;
  const platform = p.platform.toLowerCase();
  if (!SUPPORTED_PLATFORMS.includes(platform)) notFound();

  const locale = normalizeLocale(sp.locale as string);
  const t = homeText[locale] || homeText['en'];
  const range = normalizeGalleryRange(typeof sp.range === 'string' ? sp.range : undefined, DEFAULT_TRENDING_RANGE);
  const description = getRangeDescription(locale, 'trending', range);
  const platformLabel = platform.charAt(0).toUpperCase() + platform.slice(1);
  const url = `${SITE_URL}/trending/${platform}${locale !== 'en' ? `?locale=${locale}` : ''}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: `${platformLabel} Trending | ClipKeep`,
        description,
        url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}${locale !== 'en' ? `/?locale=${locale}` : '/'}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Trending',
            item: `${SITE_URL}/trending${locale !== 'en' ? `?locale=${locale}` : ''}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: platformLabel,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Suspense fallback={<div className="p-20 text-center text-gray-400">{t.initialMessage}...</div>}>
        <GalleryPageContent platform={platform as GalleryPlatform} locale={locale} type="trending" range={typeof sp.range === 'string' && ['today', 'week', 'month'].includes(sp.range) ? (sp.range as 'today' | 'week' | 'month') : undefined} />
      </Suspense>
    </>
  );
}

