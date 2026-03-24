import type { Metadata } from 'next';
import { normalizeLocale, homeText } from '@/lib/i18n/ui';
import { getGalleryMetadata } from '@/lib/metadata-helper';
import { GalleryPageContent } from '@/components/gallery-page-content';
import { Suspense } from 'react';

export const metadata: Metadata = { robots: { index: false, follow: false } };

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
 
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const locale = (sp.locale as string) || 'en';
  return getGalleryMetadata('trending', 'instagram', locale);
}
 
export default async function Page({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = normalizeLocale(sp.locale as string);
  const t = homeText[locale] || homeText.en;
  
  return (
    <Suspense fallback={<div className="p-20 text-center text-gray-400">{t.initialMessage}...</div>}>
      <GalleryPageContent platform="instagram" locale={locale} type="trending" />
    </Suspense>
  );
}

