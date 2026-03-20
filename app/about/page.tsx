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
    en: 'About ClipKeep',
    ja: 'ClipKeep について',
    ar: 'حول ClipKeep',
    es: 'Acerca de ClipKeep',
    pt: 'Sobre o ClipKeep',
    fr: 'À propos de ClipKeep',
    id: 'Tentang ClipKeep',
    hi: 'ClipKeep के बारे में',
    de: 'Über ClipKeep',
    tr: 'ClipKeep Hakkında',
  };

  const descriptions: Record<string, string> = {
    en: 'Learn more about ClipKeep, a fast and reliable tool for organizing public SNS media links.',
    ja: 'TikTok、Twitter、Telegram向けの高速で安全なメディア抽出ツール、ClipKeepについての詳細。',
    ar: 'تعرّف على ClipKeep، أداة سريعة وموثوقة لتنظيم وحفظ وسائط SNS انطلاقًا من الروابط العامة.',
    es: 'Conoce ClipKeep, una herramienta rápida y fiable para organizar y conservar medios de SNS a partir de enlaces públicos.',
    pt: 'Conheça o ClipKeep, uma ferramenta para organizar e preservar mídias de SNS a partir de links públicos.',
    fr: 'Découvrez ClipKeep, un outil pour organiser et conserver des médias SNS à partir de liens publics.',
    id: 'Pelajari ClipKeep, alat untuk mengelola dan menyimpan media SNS dari tautan publik.',
    hi: 'ClipKeep के बारे में जानें, जो सार्वजनिक लिंक से SNS मीडिया को व्यवस्थित और सुरक्षित रखने में मदद करता है।',
    de: 'Erfahren Sie mehr über ClipKeep, ein Tool zum Organisieren und Archivieren von SNS-Medien über öffentliche Links.',
    tr: 'ClipKeep hakkında bilgi alın: açık bağlantılarla SNS medyasını düzenleme ve arşivleme aracı.',
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

