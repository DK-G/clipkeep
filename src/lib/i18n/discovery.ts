import { Locale } from './ui';

export type DiscoveryDict = {
  trendingX: string;
  latestX: string;
  trendingTikTok: string;
  latestTikTok: string;
  trendingTelegram: string;
  latestTelegram: string;
  globalTrending: string;
};

export const discoveryText: Record<Locale, DiscoveryDict> = {
  en: {
    trendingX: "Trending on X (Twitter)",
    latestX: "Latest from X (Twitter)",
    trendingTikTok: "Popular on TikTok",
    latestTikTok: "Newest TikTok Clips",
    trendingTelegram: "Popular on Telegram",
    latestTelegram: "Recent Telegram Shares",
    globalTrending: "Global Trending Hub"
  },
  ar: {
    trendingX: "الرائج على X (تويتر)",
    latestX: "أحدث من X (تويتر)",
    trendingTikTok: "شائع على TikTok",
    latestTikTok: "أحدث مقاطع TikTok",
    trendingTelegram: "شائع على Telegram",
    latestTelegram: "مشاركات Telegram الأخيرة",
    globalTrending: "مركز الترند العالمي"
  },
  ja: {
    trendingX: "X (Twitter) のトレンド",
    latestX: "X (Twitter) の最新",
    trendingTikTok: "TikTok で人気",
    latestTikTok: "最新の TikTok 動画",
    trendingTelegram: "Telegram で人気",
    latestTelegram: "最近の Telegram 共有",
    globalTrending: "グローバルトレンドハブ"
  },
  es: {
    trendingX: "Tendencias en X (Twitter)",
    latestX: "Lo último de X (Twitter)",
    trendingTikTok: "Popular en TikTok",
    latestTikTok: "Clips más nuevos de TikTok",
    trendingTelegram: "Popular en Telegram",
    latestTelegram: "Compartidos recientes de Telegram",
    globalTrending: "Hub de Tendencias Globales"
  },
  pt: {
    trendingX: "Tendências no X (Twitter)",
    latestX: "Mais recentes do X (Twitter)",
    trendingTikTok: "Popular no TikTok",
    latestTikTok: "Vídeos novos do TikTok",
    trendingTelegram: "Popular no Telegram",
    latestTelegram: "Partilhas recentes do Telegram",
    globalTrending: "Hub de Tendências Globais"
  },
  fr: {
    trendingX: "Tendances sur X (Twitter)",
    latestX: "Derniers de X (Twitter)",
    trendingTikTok: "Populaire sur TikTok",
    latestTikTok: "Nouveaux clips TikTok",
    trendingTelegram: "Populaire sur Telegram",
    latestTelegram: "Partages Telegram récents",
    globalTrending: "Hub des Tendances Mondiales"
  },
  id: {
    trendingX: "Populer di X (Twitter)",
    latestX: "Terbaru dari X (Twitter)",
    trendingTikTok: "Populer di TikTok",
    latestTikTok: "Klip TikTok Terbaru",
    trendingTelegram: "Populer di Telegram",
    latestTelegram: "Berbagi Telegram Terbaru",
    globalTrending: "Hub Tren Global"
  },
  hi: {
    trendingX: "X (Twitter) पर ट्रेंडिंग",
    latestX: "X (Twitter) से नवीनतम",
    trendingTikTok: "TikTok पर लोकप्रिय",
    latestTikTok: "नये TikTok क्लिप",
    trendingTelegram: "Telegram पर लोकप्रिय",
    latestTelegram: "हालिया Telegram शेयर",
    globalTrending: "ग्लोबल ट्रेंडिंग हब"
  },
  de: {
    trendingX: "Trendet auf X (Twitter)",
    latestX: "Neuestes von X (Twitter)",
    trendingTikTok: "Beliebt auf TikTok",
    latestTikTok: "Neueste TikTok-Clips",
    trendingTelegram: "Beliebt auf Telegram",
    latestTelegram: "Aktuelle Telegram-Beiträge",
    globalTrending: "Globaler Trend-Hub"
  },
  tr: {
    trendingX: "X (Twitter) Üzerinde Trend",
    latestX: "X (Twitter) Son Paylaşımlar",
    trendingTikTok: "TikTok Üzerinde Popüler",
    latestTikTok: "En Yeni TikTok Klipleri",
    trendingTelegram: "Telegram Üzerinde Popüler",
    latestTelegram: "Son Telegram Paylaşımları",
    globalTrending: "Küresel Trend Merkezi"
  }
};

