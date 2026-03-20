import type { Metadata } from 'next';
import Link from 'next/link';
import { keywordArticles, type BlogLocale } from '@/lib/blog/keyword-articles';
import { normalizeLocale } from '@/lib/i18n/ui';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function toBlogLocale(input: string | null | undefined): BlogLocale {
  const n = normalizeLocale(input);
  if (n === 'es' || n === 'ar' || n === 'ja') return n;
  return 'en';
}

const categoryLabel: Record<BlogLocale, { twitter: string; tiktok: string; telegram: string; comparison: string }> = {
  en: {
    twitter: 'Twitter',
    tiktok: 'TikTok',
    telegram: 'Telegram',
    comparison: 'Comparison / Safety',
  },
  es: {
    twitter: 'Twitter',
    tiktok: 'TikTok',
    telegram: 'Telegram',
    comparison: 'Comparación / Seguridad',
  },
  ar: {
    twitter: 'إكس (Twitter)',
    tiktok: 'تيك توك',
    telegram: 'تيليجرام',
    comparison: 'مقارنة / أمان',
  },
  ja: {
    twitter: 'Twitter',
    tiktok: 'TikTok',
    telegram: 'Telegram',
    comparison: '比較 / セキュリティ',
  },
};

const pageText: Record<BlogLocale, { title: string; subtitle: string; listName: string }> = {
  en: {
    title: 'ClipKeep SEO Blog',
    subtitle: 'Keyword-focused articles with EN / ES / AR variants.',
    listName: 'ClipKeep SEO Blog Articles',
  },
  es: {
    title: 'Blog SEO de ClipKeep',
    subtitle: 'Artículos orientados a keywords en variantes EN / ES / AR.',
    listName: 'Artículos del Blog SEO de ClipKeep',
  },
  ar: {
    title: 'مدونة ClipKeep لتحسين الظهور',
    subtitle: 'مقالات موجهة للكلمات المفتاحية باللغات EN / ES / AR.',
    listName: 'مقالات مدونة ClipKeep SEO',
  },
  ja: {
    title: 'ClipKeep SEO ブログ',
    subtitle: '日英・西・亜言語対応のキーワード解説記事。',
    listName: 'ClipKeep SEO ブログ記事一覧',
  },
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const locale = toBlogLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = pageText[locale];
  const base = 'https://clipkeep.net';
  const path = '/blog';
  const url = `${base}${path}${locale === 'en' ? '' : `?locale=${locale}`}`;

  return {
    title: t.title,
    description: t.subtitle,
    alternates: {
      canonical: url,
      languages: {
        en: `${base}${path}`,
        ja: `${base}${path}?locale=ja`,
        es: `${base}${path}?locale=es`,
        ar: `${base}${path}?locale=ar`,
      },
    },
  };
}

export default async function BlogIndexPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = toBlogLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = pageText[locale];
  const q = locale === 'en' ? '' : `?locale=${locale}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clipkeep.net';

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t.listName,
    itemListElement: keywordArticles.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: post.keyword[locale],
      url: `${siteUrl}/blog/${post.slug}${q}`,
    })),
  };

  const grouped = {
    twitter: keywordArticles.filter((x) => x.category === 'twitter'),
    tiktok: keywordArticles.filter((x) => x.category === 'tiktok'),
    telegram: keywordArticles.filter((x) => x.category === 'telegram'),
    comparison: keywordArticles.filter((x) => x.category === 'comparison'),
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-slate-50">{t.title}</h1>
      <p className="mt-2 text-gray-700 dark:text-slate-300">{t.subtitle}</p>

      <div className="mt-8 space-y-8">
        {(Object.keys(grouped) as Array<keyof typeof grouped>).map((cat) => (
          <section key={cat} className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{categoryLabel[locale][cat]}</h2>
            <ul className="mt-3 space-y-2 text-sm sm:text-base">
              {grouped[cat].map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}${q}`} className="text-blue-600 hover:underline">
                    {post.keyword[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
