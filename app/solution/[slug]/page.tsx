import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SolutionContentClient } from '@/components/solution-content-client';
import { findSolutionPage } from '@/lib/solution-pages/store';
import { normalizeLocale, type Locale } from '@/lib/i18n/ui';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const allLocales: Locale[] = ['en', 'ja', 'ar', 'es', 'pt', 'fr', 'id', 'hi', 'de', 'tr'];

function normalizeStoreLocale(value: string | undefined): Locale {
  return normalizeLocale(value);
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const locale = normalizeStoreLocale(typeof sp.locale === 'string' ? sp.locale : undefined);

  const page = findSolutionPage(slug, locale);
  if (!page) return {};

  const base = 'https://clipkeep.net';
  const path = `/solution/${slug}`;
  const url = `${base}${path}${locale !== 'en' ? `?locale=${locale}` : ''}`;

  const languages = Object.fromEntries(
    allLocales.map((l) => [l, `${base}${path}${l === 'en' ? '' : `?locale=${l}`}`]),
  );

  return {
    title: page.title,
    description: page.sections[0]?.body || 'ClipKeep solution guide.',
    alternates: {
      canonical: url,
      languages,
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const locale = normalizeStoreLocale(typeof sp.locale === 'string' ? sp.locale : undefined);

  const page = findSolutionPage(slug, locale);
  if (!page) {
    notFound();
  }

  return <SolutionContentClient data={page} locale={locale} />;
}
