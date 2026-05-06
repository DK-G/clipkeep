import type { Metadata } from 'next';
import { normalizeLocale, legalText, localeDir } from '@/lib/i18n/ui';
import { SITE_URL } from '@/lib/site-url';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = legalText[locale].privacy;
  const base = SITE_URL;
  const path = '/legal/privacy';
  const url = `${base}${path}${locale !== 'en' ? `?locale=${locale}` : ''}`;

  const descriptions = {
    en: 'Learn how ClipKeep handles personal data and privacy protection.',
    ja: 'ClipKeepにおける個人データの取り扱いとプライバシー保護方針を説明します。',
    ar: 'تعرّف على كيفية معالجة ClipKeep للبيانات وحماية الخصوصية، بما في ذلك استخدام التحليلات وملفات تعريف الارتباط.',
    es: 'Conoce cómo ClipKeep trata los datos personales y protege la privacidad, incluido el uso de analítica y cookies.',
    pt: 'Saiba como o ClipKeep trata dados pessoais e protege sua privacidade.',
    fr: 'Découvrez comment ClipKeep traite les données personnelles et protège la vie privée.',
    id: 'Pelajari bagaimana ClipKeep menangani data pribadi dan melindungi privasi.',
    hi: 'जानें कि ClipKeep व्यक्तिगत डेटा को कैसे संभालता है और गोपनीयता की रक्षा करता है।',
    de: 'Erfahren Sie, wie ClipKeep personenbezogene Daten verarbeitet und die Privatsphäre schützt.',
    tr: 'ClipKeep’in kişisel verileri nasıl işlediğini ve gizliliği nasıl koruduğunu öğrenin.',
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

export default async function PrivacyPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = legalText[locale].privacy;
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



