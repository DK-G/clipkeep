export type BlogLocale = 'en' | 'es' | 'ar';

export type KeywordCategory = 'twitter' | 'tiktok' | 'telegram' | 'comparison';

export type KeywordArticle = {
  slug: string;
  category: KeywordCategory;
  keyword: {
    en: string;
    es: string;
    ar: string;
  };
  toolPath: string;
  supportPath: string;
};

const baseArticles: Array<{
  slug: string;
  category: KeywordCategory;
  en: string;
  toolPath: string;
  supportPath: string;
}> = [
  { slug: 'how-to-download-twitter-videos', category: 'twitter', en: 'how to download twitter videos', toolPath: '/download-twitter-video', supportPath: '/solution/twitter-video-downloader-not-working' },
  { slug: 'twitter-video-downloader-online-free', category: 'twitter', en: 'twitter video downloader online free', toolPath: '/download-twitter-video', supportPath: '/solution/twitter-video-downloader-not-working' },
  { slug: 'twitter-video-download-iphone', category: 'twitter', en: 'twitter video download iphone', toolPath: '/download-twitter-video', supportPath: '/solution/twitter-video-downloader-not-working' },
  { slug: 'twitter-video-save-method-ja', category: 'twitter', en: 'twitter 動画 保存 方法', toolPath: '/download-twitter-video', supportPath: '/solution/twitter-video-downloader-not-working' },
  { slug: 'twitter-video-save-not-working-ja', category: 'twitter', en: 'twitter 動画 保存 できない', toolPath: '/download-twitter-video', supportPath: '/solution/twitter-video-downloader-not-working' },
  { slug: 'twitter-video-download-android', category: 'twitter', en: 'twitter video download android', toolPath: '/download-twitter-video', supportPath: '/solution/twitter-video-downloader-not-working' },
  { slug: 'twitter-gif-download', category: 'twitter', en: 'twitter gif download', toolPath: '/download-twitter-video', supportPath: '/solution/twitter-video-downloader-not-working' },
  { slug: 'twitter-video-downloader-safe', category: 'twitter', en: 'twitter video downloader safe', toolPath: '/download-twitter-video', supportPath: '/legal/privacy' },
  { slug: 'twitter-video-download-no-watermark', category: 'twitter', en: 'twitter video download no watermark', toolPath: '/download-twitter-video', supportPath: '/legal/terms' },
  { slug: 'twitter-video-download-mp4', category: 'twitter', en: 'twitter video download mp4', toolPath: '/download-twitter-video', supportPath: '/solution/twitter-video-downloader-not-working' },
  { slug: 'twitter-video-download-chrome', category: 'twitter', en: 'twitter video download chrome', toolPath: '/download-twitter-video', supportPath: '/solution/twitter-video-downloader-not-working' },
  { slug: 'twitter-save-visible-ja', category: 'twitter', en: 'twitter 保存 ばれる？', toolPath: '/download-twitter-video', supportPath: '/legal/privacy' },
  { slug: 'twitter-video-download-private-account', category: 'twitter', en: 'twitter video download private account', toolPath: '/download-twitter-video', supportPath: '/legal/terms' },
  { slug: 'twitter-video-download-without-login', category: 'twitter', en: 'twitter video download without login', toolPath: '/download-twitter-video', supportPath: '/legal/terms' },
  { slug: 'twitter-video-downloader-2026', category: 'twitter', en: 'twitter video downloader 2026', toolPath: '/download-twitter-video', supportPath: '/twitter-trending-videos' },
  { slug: 'tiktok-video-download-no-watermark', category: 'tiktok', en: 'tiktok video download no watermark', toolPath: '/download-tiktok-video', supportPath: '/solution/extractor-temporary-limited' },
  { slug: 'tiktok-downloader-without-watermark-online', category: 'tiktok', en: 'tiktok downloader without watermark online', toolPath: '/download-tiktok-video', supportPath: '/solution/extractor-temporary-limited' },
  { slug: 'tiktok-video-save-method-ja', category: 'tiktok', en: 'tiktok 動画 保存 方法', toolPath: '/download-tiktok-video', supportPath: '/solution/extractor-temporary-limited' },
  { slug: 'tiktok-video-save-not-working-ja', category: 'tiktok', en: 'tiktok 動画 保存 できない', toolPath: '/download-tiktok-video', supportPath: '/solution/extractor-temporary-limited' },
  { slug: 'download-tiktok-video-hd', category: 'tiktok', en: 'download tiktok video hd', toolPath: '/download-tiktok-video', supportPath: '/solution/extractor-temporary-limited' },
  { slug: 'tiktok-download-mp4', category: 'tiktok', en: 'tiktok download mp4', toolPath: '/download-tiktok-video', supportPath: '/solution/extractor-temporary-limited' },
  { slug: 'save-tiktok-video-iphone', category: 'tiktok', en: 'save tiktok video iphone', toolPath: '/download-tiktok-video', supportPath: '/solution/extractor-temporary-limited' },
  { slug: 'tiktok-video-download-android', category: 'tiktok', en: 'tiktok video download android', toolPath: '/download-tiktok-video', supportPath: '/solution/extractor-temporary-limited' },
  { slug: 'tiktok-downloader-safe', category: 'tiktok', en: 'tiktok downloader safe', toolPath: '/download-tiktok-video', supportPath: '/legal/privacy' },
  { slug: 'tiktok-video-downloader-free', category: 'tiktok', en: 'tiktok video downloader free', toolPath: '/download-tiktok-video', supportPath: '/tiktok-trending-videos' },
  { slug: 'tiktok-video-download-private', category: 'tiktok', en: 'tiktok video download private', toolPath: '/download-tiktok-video', supportPath: '/legal/terms' },
  { slug: 'tiktok-save-visible-ja', category: 'tiktok', en: 'tiktok 保存 バレる？', toolPath: '/download-tiktok-video', supportPath: '/legal/privacy' },
  { slug: 'how-to-save-tiktok-without-watermark', category: 'tiktok', en: 'how to save tiktok without watermark', toolPath: '/download-tiktok-video', supportPath: '/solution/extractor-temporary-limited' },
  { slug: 'tiktok-video-downloader-2026', category: 'tiktok', en: 'tiktok video downloader 2026', toolPath: '/download-tiktok-video', supportPath: '/tiktok-trending-videos' },
  { slug: 'tiktok-video-link-download', category: 'tiktok', en: 'tiktok video link download', toolPath: '/download-tiktok-video', supportPath: '/solution/extractor-temporary-limited' },
  { slug: 'telegram-video-download', category: 'telegram', en: 'telegram video download', toolPath: '/download-telegram-video', supportPath: '/solution/telegram-video-downloader-not-working' },
  { slug: 'telegram-video-downloader-online', category: 'telegram', en: 'telegram video downloader online', toolPath: '/download-telegram-video', supportPath: '/solution/telegram-video-downloader-not-working' },
  { slug: 'telegram-video-save-method-ja', category: 'telegram', en: 'telegram 動画 保存 方法', toolPath: '/download-telegram-video', supportPath: '/solution/telegram-video-downloader-not-working' },
  { slug: 'telegram-video-download-pc-ja', category: 'telegram', en: 'telegram 動画 ダウンロード pc', toolPath: '/download-telegram-video', supportPath: '/solution/telegram-video-downloader-not-working' },
  { slug: 'telegram-video-download-iphone', category: 'telegram', en: 'telegram video download iphone', toolPath: '/download-telegram-video', supportPath: '/solution/telegram-video-downloader-not-working' },
  { slug: 'telegram-video-download-android', category: 'telegram', en: 'telegram video download android', toolPath: '/download-telegram-video', supportPath: '/solution/telegram-video-downloader-not-working' },
  { slug: 'telegram-private-video-download', category: 'telegram', en: 'telegram private video download', toolPath: '/download-telegram-video', supportPath: '/legal/terms' },
  { slug: 'telegram-video-download-link', category: 'telegram', en: 'telegram video download link', toolPath: '/download-telegram-video', supportPath: '/solution/telegram-video-downloader-not-working' },
  { slug: 'telegram-save-visible-ja', category: 'telegram', en: 'telegram 保存 バレる？', toolPath: '/download-telegram-video', supportPath: '/legal/privacy' },
  { slug: 'telegram-video-download-bot-safe', category: 'telegram', en: 'telegram video download bot safe', toolPath: '/download-telegram-video', supportPath: '/legal/privacy' },
  { slug: 'best-twitter-video-downloader-2026', category: 'comparison', en: 'best twitter video downloader 2026', toolPath: '/download-twitter-video', supportPath: '/twitter-trending-videos' },
  { slug: 'best-tiktok-downloader-without-watermark', category: 'comparison', en: 'best tiktok downloader without watermark', toolPath: '/download-tiktok-video', supportPath: '/tiktok-trending-videos' },
  { slug: 'safest-video-downloader-sites', category: 'comparison', en: 'safest video downloader sites', toolPath: '/download-twitter-video', supportPath: '/legal/privacy' },
  { slug: 'twitter-video-downloader-not-working', category: 'comparison', en: 'twitter video downloader not working', toolPath: '/download-twitter-video', supportPath: '/solution/twitter-video-downloader-not-working' },
  { slug: 'tiktok-downloader-not-working', category: 'comparison', en: 'tiktok downloader not working', toolPath: '/download-tiktok-video', supportPath: '/solution/extractor-temporary-limited' },
  { slug: 'telegram-video-download-not-working', category: 'comparison', en: 'telegram video download not working', toolPath: '/download-telegram-video', supportPath: '/solution/telegram-video-downloader-not-working' },
  { slug: 'is-video-downloader-legal', category: 'comparison', en: 'is video downloader legal', toolPath: '/legal/terms', supportPath: '/legal/dmca' },
  { slug: 'video-downloader-safe-or-not', category: 'comparison', en: 'video downloader safe or not', toolPath: '/legal/privacy', supportPath: '/status' },
  { slug: 'free-video-downloader-online-comparison', category: 'comparison', en: 'free video downloader online comparison', toolPath: '/download-twitter-video', supportPath: '/faq' },
  { slug: 'top-5-video-downloader-tools', category: 'comparison', en: 'top 5 video downloader tools', toolPath: '/download-twitter-video', supportPath: '/faq' },
];

function localizeKeyword(keywordEn: string, locale: BlogLocale): string {
  if (locale === 'en') return keywordEn;

  const mapEs: Array<[RegExp, string]> = [
    [/video downloader/gi, 'descargador de videos'],
    [/video download/gi, 'descargar video'],
    [/download/gi, 'descargar'],
    [/how to/gi, 'como'],
    [/without/gi, 'sin'],
    [/safe/gi, 'seguro'],
    [/not working/gi, 'no funciona'],
    [/private account/gi, 'cuenta privada'],
    [/without login/gi, 'sin iniciar sesion'],
    [/best/gi, 'mejor'],
    [/comparison/gi, 'comparacion'],
    [/link/gi, 'enlace'],
    [/twitter/gi, 'twitter'],
    [/tiktok/gi, 'tiktok'],
    [/telegram/gi, 'telegram'],
  ];

  const mapAr: Array<[RegExp, string]> = [
    [/video downloader/gi, 'تنزيل الفيديو'],
    [/video download/gi, 'تنزيل فيديو'],
    [/download/gi, 'تنزيل'],
    [/how to/gi, 'كيفية'],
    [/without/gi, 'بدون'],
    [/safe/gi, 'آمن'],
    [/not working/gi, 'لا يعمل'],
    [/private account/gi, 'حساب خاص'],
    [/without login/gi, 'بدون تسجيل دخول'],
    [/best/gi, 'أفضل'],
    [/comparison/gi, 'مقارنة'],
    [/link/gi, 'رابط'],
    [/twitter/gi, 'تويتر'],
    [/tiktok/gi, 'تيك توك'],
    [/telegram/gi, 'تيليجرام'],
  ];

  let out = keywordEn;
  const mapper = locale === 'es' ? mapEs : mapAr;
  for (const [p, r] of mapper) out = out.replace(p, r);
  return out;
}

export const keywordArticles: KeywordArticle[] = baseArticles.map((a) => ({
  slug: a.slug,
  category: a.category,
  keyword: {
    en: a.en,
    es: localizeKeyword(a.en, 'es'),
    ar: localizeKeyword(a.en, 'ar'),
  },
  toolPath: a.toolPath,
  supportPath: a.supportPath,
}));

export function getKeywordArticle(slug: string): KeywordArticle | undefined {
  return keywordArticles.find((a) => a.slug === slug);
}

export function getRelatedKeywordArticles(slug: string, category: KeywordCategory, limit = 3): KeywordArticle[] {
  return keywordArticles.filter((a) => a.category === category && a.slug !== slug).slice(0, limit);
}