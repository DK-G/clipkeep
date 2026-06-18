import type { Metadata } from 'next';
import { StatusContentClient } from '@/components/status-content-client';
import { normalizeLocale, statusText } from '@/lib/i18n/ui';
import { SITE_URL } from '@/lib/site-url';
import { buildLocaleAlternates } from '@/lib/metadata-helper';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = statusText[locale];
  const base = SITE_URL;
  const path = '/status';
  const url = `${base}${path}${locale !== 'en' ? `?locale=${locale}` : ''}`;

  return {
    title: t.title,
    description: t.currentBody,
    alternates: buildLocaleAlternates(path, locale),
    openGraph: {
      title: t.title,
      description: t.currentBody,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.currentBody,
    },
  };
}

export default async function StatusPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = statusText[locale];
  const base = SITE_URL;
  const path = '/status';
  const url = `${base}${path}${locale !== 'en' ? `?locale=${locale}` : ''}`;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t.title,
    description: t.currentBody,
    url,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <StatusContentClient localeParam={typeof sp.locale === 'string' ? sp.locale : undefined} />
    </>
  );
}

