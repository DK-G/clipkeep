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
  };

  const descriptions: Record<string, string> = {
    en: 'Learn more about ClipKeep, a fast and secure media extraction tool for TikTok, Twitter, and Telegram.',
    ja: 'TikTok、Twitter、Telegram向けの高速で安全なメディア抽出ツール、ClipKeepについての詳細。',
    ar: 'تعرف على المزيد حول ClipKeep، وهي أداة سريعة وآمنة لاستخراج الوسائط لتيك توك وتويتر وتيليجرام.',
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

export default async function AboutPage({ searchParams }: Props) {
  const sp = await searchParams;
  const localeParam = typeof sp.locale === 'string' ? sp.locale : undefined;

  return <AboutContentClient localeParam={localeParam} />;
}
