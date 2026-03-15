import { Metadata } from 'next';
import { galleryPages, normalizeLocale } from '@/lib/i18n/ui';

export function getGalleryMetadata(type: string, platform: string, localeStr: string | null): Metadata {
  const locale = normalizeLocale(localeStr);
  const pageKey = `${type}${platform.charAt(0).toUpperCase()}${platform.slice(1)}`;
  const dict = (galleryPages[locale]?.[pageKey]) || (galleryPages['en']?.[pageKey]);

  if (!dict) return {};

  const path = `/${platform}-${type}-videos`; // Adjusting to match intended structure
  
  return {
    title: dict.title,
    description: dict.description,
    alternates: {
      canonical: `${path}?locale=${locale}`,
      languages: {
        en: `${path}?locale=en`,
        ja: `${path}?locale=ja`,
      },
    },
    openGraph: {
      title: dict.title,
      description: dict.description,
      type: 'website',
    },
  };
}
