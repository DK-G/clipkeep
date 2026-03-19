import { Metadata } from 'next';
import { galleryPages, normalizeLocale } from '@/lib/i18n/ui';

export function getGalleryMetadata(type: string, platform: string, localeStr: string | null): Metadata {
  const locale = normalizeLocale(localeStr);
  const pageKey = `${type}${platform.charAt(0).toUpperCase()}${platform.slice(1)}`;
  const dict = (galleryPages[locale]?.[pageKey]) || (galleryPages['en']?.[pageKey]);

  if (!dict) return {};

  const base = 'https://clipkeep.net';
  const path = `/${platform}-${type}-videos`;
  const url = `${base}${path}${locale !== 'en' ? `?locale=${locale}` : ''}`;
  
  return {
    title: dict.title,
    description: dict.description,
    alternates: {
      canonical: url,
      languages: {
        en: `${base}${path}`,
        ja: `${base}${path}?locale=ja`,
        ar: `${base}${path}?locale=ar`,
      },
    },
    openGraph: {
      title: dict.title,
      description: dict.description,
      type: 'website',
    },
  };
}
