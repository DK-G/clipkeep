import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SolutionContentClient } from '@/components/solution-content-client';
import { findSolutionPage, Locale as StoreLocale } from '@/lib/solution-pages/store';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function normalizeStoreLocale(value: string | undefined): StoreLocale {
  if (value === 'ar') return 'ar';
  return 'en';
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

  return {
    title: page.title,
    description: page.sections[0]?.body || 'ClipKeep solution guide.',
    alternates: {
      canonical: url,
      languages: {
        en: `${base}${path}`,
        ar: `${base}${path}?locale=ar`,
      },
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
