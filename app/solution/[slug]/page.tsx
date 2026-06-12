import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SolutionContentClient } from '@/components/solution-content-client';
import { solutionText, normalizeLocale, type Locale } from '@/lib/i18n/ui';
import { buildLocaleAlternates, getLocalizedUrl } from '@/lib/metadata-helper';
import { findSolutionPage } from '@/lib/solution-pages/store';

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
            name: locale === 'ja' ? 'ホーム' : 'Home',
            item: getLocalizedUrl('/', locale),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: locale === 'ja' ? '解決策' : 'Solutions',
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
        mainEntity: [
          {
            '@type': 'Question',
            name: page.title,
            acceptedAnswer: {
              '@type': 'Answer',
              text: page.sections.map(s => s.body).join(' '),
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SolutionContentClient data={page} locale={locale} />
    </>
  );
}
