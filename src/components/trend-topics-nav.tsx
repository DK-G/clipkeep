// 柱2 P0-3: /trending・/trending/[platform] から live トレンドトピックへの
// クローラー追跡可能な実 <a href> 内部リンク（孤立防止＝2026-06-17 の教訓）。
// live トピックが無ければ何も描画しない（空ページ・薄リンクの氾濫を回避）。
import type { Locale } from '@/lib/i18n/ui';
import type { LiveTopic } from '@/lib/trends/topic-store';

const HEADING: Record<string, string> = {
  en: 'Trending topics',
  ja: '話題のトレンド',
  pt: 'Tópicos em alta',
  ar: 'مواضيع رائجة',
};

function headingFor(locale: Locale): string {
  return HEADING[locale] ?? HEADING.en;
}

export function TrendTopicsNav({ topics, locale }: { topics: LiveTopic[]; locale: Locale }) {
  if (topics.length === 0) return null;
  const heading = headingFor(locale);
  // /trend/[slug] は path-based canonical を持つが、内部リンクは既存方針に合わせ
  // ?locale= ビューへ流す（English は素のパス）。getLocalizedUrl で絶対 URL 化。
  const href = (slug: string) =>
    locale === 'en' ? `/trend/${slug}` : `/trend/${slug}?locale=${locale}`;

  return (
    <nav
      aria-label={heading}
      className="max-w-5xl mx-auto px-4 mt-10 mb-2"
    >
      <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-3">{heading}</h2>
      <ul className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <li key={t.slug}>
            <a
              href={href(t.slug)}
              className="inline-block rounded-full border border-gray-200 dark:border-slate-700 px-4 py-1.5 text-sm text-blue-700 dark:text-blue-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
            >
              {t.displayName}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
