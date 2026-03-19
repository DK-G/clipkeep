import type { Metadata } from 'next';
import { AboutContentClient } from '@/components/about-content-client';
import { normalizeLocale } from '@/lib/i18n/ui';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const base = 'https://clipkeep.net';
  const path = '/about';
  const url = `${base}${path}${locale !== 'en' ? `?locale=${locale}` : ''}`;

  const titles: Record<string, string> = {
    en: 'About',
    ja: 'ClipKeep について',
    ar: 'حول',
    es: 'Acerca de ClipKeep',
    pt: 'Sobre o ClipKeep',
    fr: 'A propos de ClipKeep',
    id: 'Tentang ClipKeep',
    hi: 'ClipKeep के बारे में',
    de: 'Uber ClipKeep',
    tr: 'ClipKeep Hakkinda',
  };

  const descriptions: Record<string, string> = {
    en: 'Learn more about ClipKeep, a fast and secure media extraction tool for TikTok, Twitter, and Telegram.',
    ja: 'TikTok、Twitter、Telegram向けの高速で安全なメディア抽出ツール、ClipKeepについての詳細。',
    ar: 'تعرف على المزيد حول ClipKeep، وهي أداة سريعة وآمنة لاستخراج الوسائط لتيك توك وتويتر وتيليجرام.',
    es: 'Conoce ClipKeep, una herramienta para organizar y preservar medios de SNS mediante enlaces publicos.',
    pt: 'Conheca o ClipKeep, uma ferramenta para organizar e preservar midias de SNS a partir de links publicos.',
    fr: 'Decouvrez ClipKeep, un outil pour organiser et conserver des medias SNS a partir de liens publics.',
    id: 'Pelajari ClipKeep, alat untuk mengelola dan menyimpan media SNS dari tautan publik.',
    hi: 'ClipKeep ke bare me jane, jo public links se SNS media ko sangrahit karne me madad karta hai.',
    de: 'Erfahren Sie mehr uber ClipKeep, ein Tool zum Organisieren und Archivieren von SNS-Medien uber offentliche Links.',
    tr: 'ClipKeep hakkinda bilgi alin: acik baglantilarla SNS medyasini duzenleme ve arsivleme araci.',
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

export default async function AboutPage({ searchParams }: Props) {
  const sp = await searchParams;
  const localeParam = typeof sp.locale === 'string' ? sp.locale : undefined;

  return <AboutContentClient localeParam={localeParam} />;
}
