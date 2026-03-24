export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://clipkeep.net';

export function buildSiteUrl(path: string, locale?: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (!locale || locale === 'en') return `${SITE_URL}${normalizedPath}`;
  const separator = normalizedPath.includes('?') ? '&' : '?';
  return `${SITE_URL}${normalizedPath}${separator}locale=${locale}`;
}

