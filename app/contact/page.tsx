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
    en: 'Contact Us',
    ja: 'お問い合わせ',
    ar: 'اتصل بنا',
    es: 'Contacto',
    pt: 'Contato',
    fr: 'Contact',
    id: 'Kontak',
    hi: 'संपर्क',
    de: 'Kontakt',
    tr: 'Iletisim',
  };

  const descriptions: Record<string, string> = {
    en: 'Get in touch with the ClipKeep team for support, feedback, or DMCA inquiries.',
    ja: 'サポート、フィードバック、またはDMCAに関するお問い合わせはClipKeepチームまでご連絡ください。',
    ar: 'اتصل بفريق ClipKeep للحصول على الدعم أو الملاحظات أو استفسارات DMCA.',
    es: 'Ponte en contacto con el equipo de ClipKeep para soporte, comentarios o consultas de DMCA.',
    pt: 'Entre em contato com a equipe do ClipKeep para suporte, feedback ou solicitacoes de DMCA.',
    fr: 'Contactez l equipe ClipKeep pour le support, les retours ou les demandes DMCA.',
    id: 'Hubungi tim ClipKeep untuk dukungan, masukan, atau permintaan DMCA.',
    hi: 'Support, feedback, ya DMCA sawalon ke liye ClipKeep team se sampark karein.',
    de: 'Kontaktieren Sie das ClipKeep-Team fur Support, Feedback oder DMCA-Anfragen.',
    tr: 'Destek, geri bildirim veya DMCA talepleri icin ClipKeep ekibiyle iletisime gecin.',
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

export default async function ContactPage({ searchParams }: Props) {
  const sp = await searchParams;
  const localeParam = typeof sp.locale === 'string' ? sp.locale : undefined;

  return <ContactContentClient localeParam={localeParam} />;
}
