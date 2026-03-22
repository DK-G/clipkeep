import { Locale } from './ui';

export type DiscoveryDict = {
  trendingX: string;
  latestX: string;
  trendingTikTok: string;
  latestTikTok: string;
  trendingInstagram: string;
  latestInstagram: string;
  trendingTelegram: string;
  latestTelegram: string;
};

export const discoveryText: Record<Locale, DiscoveryDict> = {
  en: {
    trendingX: "Trending on X (Twitter)",
    latestX: "Latest from X (Twitter)",
    trendingTikTok: "Popular on TikTok",
    latestTikTok: "Newest TikTok Clips",
    trendingInstagram: "Trending on Instagram",
    latestInstagram: "Latest Instagram Media",
    trendingTelegram: "Popular on Telegram",
    latestTelegram: "Recent Telegram Shares"
  },
  ar: {
    trendingX: "الرائج على X (تويتر)",
    latestX: "أحدث من X (تويتر)",
    trendingTikTok: "شائع على TikTok",
    latestTikTok: "أحدث مقاطع TikTok",
    trendingInstagram: "شائع على Instagram",
    latestInstagram: "أحدث صور Instagram",
    trendingTelegram: "شائع على Telegram",
    latestTelegram: "مشاركات Telegram الأخيرة"
  },
  ja: {
    trendingX: "X (Twitter) のトレンド",
    latestX: "X (Twitter) の最新",
    trendingTikTok: "TikTok で人気",
    latestTikTok: "最新の TikTok 動画",
    trendingInstagram: "Instagram のトレンド",
    latestInstagram: "最新の Instagram 投稿",
    trendingTelegram: "Telegram で人気",
    latestTelegram: "最近の Telegram 共有"
  },
  es: {
    trendingX: "Tendencias en X (Twitter)",
    latestX: "Lo último de X (Twitter)",
    trendingTikTok: "Popular en TikTok",
    latestTikTok: "Clips más nuevos de TikTok",
    trendingInstagram: "Tendencias en Instagram",
    latestInstagram: "Lo último de Instagram",
    trendingTelegram: "Popular en Telegram",
    latestTelegram: "Compartidos recientes de Telegram"
  },
  pt: {
    trendingX: "Tendências no X (Twitter)",
    latestX: "Mais recentes do X (Twitter)",
    trendingTikTok: "Popular no TikTok",
    latestTikTok: "Vídeos novos do TikTok",
    trendingInstagram: "Tendências no Instagram",
    latestInstagram: "Mais recentes do Instagram",
    trendingTelegram: "Popular no Telegram",
    latestTelegram: "Partilhas recentes do Telegram"
  },
  fr: {
    trendingX: "Tendances sur X (Twitter)",
    latestX: "Derniers de X (Twitter)",
    trendingTikTok: "Populaire sur TikTok",
    latestTikTok: "Nouveaux clips TikTok",
    trendingInstagram: "Tendances sur Instagram",
    latestInstagram: "Derniers médias Instagram",
    trendingTelegram: "Populaire sur Telegram",
    latestTelegram: "Partages Telegram récents"
  },
  id: {
    trendingX: "Populer di X (Twitter)",
    latestX: "Terbaru dari X (Twitter)",
    trendingTikTok: "Populer di TikTok",
    latestTikTok: "Klip TikTok Terbaru",
    trendingInstagram: "Populer di Instagram",
    latestInstagram: "Media Instagram Terbaru",
    trendingTelegram: "Populer di Telegram",
    latestTelegram: "Berbagi Telegram Terbaru"
  },
  hi: {
    trendingX: "X (Twitter) पर ट्रेंडिंग",
    latestX: "X (Twitter) से नवीनतम",
    trendingTikTok: "TikTok पर लोकप्रिय",
    latestTikTok: "नये TikTok क्लिप",
    trendingInstagram: "Instagram पर ट्रेंडिंग",
    latestInstagram: "नवीनतम Instagram मीडिया",
    trendingTelegram: "Telegram पर लोकप्रिय",
    latestTelegram: "हालिया Telegram शेयर"
  },
  de: {
    trendingX: "Trendet auf X (Twitter)",
    latestX: "Neuestes von X (Twitter)",
    trendingTikTok: "Beliebt auf TikTok",
    latestTikTok: "Neueste TikTok-Clips",
    trendingInstagram: "Trendet auf Instagram",
    latestInstagram: "Neueste Instagram-Medien",
    trendingTelegram: "Beliebt auf Telegram",
    latestTelegram: "Aktuelle Telegram-Beiträge"
  },
  tr: {
    trendingX: "X (Twitter) Üzerinde Trend",
    latestX: "X (Twitter) Son Paylaşımlar",
    trendingTikTok: "TikTok Üzerinde Popüler",
    latestTikTok: "En Yeni TikTok Klipleri",
    trendingInstagram: "Instagram Üzerinde Trend",
    latestInstagram: "En Yeni Instagram İçerikleri",
    trendingTelegram: "Telegram Üzerinde Popüler",
    latestTelegram: "Son Telegram Paylaşımları"
  }
};
