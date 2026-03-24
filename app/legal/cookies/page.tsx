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

  const descriptions = {
    en: 'See how ClipKeep uses cookies and similar technologies.',
    ja: 'ClipKeepで使用するCookieおよび類似技術の取り扱いを説明します。',
    ar: 'تعرّف على كيفية استخدام ClipKeep لملفات تعريف الارتباط والتقنيات المشابهة، وخيارات التحكم المتاحة للمستخدم.',
    es: 'Consulta cómo ClipKeep utiliza cookies y tecnologías similares, así como las opciones de control disponibles para el usuario.',
    pt: 'Veja como o ClipKeep usa cookies e tecnologias semelhantes.',
    fr: 'Découvrez comment ClipKeep utilise les cookies et technologies similaires.',
    id: 'Lihat bagaimana ClipKeep menggunakan cookie dan teknologi serupa.',
    hi: 'जानें कि ClipKeep कुकीज़ और समान तकनीकों का उपयोग कैसे करता है।',
    de: 'Erfahren Sie, wie ClipKeep Cookies und ähnliche Technologien verwendet.',
    tr: 'ClipKeep’in çerezleri ve benzer teknolojileri nasıl kullandığını inceleyin.',
  } as const;

  return {
    title: t.title,
    description: descriptions[locale],
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
    openGraph: {
      title: t.title,
      description: descriptions[locale] || descriptions.en,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: descriptions[locale] || descriptions.en,
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

