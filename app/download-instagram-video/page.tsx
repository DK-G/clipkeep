import { Suspense } from 'react';
import type { Metadata } from 'next';
import { InstagramDownloaderClient } from '@/components/downloaders/instagram-downloader-client';
import { instagramText, normalizeLocale } from '@/lib/i18n/ui';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = instagramText[locale];
  const base = 'https://clipkeep.net';
  const path = '/download-instagram-video';
  const url = `${base}${path}${locale !== 'en' ? `?locale=${locale}` : ''}`;

  return {
    title: t.title,
    description: t.subtitle,
    alternates: {
      canonical: url,
      languages: {
        en: `${base}${path}`,
        ja: `${base}${path}?locale=ja`,
        ar: `${base}${path}?locale=ar`,
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

export default async function InstagramDownloaderPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = instagramText[locale];

  const websiteUrl = `https://clipkeep.net/download-instagram-video?locale=${locale}`;

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
        'featureList': 'Easy Instagram video extraction, Reel download support, Multilingual interface',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="p-12 text-center text-slate-600 dark:text-slate-400">Loading...</div>}>
        <InstagramDownloaderClient locale={locale} />
      </Suspense>
    </>
  );
}
