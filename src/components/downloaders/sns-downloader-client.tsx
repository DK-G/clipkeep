'use client';

import { useState } from 'react';
import { ExtractorForm, Platform } from '@/components/extractor-form';
import { Locale, localeDir, PlatformPageDict } from '@/lib/i18n/ui';
import { AdsterraNative } from '@/components/ads/native-banner';
import { GallerySection } from '@/components/gallery-section';
import { Breadcrumbs } from '@/components/breadcrumbs';

interface SnsDownloaderClientProps {
  platform: Platform;
  locale: Locale;
  dict: PlatformPageDict;
}

const sectionLabels: Record<Locale, { realtime: string; about: string }> = {
  en: { realtime: 'Real-time', about: 'About' },
  ar: { realtime: 'في الوقت الفعلي', about: 'حول' },
  ja: { realtime: 'リアルタイム', about: 'について' },
  es: { realtime: 'En tiempo real', about: 'Acerca de' },
  pt: { realtime: 'Em tempo real', about: 'Sobre' },
  fr: { realtime: 'En temps réel', about: 'À propos' },
  id: { realtime: 'Waktu nyata', about: 'Tentang' },
  hi: { realtime: 'रीयल टाइम', about: 'जानकारी' },
  de: { realtime: 'Echtzeit', about: 'Info' },
  tr: { realtime: 'Gerçek zamanlı', about: 'Hakkında' },
};

export function SnsDownloaderClient({ platform, locale, dict: t }: SnsDownloaderClientProps) {
  const dir = localeDir(locale);
  const labels = sectionLabels[locale];

  const [message, setMessage] = useState(t.subtitle);
  const [helpSlug, setHelpSlug] = useState<string | null>(null);

  const handleStatusChange = (msg: string, slug: string | null) => {
    setMessage(msg);
    setHelpSlug(slug);
  };

  return (
    <main dir={dir} className="max-w-4xl mx-auto px-6 py-12">
      <Breadcrumbs items={[{ label: t.title }]} locale={locale} />
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-50 mb-4">{t.title}</h1>
        <p className="text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto italic">
          {t.subtitle}
        </p>
      </div>

      <div className="mb-16">
        <ExtractorForm platform={platform} locale={locale} onStatusChange={handleStatusChange} />
        
        <AdsterraNative />

        <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-sm text-gray-600 dark:text-slate-400">
          <span className="font-bold mr-2 text-gray-900 dark:text-slate-200">{t.statusLabel}:</span>
          <span>{message}</span>
          {helpSlug && (
            <span className="mx-2">
              | {t.helpPage}: <a href={`/solution/${helpSlug}?locale=${locale}`} className="text-blue-600 dark:text-blue-400 hover:underline">/solution/{helpSlug}</a>
            </span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 text-gray-700 dark:text-slate-300">
        <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-blue-50 dark:border-blue-900/30 text-gray-900 dark:text-slate-100">{t.howToTitle}</h2>
          <ol className="space-y-4 list-decimal pl-5">
            {t.howToSteps.map((step: string, i: number) => (
              <li key={i} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        </section>

        <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-blue-50 dark:border-blue-900/30 text-gray-900 dark:text-slate-100">{t.whyTitle}</h2>
          <p className="mb-4 text-gray-600 dark:text-slate-400">{t.whyBody}</p>
          <ul className="space-y-3 list-disc pl-5">
            {t.whyPoints.map((point: string, i: number) => (
              <li key={i} className="leading-relaxed">{point}</li>
            ))}
          </ul>
          <AdsterraNative />
        </section>
      </div>

      <GallerySection id="realtime" platform={platform} locale={locale} title={labels.realtime} type="recent" layout="masonry" hideMeta={false} />

      <div className="my-12">
        <AdsterraNative />
      </div>

      {t.trendingTitle && (
        <GallerySection id="trending" platform={platform} locale={locale} title={t.trendingTitle} type="trending" layout="masonry" hideMeta={false} />
      )}

      <div className="my-12">
        <AdsterraNative />
      </div>

      {/* Detailed SEO Content Section */}
      {t.seoContent && (
        <section className="mt-16 prose dark:prose-invert prose-blue max-w-none bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-slate-100 border-b dark:border-slate-800 pb-4">
            {labels.about}
          </h2>
          <div className="text-gray-700 dark:text-slate-300 leading-relaxed space-y-6 text-lg whitespace-pre-line">
            {t.seoContent}
          </div>
        </section>
      )}
    </main>
  );
}

