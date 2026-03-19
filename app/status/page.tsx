import type { Metadata } from 'next';
import { StatusContentClient } from '@/components/status-content-client';
import { normalizeLocale, statusText } from '@/lib/i18n/ui';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = statusText[locale];
  const base = 'https://clipkeep.net';
  const path = '/status';
  const url = `${base}${path}${locale !== 'en' ? `?locale=${locale}` : ''}`;

  return {
    title: t.title,
    description: t.currentBody,
    alternates: {
      canonical: url,
      languages: {
        en: `${base}${path}`,
        ja: `${base}${path}?locale=ja`,
        ar: `${base}${path}?locale=ar`,
      },
    },
  };
}

export default async function StatusPage({ searchParams }: Props) {
  const sp = await searchParams;
  const localeParam = typeof sp.locale === 'string' ? sp.locale : undefined;

  return <StatusContentClient localeParam={localeParam} />;
}
