import type { Metadata } from 'next';
import { normalizeLocale, legalText, localeDir } from '@/lib/i18n/ui';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = legalText[locale].cookies;
  const base = 'https://clipkeep.net';
  const path = '/legal/cookies';
  const url = `${base}${path}${locale !== 'en' ? `?locale=${locale}` : ''}`;

  return {
    title: t.title,
    description: 'Cookie Policy for ClipKeep - Learn how we use cookies to improve your experience.',
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

export default async function CookiePolicyPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = legalText[locale].cookies;
  const dir = localeDir(locale);

  return (
    <main dir={dir} className="max-w-4xl mx-auto px-6 py-12 text-slate-900 dark:text-slate-50">
      <h1 className="text-4xl font-extrabold mb-4 tracking-tight">{t.title}</h1>
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">{t.lastUpdated}</p>

      <div className="space-y-10">
        {t.sections.map((section, index) => (
          <section key={index}>
            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
              {section.content}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
