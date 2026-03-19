import type { Metadata } from 'next';
import { ContactContentClient } from '@/components/contact-content-client';
import { normalizeLocale } from '@/lib/i18n/ui';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const base = 'https://clipkeep.net';
  const path = '/contact';
  const url = `${base}${path}${locale !== 'en' ? `?locale=${locale}` : ''}`;

  const titles: Record<string, string> = {
    en: 'Contact Us | ClipKeep Support',
    ja: 'お問い合わせ | ClipKeep サポート',
    ar: 'اتصل بنا | دعم ClipKeep',
  };

  const descriptions: Record<string, string> = {
    en: 'Get in touch with the ClipKeep team for support, feedback, or DMCA inquiries.',
    ja: 'サポート、フィードバック、またはDMCAに関するお問い合わせはClipKeepチームまでご連絡ください。',
    ar: 'اتصل بفريق ClipKeep للحصول على الدعم أو الملاحظات أو استفسارات DMCA.',
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    alternates: {
      canonical: url,
      languages: {
        en: `${base}${path}`,
        ja: `${base}${path}?locale=ja`,
        ar: `${base}${path}?locale=ar`,
      },
    },
  };
}

export default async function ContactPage({ searchParams }: Props) {
  const sp = await searchParams;
  const localeParam = typeof sp.locale === 'string' ? sp.locale : undefined;

  return <ContactContentClient localeParam={localeParam} />;
}
