import type { Metadata } from 'next';
import { normalizeLocale, legalText, localeDir } from '@/lib/i18n/ui';
import { SITE_URL } from '@/lib/site-url';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = legalText[locale].terms;
  const base = SITE_URL;
  const path = '/legal/terms';
  const url = `${base}${path}${locale !== 'en' ? `?locale=${locale}` : ''}`;

  const descriptions = {
    en: 'Read the terms and conditions for using ClipKeep services.',
    ja: 'ClipKeepのサービス利用に関する利用条件を確認できます。',
    ar: 'راجع شروط وأحكام استخدام خدمات ClipKeep، بما في ذلك نطاق الخدمة ومسؤوليات المستخدم.',
    es: 'Consulta los términos y condiciones de uso de ClipKeep, incluido el alcance del servicio y las responsabilidades del usuario.',
    pt: 'Leia os termos e condições para usar os serviços do ClipKeep.',
    fr: 'Consultez les conditions d’utilisation des services ClipKeep.',
    id: 'Baca syarat dan ketentuan penggunaan layanan ClipKeep.',
    hi: 'ClipKeep सेवाओं के उपयोग की शर्तें और नियम पढ़ें।',
    de: 'Lesen Sie die Nutzungsbedingungen für die Dienste von ClipKeep.',
    tr: 'ClipKeep hizmetlerinin kullanım şart ve koşullarını okuyun.',
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

export default async function TermsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = legalText[locale].terms;
  const dir = localeDir(locale);

  return (
    <main dir={dir} className="max-w-4xl mx-auto px-6 py-12 text-slate-900 dark:text-slate-50">
      <h1 className="text-4xl font-extrabold mb-4 tracking-tight">{t.title}</h1>
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">{t.lastUpdated}</p>

      <div className="space-y-10">
        {t.sections.map((section: { title: string; content: string }, index: number) => (
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



