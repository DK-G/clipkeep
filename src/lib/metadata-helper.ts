import { Metadata } from 'next';
import { galleryPages, galleryRangeText, normalizeLocale, type Locale } from '@/lib/i18n/ui';
import { SITE_URL } from '@/lib/site-url';

const SUPPORTED_GALLERY_PLATFORMS = new Set([
  'tiktok', 'twitter', 'reddit', 'facebook', 'telegram', 'pinterest', 'threads', 'bluesky', 'bilibili', 'discord', 'lemon8', 'instagram',
]);

export type GalleryRange = 'today' | 'week' | 'month';

export const SUPPORTED_LOCALES = [
  'en',
  'ar',
  'ja',
  'es',
  'pt',
  'fr',
  'id',
  'hi',
  'de',
  'tr',
] as const satisfies readonly Locale[];

const PATH_HREFLANG_LOCALES = new Set<Locale>(['ja', 'pt', 'ar']);

export function getLocalizedPath(path: string, locale: Locale): string {
  if (locale === 'en') {
    return path;
  }
  if (PATH_HREFLANG_LOCALES.has(locale)) {
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  }
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}locale=${locale}`;
}

export function getLocalizedUrl(path: string, locale: Locale): string {
  return `${SITE_URL}${getLocalizedPath(path, locale)}`;
}

// Only locales with distinct URLs (en root + /ja /pt /ar paths) participate in
// hreflang. Query-param locale views are duplicates that canonicalize to the
// English page; listing them in hreflang would contradict their canonical.
const HREFLANG_LOCALES = ['en', 'ja', 'pt', 'ar'] as const satisfies readonly Locale[];

export function buildLocaleAlternates(path: string, currentLocale: Locale = 'en') {
  const languages = Object.fromEntries(
    HREFLANG_LOCALES.map((locale) => [locale, getLocalizedUrl(path, locale)]),
  ) as Partial<Record<Locale, string>>;

  // Each path-locale page is canonical for itself; query-param locale views
  // fold into the English page.
  const canonicalLocale = PATH_HREFLANG_LOCALES.has(currentLocale) ? currentLocale : 'en';

  return {
    canonical: getLocalizedUrl(path, canonicalLocale),
    languages: {
      ...languages,
      'x-default': getLocalizedUrl(path, 'en'),
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
  const url = getLocalizedUrl(path, locale);
  const description = descriptionOverride || dict.description;

  return {
    title: dict.title,
    description,
    alternates: buildLocaleAlternates(path, locale),
    robots: shouldNoindex ? { index: false, follow: true, googleBot: { index: false, follow: true } } : undefined,
    openGraph: { title: dict.title, description, url, type: 'website' },
    twitter: { card: 'summary_large_image', title: dict.title, description },
  };
}
