import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SolutionContentClient } from '@/components/solution-content-client';
import { findSolutionPage } from '@/lib/solution-pages/store';
import { normalizeLocale, type Locale } from '@/lib/i18n/ui';
import { SITE_URL } from '@/lib/site-url';

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

  const base = SITE_URL;
  const path = `/solution/${slug}`;
  const url = `${base}${path}${locale !== 'en' ? `?locale=${locale}` : ''}`;

  const languages = Object.fromEntries(
    allLocales.map((l) => [l, `${base}${path}${l === 'en' ? '' : `?locale=${l}`}`]),
  );

  const description = page.sections[0]?.body || 'ClipKeep solution guide.';
  return {
    title: page.title,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: page.title,
      description,
      url,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description,
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

  const base = SITE_URL;
  const path = `/solution/${slug}`;
  const url = `${base}${path}${locale !== 'en' ? `?locale=${locale}` : ''}`;
  const description = page.sections[0]?.body || 'ClipKeep solution guide.';
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description,
    url,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <SolutionContentClient data={page} locale={locale} />
    </>
  );
}


