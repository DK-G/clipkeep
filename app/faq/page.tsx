import type { Metadata } from 'next';
import Link from 'next/link';
import { normalizeLocale, faqText, localeDir } from '@/lib/i18n/ui';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = faqText[locale];
  const base = 'https://clipkeep.net';
  const path = '/faq';
  const url = `${base}${path}${locale !== 'en' ? `?locale=${locale}` : ''}`;

  return {
    title: t.title,
    description: 'Find answers to common questions about ClipKeep, our media extraction tool, and supported platforms.',
    alternates: {
      canonical: url,
      languages: {
        en: `${base}${path}`,
        ja: `${base}${path}?locale=ja`,
        ar: `${base}${path}?locale=ar`,
        es: `${base}${path}?locale=es`,
        pt: `${base}${path}?locale=pt`,
        fr: `${base}${path}?locale=fr`,
        id: `${base}${path}?locale=id`,
        hi: `${base}${path}?locale=hi`,
        de: `${base}${path}?locale=de`,
        tr: `${base}${path}?locale=tr`,
      },
    },
  };
}

export default async function FAQPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = faqText[locale];
  const dir = localeDir(locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': t.items.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return (
    <main dir={dir} className="max-w-4xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-50 mb-4 tracking-tight">{t.title}</h1>
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">{t.lastUpdated}</p>

      <div className="flex flex-col gap-6">
        {t.items.map((faq, index) => (
          <div key={index} className="p-8 border border-gray-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-3">{faq.question}</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>

      <section className="mt-16 p-10 bg-gray-50 dark:bg-slate-900/50 rounded-3xl text-center border border-gray-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-4">{t.stillQuestions}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">{t.contactText}</p>
        <Link 
          href={`/contact${locale !== 'en' ? `?locale=${locale}` : ''}`} 
          className="inline-block px-8 py-3 bg-gray-900 dark:bg-blue-600 text-white dark:text-white rounded-full font-bold hover:bg-gray-800 dark:hover:bg-blue-500 transition-colors shadow-lg"
        >
          {t.contactSupport}
        </Link>
      </section>
    </main>
  );
}
