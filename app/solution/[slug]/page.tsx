import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SolutionContentClient } from '@/components/solution-content-client';
import { solutionText, normalizeLocale, type Locale } from '@/lib/i18n/ui';
import { buildLocaleAlternates, getLocalizedUrl } from '@/lib/metadata-helper';
import { findSolutionPage, getRelatedSolutions } from '@/lib/solution-pages/store';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function normalizeStoreLocale(value: string | undefined): Locale {
  return normalizeLocale(value);
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const locale = normalizeStoreLocale(typeof sp.locale === 'string' ? sp.locale : undefined);

  const page = findSolutionPage(slug, locale);
  if (!page) return {};

  const path = `/solution/${slug}`;
  const url = getLocalizedUrl(path, locale);
  const dict = solutionText[locale] || solutionText.en;
  const description = page.sections[0]?.body || dict.metaDescription || 'ClipKeep solution guide.';

  return {
    title: page.title,
    description,
    alternates: buildLocaleAlternates(path, locale),
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

  const path = `/solution/${slug}`;
  const url = getLocalizedUrl(path, locale);
  const dict = solutionText[locale] || solutionText.en;
  const description = page.sections[0]?.body || dict.metaDescription || 'ClipKeep solution guide.';
  const related = getRelatedSolutions(slug, locale);

  // Localized breadcrumb labels — the structured-data breadcrumb must match the
  // page locale (ja/pt/ar previously fell back to English "Home"/"Solutions").
  const breadcrumbLabels: Record<Locale, { home: string; solutions: string }> = {
    en: { home: 'Home', solutions: 'Solutions' },
    ja: { home: 'ホーム', solutions: '解決策' },
    ar: { home: 'الرئيسية', solutions: 'الحلول' },
    es: { home: 'Inicio', solutions: 'Soluciones' },
    pt: { home: 'Início', solutions: 'Soluções' },
    fr: { home: 'Accueil', solutions: 'Solutions' },
    id: { home: 'Beranda', solutions: 'Solusi' },
    hi: { home: 'होम', solutions: 'समाधान' },
    de: { home: 'Startseite', solutions: 'Lösungen' },
    tr: { home: 'Ana Sayfa', solutions: 'Çözümler' },
  };
  const crumbs = breadcrumbLabels[locale] || breadcrumbLabels.en;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: page.title,
        description,
        url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: crumbs.home,
            item: getLocalizedUrl('/', locale),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: crumbs.solutions,
            item: getLocalizedUrl('/faq', locale),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: page.title,
            item: url,
          },
        ],
      },
      {
        '@type': 'HowTo',
        name: page.title,
        description,
        step: page.sections.map((section, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: section.heading,
          text: section.body,
          url: `${url}#${section.id}`,
        })),
      },
      {
        '@type': 'FAQPage',
        // One Q&A per section (localized heading -> question, body -> answer)
        // so ja/pt/ar pages emit a complete multilingual FAQ instead of a
        // single concatenated answer.
        mainEntity: page.sections.map(section => ({
          '@type': 'Question',
          name: section.heading,
          acceptedAnswer: {
            '@type': 'Answer',
            text: section.body,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SolutionContentClient data={page} locale={locale} related={related} />
    </>
  );
}
