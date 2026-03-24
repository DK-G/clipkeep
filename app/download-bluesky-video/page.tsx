import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SnsDownloaderClient } from '@/components/downloaders/sns-downloader-client';
import { blueskyText, normalizeLocale, menuText } from '@/lib/i18n/ui';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function loadingText(locale: ReturnType<typeof normalizeLocale>): string {
  const dict = {
    en: 'Loading...',
    ja: '読み込み中...',
    ar: 'جار التحميل...',
    es: 'Cargando...',
    pt: 'Carregando...',
    fr: 'Chargement...',
    id: 'Memuat...',
    hi: 'लोड हो रहा है...',
    de: 'Wird geladen...',
    tr: 'Yukleniyor...'
  } as const;
  return dict[locale];
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = blueskyText[locale];
  const base = 'https://clipkeep.net';
  const path = '/download-bluesky-video';
  const url = `${base}${path}${locale !== 'en' ? `?locale=${locale}` : ''}`;

  return {
    title: t.title,
    description: t.subtitle,
    alternates: {
      canonical: url,
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
    },
    openGraph: {
      title: t.title,
      description: t.subtitle,
      url: url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.subtitle,
    },
  };
}

export default async function Page({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = blueskyText[locale];
  const menu = menuText[locale];

  const websiteUrl = `https://clipkeep.net/download-bluesky-video?locale=${locale}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        'name': t.title,
        'url': websiteUrl,
        'applicationCategory': 'MultimediaApplication',
        'operatingSystem': 'Any',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'featureList': 'Fast Bluesky video extraction, High-quality MP4',
        'description': t.subtitle
      },
      {
        '@type': 'HowTo',
        'name': t.howToTitle,
        'description': t.subtitle,
        'step': t.howToSteps.map((step: string, index: number) => ({
          '@type': 'HowToStep',
          'position': index + 1,
          'text': step
        }))
      },
      {
        '@type': 'FAQPage',
        'mainEntity': t.faqItems.map((item: { q: string, a: string }) => ({
          '@type': 'Question',
          'name': item.q,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': item.a
          }
        }))
      }
    ]
  };

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: menu.downloads, item: '/' },
          { name: t.title, item: `/download-bluesky-video?locale=${locale}` }
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="p-12 text-center text-slate-600 dark:text-slate-400">{loadingText(locale)}</div>}>
        <SnsDownloaderClient locale={locale} platform="bluesky" dict={t} />
      </Suspense>
    </>
  );
}
