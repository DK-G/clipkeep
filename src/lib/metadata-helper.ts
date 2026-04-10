import { Metadata } from 'next';
import { galleryPages, galleryRangeText, normalizeLocale, type Locale } from '@/lib/i18n/ui';
import { SITE_URL } from '@/lib/site-url';

const SUPPORTED_GALLERY_PLATFORMS = new Set([
  'tiktok', 'twitter', 'reddit', 'facebook', 'telegram', 'pinterest', 'threads', 'bluesky', 'bilibili', 'discord', 'lemon8', 'instagram',
]);

export type GalleryRange = 'today' | 'week' | 'month';

function buildLocaleAlternates(path: string) {
  const base = SITE_URL;
  return {
    canonical: `${base}${path}`,
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
  };
}

export function normalizeGalleryRange(value: string | null | undefined, fallback: GalleryRange): GalleryRange {
  return value === 'today' || value === 'week' || value === 'month' ? value : fallback;
}

export function getRangeDescription(locale: Locale, type: 'trending' | 'latest', range: GalleryRange): string {
  const dict = galleryRangeText[locale] || galleryRangeText.en;
  if (type === 'trending') return range === 'today' ? dict.trendingTodaySubtitle : range === 'month' ? dict.trendingMonthSubtitle : dict.trendingWeekSubtitle;
  return range === 'today' ? dict.latestTodaySubtitle : range === 'week' ? dict.latestWeekSubtitle : dict.latestMonthSubtitle;
}

export function getGalleryCanonicalPath(type: string, platform?: string | null): string {
  if (platform && SUPPORTED_GALLERY_PLATFORMS.has(platform)) return `/${type}/${platform}`;
  return `/${type}`;
}

export function getGalleryQueryGuard(searchParams: Record<string, string | string[] | undefined>, type: string) {
  const platformParam = typeof searchParams.p === 'string' ? searchParams.p.toLowerCase() : null;
  const hasRange = typeof searchParams.range === 'string' && searchParams.range.length > 0;
  const hasUnknownParams = Object.keys(searchParams).some((key) => !['locale', 'p', 'range'].includes(key));
  const canonicalPath = getGalleryCanonicalPath(type, platformParam);
  const shouldNoindex = Boolean(platformParam || hasRange || hasUnknownParams);
  return { canonicalPath, shouldNoindex, platformParam };
}

export function getGalleryMetadata(
  type: string,
  platform: string,
  localeStr: string | null,
  shouldNoindex = false,
  descriptionOverride?: string,
): Metadata {
  const locale = normalizeLocale(localeStr);
  const pageKey = `${type}${platform.charAt(0).toUpperCase()}${platform.slice(1)}`;
  const dict = galleryPages[locale]?.[pageKey] || galleryPages.en?.[pageKey];
  if (!dict) return {};

  const path = getGalleryCanonicalPath(type, platform === 'all' ? null : platform);
  const url = `${SITE_URL}${path}${locale !== 'en' ? `?locale=${locale}` : ''}`;
  const description = descriptionOverride || dict.description;

  return {
    title: dict.title,
    description,
    alternates: buildLocaleAlternates(path),
    robots: shouldNoindex ? { index: false, follow: true, googleBot: { index: false, follow: true } } : undefined,
    openGraph: { title: dict.title, description, url, type: 'website' },
    twitter: { card: 'summary_large_image', title: dict.title, description },
  };
}
