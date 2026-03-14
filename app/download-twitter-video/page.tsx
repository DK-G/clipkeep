'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ExtractorForm } from '@/components/extractor-form';
import { AdsterraNative } from '@/components/ads/native-banner';
import { twitterText, normalizeLocale, localeDir } from '@/lib/i18n/ui';

function TwitterDownloaderContent() {
  const searchParams = useSearchParams();
  const locale = normalizeLocale(searchParams.get('locale'));
  const dir = localeDir(locale);
  const t = twitterText[locale];

  const [message, setMessage] = useState(t.subtitle);
  const [helpSlug, setHelpSlug] = useState<string | null>(null);

  const handleStatusChange = (msg: string, slug: string | null) => {
    setMessage(msg);
    setHelpSlug(slug);
  };

  return (
    <main dir={dir} className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{t.title}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      <div className="mb-16">
        <ExtractorForm platform="twitter" locale={locale} onStatusChange={handleStatusChange} />
        
        <AdsterraNative />

        <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-600">
          <span className="font-bold mr-2">{t.statusLabel}:</span>
          <span>{message}</span>
          {helpSlug && (
            <span className="mx-2">
              | {t.helpPage}: <a href={`/solution/${helpSlug}?locale=${locale}`} className="text-blue-600 hover:underline">/solution/{helpSlug}</a>
            </span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 text-gray-700">
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-blue-50">{t.howToTitle}</h2>
          <ol className="space-y-4 list-decimal pl-5">
            {t.howToSteps.map((step, i) => (
              <li key={i} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-blue-50">{t.whyTitle}</h2>
          <p className="mb-4 text-gray-600">{t.whyBody}</p>
          <ul className="space-y-3 list-disc pl-5">
            {t.whyPoints.map((point, i) => (
              <li key={i} className="leading-relaxed">{point}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-16 bg-gray-50 p-8 rounded-3xl">
        <h2 className="text-2xl font-bold mb-8 text-center">{t.faqTitle}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {t.faqItems.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-3 text-gray-900">{item.q}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function TwitterDownloaderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TwitterDownloaderContent />
    </Suspense>
  );
}
