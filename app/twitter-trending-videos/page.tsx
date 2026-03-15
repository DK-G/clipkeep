import { normalizeLocale, homeText } from '@/lib/i18n/ui';
import { getGalleryMetadata } from '@/lib/metadata-helper';
import { GalleryPageContent } from '@/components/gallery-page-content';
import { Metadata } from 'next';
import { Suspense } from 'react';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const locale = sp.locale as string || 'en';
  return getGalleryMetadata('trending', 'twitter', locale);
}

export default async function Page({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = normalizeLocale(sp.locale as string);
  const t = homeText[locale] || homeText['en'];
  
  return (
    <Suspense fallback={<div className="p-20 text-center text-gray-400">{t.initialMessage}...</div>}>
      <GalleryPageContent platform="twitter" locale={locale} type="trending" />
    </Suspense>
  );
}
