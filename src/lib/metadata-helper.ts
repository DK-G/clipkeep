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
        ar: `${base}${path}?locale=ar`,
        ja: `${base}${path}?locale=ja`,
        es: `${base}${path}?locale=es`,
        pt: `${base}${path}?locale=pt`,
        fr: `${base}${path}?locale=fr`,
        id: `${base}${path}?locale=id`,
        hi: `${base}${path}?locale=hi`,
        de: `${base}${path}?locale=de`,
        tr: `${base}${path}?locale=tr`,
        'x-default': `${base}${path}`,
      },
    },
    openGraph: {
      title: dict.title,
      description: dict.description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.title,
      description: dict.description,
    },
  };
}
