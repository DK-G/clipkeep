import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { normalizeLocale, localeDir, type Locale } from '@/lib/i18n/ui';
import { buildLocaleAlternates, getLocalizedUrl } from '@/lib/metadata-helper';
import { getTopicBySlug, type TopicRecord, type TopicJob } from '@/lib/trends/topic-store';
import { isSlugLive, isSlugRemoved } from '@/lib/trends/live';

// Topics are written to KV by the hourly cron at runtime, so this page must
// execute per request (no static optimization / caching of the KV read).
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getTrendKv(): Promise<KVNamespace | null> {
  const env = (await getCloudflareContext()).env as { TREND_KV?: KVNamespace };
  return env.TREND_KV ?? null;
}

async function loadTopic(slug: string): Promise<TopicRecord | null> {
  const kv = await getTrendKv();
  if (!kv) return null;
  return getTopicBySlug(kv, slug);
}

// Localized chrome for the trend hub. ja is primary (cron emits ja jobs); the
// other canonical locales fall back to en until Phase 2 translates topics.
type Chrome = {
  titleSuffix: string;
  intro: (topic: string) => string;
  clipsHeading: string;
  openClip: string;
  stepsHeading: string;
  steps: string[];
  faqHeading: string;
  faq: (topic: string) => { q: string; a: string }[];
  linksHeading: string;
  trendingLink: string;
  home: string;
  trending: string;
};

const CHROME: Record<'en' | 'ja' | 'pt' | 'ar', Chrome> = {
  ja: {
    titleSuffix: 'の動画を保存・ダウンロードする方法',
    intro: (t) =>
      `いま話題の「${t}」に関連する動画を、ClipKeep でまとめて保存・ダウンロードする方法を紹介します。下のクリップから開いて、各動画の保存リンクを取得できます。`,
    clipsHeading: '関連クリップ',
    openClip: 'この動画を開く',
    stepsHeading: 'ダウンロード手順',
    steps: [
      '保存したい動画のクリップを開きます。',
      '画質や形式を選んで保存リンクを取得します。',
      'リンクから端末に動画を保存します。',
    ],
    faqHeading: 'よくある質問',
    faq: (t) => [
      { q: `「${t}」の動画はダウンロードできますか？`, a: '公開されている動画であれば、各クリップを開いて保存リンクを取得できます。非公開・地域制限のある動画は取得できないことがあります。' },
      { q: '保存にアカウント登録は必要ですか？', a: 'いいえ。ClipKeep はアカウント登録なしで利用できます。' },
    ],
    linksHeading: '関連リンク',
    trendingLink: 'トレンド一覧を見る',
    home: 'ホーム',
    trending: 'トレンド',
  },
  en: {
    titleSuffix: ': how to save and download the videos',
    intro: (t) =>
      `Save and download videos related to the trending topic "${t}" with ClipKeep. Open any clip below to grab its download links.`,
    clipsHeading: 'Related clips',
    openClip: 'Open this video',
    stepsHeading: 'How to download',
    steps: [
      'Open the clip you want to save.',
      'Pick a quality or format to get the download link.',
      'Save the video to your device from the link.',
    ],
    faqHeading: 'FAQ',
    faq: (t) => [
      { q: `Can I download videos about "${t}"?`, a: 'If a video is public you can open its clip and get a download link. Private or region-locked videos may be unavailable.' },
      { q: 'Do I need an account to save videos?', a: 'No. ClipKeep works without any sign-up.' },
    ],
    linksHeading: 'Related links',
    trendingLink: 'Browse all trends',
    home: 'Home',
    trending: 'Trending',
  },
  pt: {
    titleSuffix: ': como salvar e baixar os vídeos',
    intro: (t) =>
      `Salve e baixe vídeos relacionados ao tema em alta "${t}" com o ClipKeep. Abra qualquer clipe abaixo para obter os links de download.`,
    clipsHeading: 'Clipes relacionados',
    openClip: 'Abrir este vídeo',
    stepsHeading: 'Como baixar',
    steps: [
      'Abra o clipe que deseja salvar.',
      'Escolha a qualidade ou o formato para obter o link.',
      'Salve o vídeo no seu dispositivo pelo link.',
    ],
    faqHeading: 'Perguntas frequentes',
    faq: (t) => [
      { q: `Posso baixar vídeos sobre "${t}"?`, a: 'Se o vídeo for público, abra o clipe e obtenha o link de download. Vídeos privados ou com bloqueio regional podem não estar disponíveis.' },
      { q: 'Preciso de conta para salvar vídeos?', a: 'Não. O ClipKeep funciona sem cadastro.' },
    ],
    linksHeading: 'Links relacionados',
    trendingLink: 'Ver todas as tendências',
    home: 'Início',
    trending: 'Tendências',
  },
  ar: {
    titleSuffix: ': كيفية حفظ وتنزيل مقاطع الفيديو',
    intro: (t) =>
      `احفظ ونزّل مقاطع الفيديو المتعلقة بالموضوع الرائج "${t}" باستخدام ClipKeep. افتح أي مقطع أدناه للحصول على روابط التنزيل.`,
    clipsHeading: 'مقاطع ذات صلة',
    openClip: 'فتح هذا الفيديو',
    stepsHeading: 'كيفية التنزيل',
    steps: [
      'افتح المقطع الذي تريد حفظه.',
      'اختر الجودة أو الصيغة للحصول على رابط التنزيل.',
      'احفظ الفيديو على جهازك من الرابط.',
    ],
    faqHeading: 'الأسئلة الشائعة',
    faq: (t) => [
      { q: `هل يمكنني تنزيل مقاطع عن "${t}"؟`, a: 'إذا كان الفيديو عامًا، افتح المقطع واحصل على رابط التنزيل. قد لا تتوفر مقاطع الفيديو الخاصة أو المقيدة جغرافيًا.' },
      { q: 'هل أحتاج إلى حساب لحفظ الفيديو؟', a: 'لا. يعمل ClipKeep بدون أي تسجيل.' },
    ],
    linksHeading: 'روابط ذات صلة',
    trendingLink: 'تصفّح كل الرائج',
    home: 'الرئيسية',
    trending: 'الرائج',
  },
};

function chromeFor(locale: Locale): Chrome {
  if (locale === 'ja' || locale === 'pt' || locale === 'ar') return CHROME[locale];
  return CHROME.en;
}

// Default to ja: the trend hub is ja-first (cron creates ja jobs from
// twittrend.jp). A ?locale= override still works for the other canonical locales.
function trendLocale(value: string | undefined): Locale {
  return value ? normalizeLocale(value) : 'ja';
}

function platformLabel(platform: string): string {
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}

function downloaderPath(platform: string): string {
  return `/download-${platform}-video`;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const locale = trendLocale(typeof sp.locale === 'string' ? sp.locale : undefined);

  const topic = await loadTopic(slug);
  // P0-4 §5.4: a manually-removed problem topic is gone — the page 404s, so emit
  // no indexable metadata for it.
  if (!topic || (await isSlugRemoved(slug))) return {};

  const c = chromeFor(locale);
  const path = `/trend/${slug}`;
  const title = `${topic.displayName}${c.titleSuffix}`;
  const description = c.intro(topic.displayName);

  // P0-3: indexability is gated. A topic is indexed only once it passes the
  // quality gate (MIN_CLIPS deduped public clips, within MAX_LIVE_TOPICS) — the
  // same gate that controls sitemap inclusion, so index ⇔ sitemap stay in sync.
  // Below the gate the page stays noindex (follow) to avoid thin auto pages.
  const live = await isSlugLive(slug);

  return {
    title: `${title} | ClipKeep`,
    description,
    alternates: buildLocaleAlternates(path, locale),
    robots: live
      ? undefined
      : { index: false, follow: true, googleBot: { index: false, follow: true } },
    openGraph: { title, description, url: getLocalizedUrl(path, locale), type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function TrendPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const locale = trendLocale(typeof sp.locale === 'string' ? sp.locale : undefined);

  const topic = await loadTopic(slug);
  // P0-4 §5.4 manual removal (事後対応路): a removed problem topic is taken down
  // entirely (404), not merely de-indexed — natural decay (STALE_AFTER) instead
  // keeps the page at 200 but drops it from sitemap/index via the live gate.
  if (!topic || (await isSlugRemoved(slug))) {
    notFound();
  }

  const c = chromeFor(locale);
  const dir = localeDir(locale);
  const path = `/trend/${slug}`;
  const url = getLocalizedUrl(path, locale);
  const title = `${topic.displayName}${c.titleSuffix}`;
  const description = c.intro(topic.displayName);
  const clips: TopicJob[] = topic.jobs;
  const faq = c.faq(topic.displayName);

  const localePath = (p: string) => (locale === 'en' ? p : `${p}?locale=${locale}`);
  const primaryPlatform = topic.platform;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: title,
        description,
        url,
      },
      {
        '@type': 'ItemList',
        itemListElement: clips.map((clip, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${getLocalizedUrl(`/result/${clip.jobId}`, locale)}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: c.home, item: getLocalizedUrl('/', locale) },
          { '@type': 'ListItem', position: 2, name: c.trending, item: getLocalizedUrl('/trending', locale) },
          { '@type': 'ListItem', position: 3, name: topic.displayName, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div dir={dir} className="max-w-4xl mx-auto p-4 sm:p-8">
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 dark:text-blue-400 mb-4">{title}</h1>
          <p className="text-gray-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">{description}</p>
        </header>

        <main className="space-y-12">
          {clips.length > 0 && (
            <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-6">{c.clipsHeading}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {clips.map((clip) => (
                  <li key={clip.jobId}>
                    {/* Real anchor so crawlers can follow into /result/[jobId] (orphan-avoidance, per 2026-06-17 lesson). */}
                    <a
                      href={localePath(`/result/${clip.jobId}`)}
                      className="block rounded-xl border border-gray-100 dark:border-slate-800 px-4 py-3 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                    >
                      <span className="block text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                        {platformLabel(clip.platform)}
                      </span>
                      <span className="block text-blue-700 dark:text-blue-300 font-medium">{c.openClip}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-6">{c.stepsHeading}</h2>
            <ol className="list-decimal ms-6 space-y-2 text-gray-600 dark:text-slate-300 leading-relaxed">
              {c.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-6">{c.faqHeading}</h2>
            <div className="space-y-6">
              {faq.map((item, idx) => (
                <div key={idx}>
                  <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-2">{item.q}</h3>
                  <p className="text-gray-600 dark:text-slate-300 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <nav aria-label={c.linksHeading} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-6">{c.linksHeading}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li>
                <a
                  href={localePath(downloaderPath(primaryPlatform))}
                  className="block rounded-xl border border-gray-100 dark:border-slate-800 px-4 py-3 text-blue-700 dark:text-blue-400 font-medium hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                >
                  {platformLabel(primaryPlatform)} Downloader
                </a>
              </li>
              <li>
                <a
                  href={localePath('/trending')}
                  className="block rounded-xl border border-gray-100 dark:border-slate-800 px-4 py-3 text-blue-700 dark:text-blue-400 font-medium hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                >
                  {c.trendingLink}
                </a>
              </li>
            </ul>
          </nav>
        </main>
      </div>
    </>
  );
}
