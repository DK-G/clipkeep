import type { Metadata } from 'next';
import { normalizeLocale, legalText, localeDir } from '@/lib/i18n/ui';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = legalText[locale].dmca;
  const base = 'https://clipkeep.net';
  const path = '/legal/dmca';
  const url = `${base}${path}${locale !== 'en' ? `?locale=${locale}` : ''}`;

  const descriptions = {
    en: 'Read the copyright and DMCA reporting policy for ClipKeep.',
    ja: 'ClipKeepの著作権およびDMCA申請手続きに関する方針を確認できます。',
    ar: 'اطلع على سياسة حقوق النشر وإجراءات الإبلاغ وفق DMCA في ClipKeep، بما في ذلك متطلبات البلاغ.',
    es: 'Consulta la política de derechos de autor y el procedimiento de reportes DMCA en ClipKeep, incluidos los requisitos del aviso.',
    pt: 'Consulte a política de direitos autorais e notificações DMCA do ClipKeep.',
    fr: 'Consultez la politique de droits d’auteur et de signalement DMCA de ClipKeep.',
    id: 'Pelajari kebijakan hak cipta dan pelaporan DMCA di ClipKeep.',
    hi: 'ClipKeep की कॉपीराइट और DMCA रिपोर्टिंग नीति पढ़ें।',
    de: 'Lesen Sie die Richtlinie zu Urheberrecht und DMCA-Meldungen bei ClipKeep.',
    tr: 'ClipKeep’in telif hakkı ve DMCA bildirim politikasını inceleyin.',
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

export default async function DmcaPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = legalText[locale].dmca;
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

