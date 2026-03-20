import Link from 'next/link';
import { keywordArticles } from '@/lib/blog/keyword-articles';

const categoryLabel = {
  twitter: 'Twitter',
  tiktok: 'TikTok',
  telegram: 'Telegram',
  comparison: 'Comparison / Safety',
} as const;

export default function BlogIndexPage() {
  const grouped = {
    twitter: keywordArticles.filter((x) => x.category === 'twitter'),
    tiktok: keywordArticles.filter((x) => x.category === 'tiktok'),
    telegram: keywordArticles.filter((x) => x.category === 'telegram'),
    comparison: keywordArticles.filter((x) => x.category === 'comparison'),
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-slate-50">ClipKeep SEO Blog</h1>
      <p className="mt-2 text-gray-700 dark:text-slate-300">
        Keyword-focused articles with EN / ES / AR variants.
      </p>

      <div className="mt-8 space-y-8">
        {(Object.keys(grouped) as Array<keyof typeof grouped>).map((cat) => (
          <section key={cat} className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{categoryLabel[cat]}</h2>
            <ul className="mt-3 space-y-2 text-sm sm:text-base">
              {grouped[cat].map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
                    {post.keyword.en}
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
