import { normalizeLocale, homeText } from '@/lib/i18n/ui';
import { getGalleryMetadata } from '@/lib/metadata-helper';
import { GalleryPageContent, type GalleryPlatform } from '@/components/gallery-page-content';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

const SUPPORTED_PLATFORMS = [
  'tiktok', 'twitter', 'reddit', 'facebook', 'telegram', 
  'pinterest', 'threads', 'bluesky', 'bilibili', 'discord', 'lemon8', 'instagram'
];

interface Props {
  params: Promise<{ platform: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  return SUPPORTED_PLATFORMS.map((platform) => ({
    platform,
  }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const p = await params;
  const sp = await searchParams;
  const platform = p.platform.toLowerCase();
  
  if (!SUPPORTED_PLATFORMS.includes(platform)) {
    return {};
  }

  const locale = sp.locale as string || 'en';
  return getGalleryMetadata('trending', platform, locale);
}

export default async function Page({ params, searchParams }: Props) {
  const p = await params;
  const sp = await searchParams;
  const platform = p.platform.toLowerCase();

  if (!SUPPORTED_PLATFORMS.includes(platform)) {
    notFound();
  }

  const locale = normalizeLocale(sp.locale as string);
  const t = homeText[locale] || homeText['en'];
  
  return (
    <Suspense fallback={<div className="p-20 text-center text-gray-400">{t.initialMessage}...</div>}>
      <GalleryPageContent platform={platform as GalleryPlatform} locale={locale} type="trending" />
    </Suspense>
  );
}

