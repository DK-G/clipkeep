import type { Metadata } from 'next';
import { menuText, normalizeLocale } from '@/lib/i18n/ui';
import { DiscoverySection } from '@/components/discovery-section';
import { GallerySection } from '@/components/gallery-section';
import { HistorySection } from '@/components/history-section';
import { ExtractorForm } from '@/components/extractor-form';
import { TrendingHubSection } from '@/components/trending-hub-section';
import { SITE_URL } from '@/lib/site-url';
import Link from 'next/link';
import {
  TiktokIcon, TwitterXIcon, TelegramIcon, RedditIcon,
  FacebookIcon, PinterestIcon, ThreadsIcon, BlueskyIcon,
  BilibiliIcon, DiscordIcon, Lemon8Icon,
} from '@/components/platform-icons';
import { LiveStatsTicker } from '@/components/analytics/live-stats-ticker';

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const faqDict: Record<string, { q1: string; a1: string; q2: string; a2: string }> = {
  en: {
    q1: 'What is ClipKeep?',
    a1: 'ClipKeep is an all-in-one hub for saving videos and media from major social platforms like TikTok, X (Twitter), and Reddit.',
    q2: 'Is it free to use?',
    a2: 'Yes, all extraction tools on ClipKeep are free to use.',
  },
  ja: {
    q1: 'ClipKeepとは何ですか？',
    a1: 'ClipKeepは、TikTok、X(Twitter)、Redditなどの主要なSNSから動画やメディアを保存するためのオールインワンハブです。',
    q2: '無料で利用できますか？',
    a2: 'はい、ClipKeepのすべての抽出ツールは無料でご利用いただけます。',
  },
  ar: {
    q1: 'ما هو ClipKeep؟',
    a1: 'هو مركز شامل لحفظ مقاطع الفيديو والوسائط من منصات التواصل الاجتماعي الكبرى مثل TikTok وX (تويتر) وReddit.',
    q2: 'هل الاستخدام مجاني؟',
    a2: 'نعم، جميع أدوات الاستخراج في ClipKeep مجانية تماماً.',
  },
  es: {
    q1: '¿Qué es ClipKeep?',
    a1: 'Es un centro integral para guardar videos y medios de las principales plataformas sociales como TikTok, X (Twitter) y Reddit.',
    q2: '¿Es de uso gratuito?',
    a2: 'Sí, todas las herramientas de extracción de ClipKeep son gratuitas.',
  },
  pt: {
    q1: 'O que é o ClipKeep?',
    a1: 'É um hub central para salvar vídeos e mídias das principais redes sociais como TikTok, X (Twitter) e Reddit.',
    q2: 'É gratuito?',
    a2: 'Sim, todas as ferramentas de extração do ClipKeep são gratuitas.',
  },
  fr: {
    q1: "Qu'est-ce que ClipKeep ?",
    a1: "C'est une plateforme tout-en-un pour sauvegarder des vidéos et des médias depuis les principaux réseaux sociaux comme TikTok, X (Twitter) et Reddit.",
    q2: 'Est-ce gratuit ?',
    a2: "Oui, tous les outils d'extraction sur ClipKeep sont gratuits.",
  },
  id: {
    q1: 'Apa itu ClipKeep?',
    a1: 'ClipKeep adalah pusat lengkap untuk menyimpan video dan media dari platform sosial utama seperti TikTok, X (Twitter), dan Reddit.',
    q2: 'Apakah gratis?',
    a2: 'Ya, semua alat ekstraksi di ClipKeep gratis digunakan.',
  },
  hi: {
    q1: 'क्लिपकीप (ClipKeep) क्या है?',
    a1: 'क्लिपकीप टिकटॉक, एक्स (ट्विटर) और रेडिट जैसे प्रमुख सोशल प्लेटफॉर्म से वीडियो और मीडिया को सहेजने के लिए एक ऑल-इन-वन हब है।',
    q2: 'क्या यह मुफ़्त है?',
    a2: 'हाँ, क्लिपकीप पर सभी एक्सट्रैक्शन टूल मुफ़्त हैं।',
  },
  de: {
    q1: 'Was ist ClipKeep?',
    a1: 'ClipKeep ist der All-in-One-Hub zum Speichern von Videos und Medien von großen sozialen Plattformen wie TikTok, X (Twitter) und Reddit.',
    q2: 'Ist die Nutzung kostenlos?',
    a2: 'Ja, alle Extraktions-Tools auf ClipKeep sind kostenlos.',
  },
  tr: {
    q1: 'ClipKeep nedir?',
    a1: 'ClipKeep, TikTok, X (Twitter) ve Reddit gibi platformlardan medya kaydetmek için hepsi bir arada bir merkezdir.',
    q2: 'Ücretsiz mi?',
    a2: "Evet, ClipKeep'teki tüm araçlar tamamen ücretsizdir.",
  },
};

export async function generateMetadata({ searchParams }: HomeProps): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const base = SITE_URL;
  const url = `${base}/${locale !== 'en' ? `?locale=${locale}` : ''}`;

  const meta: Record<string, { title: string; description: string }> = {
    en: {
      title: 'SNS Video Downloader Hub - No Watermark (TikTok, X, Reddit)',
      description: 'ClipKeep is the ultimate hub to download videos without watermark from TikTok, X (Twitter), Reddit, and 10+ platforms. Fast, free, and high quality MP4 extraction.',
    },
    ja: {
      title: 'SNS動画保存ハブ - ロゴなしダウンロード (TikTok, X, Reddit)',
      description: 'ClipKeepは、TikTok、X (Twitter)、Redditなど10以上のプラットフォームからロゴなしで動画を保存できるプレミアムハブです。高速・無料・高品質な抽出。',
    },
    ar: {
      title: 'مركز تنزيل فيديوهات SNS - بدون علامة مائية (تيك توك، إكس، ريديت)',
      description: 'ClipKeep هو المركز النهائي لتنزيل مقاطع الفيديو بدون علامة مائية من TikTok وX (تويتر) وReddit وأكثر من 10 منصات. استخراج MP4 سريع ومجاني وعالي الجودة.',
    },
    es: {
      title: 'Descargar Videos SNS Sin Marca de Agua - Gratis (TikTok, X, Reddit)',
      description: 'ClipKeep es el centro ideal para descargar videos sin marca de agua de TikTok, X (Twitter), Reddit y más de 10 plataformas. Extracción MP4 rápida, gratis y en alta calidad.',
    },
    pt: {
      title: 'Baixar Vídeos SNS Sem Marca d\'Água - Grátis (TikTok, X, Reddit)',
      description: 'ClipKeep é o hub definitivo para baixar vídeos sem marca d\'água do TikTok, X (Twitter), Reddit e mais de 10 plataformas. Extração MP4 rápida, grátis e em alta qualidade.',
    },
    fr: {
      title: 'Télécharger Vidéo SNS Sans Filigrane - Gratuit (TikTok, X, Reddit)',
      description: 'ClipKeep est le hub ultime pour télécharger des vidéos sans filigrane de TikTok, X (Twitter), Reddit et plus de 10 plateformes. Extraction MP4 rapide, gratuite et de haute qualité.',
    },
    id: {
      title: 'Download Video SNS Tanpa Watermark - Gratis (TikTok, X, Reddit)',
      description: 'ClipKeep adalah pusat utama untuk download video tanpa watermark dari TikTok, X (Twitter), Reddit, dan 10+ platform. Ekstraksi MP4 cepat, gratis, dan berkualitas tinggi.',
    },
    hi: {
      title: 'SNS वीडियो डाउनलोडर - बिना वॉटरमार्क (टिकटॉक, एक्स, रेडिट)',
      description: 'ClipKeep टिकटॉक, एक्स (ट्विटर), रेडिट और 10+ प्लेटफार्मों से बिना वॉटरमार्क के वीडियो डाउनलोड करने का सबसे अच्छा हब है। तेज़, मुफ्त और उच्च गुणवत्ता वाला MP4 एक्सट्रैक्शन।',
    },
    de: {
      title: 'SNS Video Downloader - Ohne Wasserzeichen (TikTok, X, Reddit)',
      description: 'ClipKeep ist der ultimative Hub zum Herunterladen von Videos ohne Wasserzeichen von TikTok, X (Twitter), Reddit und über 10 Plattformen. Schnelle, kostenlose und hochwertige MP4-Extraktion.',
    },
    tr: {
      title: 'SNS Video İndirici - Filigransız (TikTok, X, Reddit)',
      description: 'ClipKeep; TikTok, X (Twitter), Reddit ve 10\'dan fazla platformdan filigransız video indirmek için en iyi merkezdir. Hızlı, ücretsiz ve yüksek kaliteli MP4 çıkarma.',
    }
  };

  const m = meta[locale] || meta.en;

  return {
    title: m.title,
    description: m.description,
    alternates: {
      languages: {
        'en': `${base}/`,
        'ja': `${base}/?locale=ja`,
        'ar': `${base}/?locale=ar`,
        'es': `${base}/?locale=es`,
        'pt': `${base}/?locale=pt`,
        'fr': `${base}/?locale=fr`,
        'id': `${base}/?locale=id`,
        'hi': `${base}/?locale=hi`,
        'de': `${base}/?locale=de`,
        'tr': `${base}/?locale=tr`,
      },
      canonical: url,
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: url,
      siteName: 'ClipKeep',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
    },
  };
}

const supportedPlatforms = [
  'Bilibili',
  'Bluesky',
  'Discord',
  'Facebook',
  'Lemon8',
  'Pinterest',
  'Reddit',
  'Telegram',
  'Threads',
  'TikTok',
  'Twitter',
];

const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: "SNS Downloader (No Watermark)",
    subtitle: "The premium hub for high-quality MP4 archives. No watermark, no login, 100% free. Works with TikTok, X, Reddit and more.",
    weeklyTrending: "Weekly Trending",
    recentDownloads: "Recent Downloads",
    startDownloading: "Start Extracting Now",
    bilibili: "Bilibili",
    bluesky: "Bluesky",
    discord: "Discord",
    facebook: "Facebook",
    lemon8: "Lemon8",
    pinterest: "Pinterest",
    reddit: "Reddit",
    telegram: "Telegram",
    threads: "Threads",
    tiktok: "TikTok",
    twitter: "Twitter (X)",
    notes: "Platform Stability Notes",
    noteBody: "We constantly update our extractors to match platform changes. Most extractions take less than 10 seconds.",
    globalTrending: "Global Trending Hub",
    globalTrendingSubtitle: "Discover popular clips across all platforms.",
    recentDownloadsSubtitle: "Explore the latest media successfully cached by our users worldwide.",
    viewAllLatest: "View All Latest",
    guidesTitle: "Ultimate Guides 2026",
    guide2026: "2026 Guide"
  },
  ja: {
    welcome: "SNS動画保存ハブ (ロゴなし)",
    subtitle: "オフライン保存のためのプレミアムハブ。ロゴなし・ログイン不要・完全無料。TikTok、X (Twitter)、Redditなどから高品質なMP4を抽出。",
    weeklyTrending: "週間トレンド",
    recentDownloads: "最近のダウンロード",
    startDownloading: "今すぐ保存を開始",
    bilibili: "Bilibili",
    bluesky: "Bluesky",
    discord: "Discord",
    facebook: "Facebook",
    lemon8: "Lemon8",
    pinterest: "Pinterest",
    reddit: "Reddit",
    telegram: "Telegram",
    threads: "Threads",
    tiktok: "TikTok",
    twitter: "Twitter (X)",
    notes: "安定性について",
    noteBody: "プラットフォームの仕様変更に合わせて常に更新しています。ほとんどの抽出は10秒以内に完了します。",
    globalTrending: "グローバルトレンドハブ",
    globalTrendingSubtitle: "すべてのプラットフォームから人気のクリップを公開。",
    recentDownloadsSubtitle: "ユーザーにより直近で正常に保存されたメディアをまとめて確認できます。",
    viewAllLatest: "最新一覧を見る",
    guidesTitle: "2026年最新ガイド",
    guide2026: "2026年版"
  },
  ar: {
    welcome: "محمل فيديوهات SNS (بدون علامة مائية)",
    subtitle: "المركز المتميز للأرشفة بجودة عالية MP4. بدون علامة مائية، بدون تسجيل دخول، مجاني 100%. يدعم تيك توك، X، ريديت وأكثر.",
    weeklyTrending: "الأكثر رواجًا لهذا الأسبوع",
    recentDownloads: "أحدث التنزيلات",
    startDownloading: "ابدأ الاستخراج الآن",
    bilibili: "Bilibili",
    bluesky: "Bluesky",
    discord: "Discord",
    facebook: "Facebook",
    lemon8: "Lemon8",
    pinterest: "Pinterest",
    reddit: "Reddit",
    telegram: "Telegram",
    threads: "Threads",
    tiktok: "TikTok",
    twitter: "Twitter (X)",
    notes: "ملاحظات استقرار المنصة",
    noteBody: "نحن نقوم باستمرار بتحديث المستخرجات الخاصة بنا لتناسب تغييرات المنصة। تستغرق معظم عمليات الاستخراج أقل من 10 ثوانٍ।",
    globalTrending: "مركز الترند العالمي",
    globalTrendingSubtitle: "اكتشف المقاطع الشائعة عبر جميع المنصات.",
    recentDownloadsSubtitle: "استعرض أحدث الوسائط التي تم حفظها بنجاح بواسطة المستخدمين.",
    viewAllLatest: "عرض أحدث العناصر",
    guidesTitle: "أدلة 2026 الشاملة",
    guide2026: "دليل 2026"
  },
  es: {
    welcome: "Descargar Videos SNS (Sin Marca de Agua)",
    subtitle: "El centro premium para archivos MP4 de alta calidad. Sin marca de agua, sin login, 100% gratis. Funciona con TikTok, X, Reddit y más.",
    weeklyTrending: "Tendencias Semanales",
    recentDownloads: "Descargas Recientes",
    startDownloading: "Comenzar Extracción",
    bilibili: "Bilibili",
    bluesky: "Bluesky",
    discord: "Discord",
    facebook: "Facebook",
    lemon8: "Lemon8",
    pinterest: "Pinterest",
    reddit: "Reddit",
    telegram: "Telegram",
    threads: "Threads",
    tiktok: "TikTok",
    twitter: "Twitter (X)",
    notes: "Notas de Estabilidad",
    noteBody: "Actualizamos constantemente nuestros extractores। La mayoría de las extracciones tardan menos de 10 segundos।",
    globalTrending: "Hub de tendencias globales",
    globalTrendingSubtitle: "Descubre clips populares en todas las plataformas.",
    recentDownloadsSubtitle: "Explora los medios guardados recientemente por nuestros usuarios en todo el mundo.",
    viewAllLatest: "Ver todo lo reciente",
    guidesTitle: "Guías Definitivas 2026",
    guide2026: "Guía 2026"
  },
  pt: {
    welcome: "Baixar Vídeos SNS (Sem Marca d'Água)",
    subtitle: "O hub premium para arquivos MP4 de alta qualidade. Sem marca d'água, sem login, 100% grátis. Funciona com TikTok, X, Reddit e muito mais.",
    weeklyTrending: "Tendências Semanais",
    recentDownloads: "Downloads Recentes",
    startDownloading: "Começar Extração",
    bilibili: "Bilibili",
    bluesky: "Bluesky",
    discord: "Discord",
    facebook: "Facebook",
    lemon8: "Lemon8",
    pinterest: "Pinterest",
    reddit: "Reddit",
    telegram: "Telegram",
    threads: "Threads",
    tiktok: "TikTok",
    twitter: "Twitter (X)",
    notes: "Notas de Estabilidade",
    noteBody: "Atualizamos constantemente nossos extratores। A maioria das extrações leva menos de 10 segundos।",
    globalTrending: "Hub de tendências globais",
    globalTrendingSubtitle: "Descubra clipes populares em todas as plataformas.",
    recentDownloadsSubtitle: "Explore as mídias salvas recentemente por usuários do mundo todo.",
    viewAllLatest: "Ver tudo em latest",
    guidesTitle: "Guias Definitivos 2026",
    guide2026: "Guia 2026"
  },
  fr: {
    welcome: "Télécharger Vidéo (Sans Filigrane)",
    subtitle: "Le hub premium pour des archives MP4 de haute qualité. Sans filigrane, sans connexion, 100% gratuit.",
    weeklyTrending: "Tendances Hebdomadaires",
    recentDownloads: "Téléchargements Récents",
    startDownloading: "Démarrer l'Extraction",
    bilibili: "Bilibili",
    bluesky: "Bluesky",
    discord: "Discord",
    facebook: "Facebook",
    lemon8: "Lemon8",
    pinterest: "Pinterest",
    reddit: "Reddit",
    telegram: "Telegram",
    threads: "Threads",
    tiktok: "TikTok",
    twitter: "Twitter (X)",
    notes: "Notes sur la Stabilité",
    noteBody: "Nous mettons à jour nos extracteurs régulièrement। La plupart des extractions prennent moins de 10 secondes。",
    globalTrending: "Hub des tendances mondiales",
    globalTrendingSubtitle: "Découvrez les clips populaires sur toutes les plateformes.",
    recentDownloadsSubtitle: "Explorez les médias récemment sauvegardés par nos utilisateurs dans le monde.",
    viewAllLatest: "Voir tout dans Latest",
    guidesTitle: "Guides Ultimes 2026",
    guide2026: "Guide 2026"
  },
  id: {
    welcome: "Download Video (Tanpa Watermark)",
    subtitle: "Pusat premium untuk arsip MP4 berkualitas tinggi. Tanpa watermark, tanpa login, 100% gratis.",
    weeklyTrending: "Tren Mingguan",
    recentDownloads: "Unduhan Terbaru",
    startDownloading: "Mulai Ekstraksi Sekarang",
    bilibili: "Bilibili",
    bluesky: "Bluesky",
    discord: "Discord",
    facebook: "Facebook",
    lemon8: "Lemon8",
    pinterest: "Pinterest",
    reddit: "Reddit",
    telegram: "Telegram",
    threads: "Threads",
    tiktok: "TikTok",
    twitter: "Twitter (X)",
    notes: "Catatan Stabilitas Platform",
    noteBody: "Kami terus memperbarui ekstraktor kami। Sebagian besar ekstraksi memakan waktu kurang dari 10 detik。",
    globalTrending: "Pusat Tren Global",
    globalTrendingSubtitle: "Temukan klip populer di semua platform.",
    recentDownloadsSubtitle: "Jelajahi media terbaru yang berhasil disimpan oleh pengguna kami di seluruh dunia.",
    viewAllLatest: "Lihat semua yang terbaru",
    guidesTitle: "Panduan Utama 2026",
    guide2026: "Panduan 2026"
  },
  hi: {
    welcome: "वीडियो डाउनलोडर (बिना वॉटरमार्क)",
    subtitle: "उच्च गुणवत्ता वाले MP4 के लिए प्रीमियम हब। बिना वॉटरमार्क, बिना लॉगिन, 100% मुफ्त।",
    weeklyTrending: "साप्ताहिक ट्रेंडिंग",
    recentDownloads: "हाल के डाउनलोड",
    startDownloading: "अभी निकालना शुरू करें",
    bilibili: "Bilibili",
    bluesky: "Bluesky",
    discord: "Discord",
    facebook: "Facebook",
    lemon8: "Lemon8",
    pinterest: "Pinterest",
    reddit: "Reddit",
    telegram: "Telegram",
    threads: "Threads",
    tiktok: "TikTok",
    twitter: "Twitter (X)",
    notes: "प्लेटफॉर्म स्थिरता नोट्स",
    noteBody: "हम प्लेटफॉर्म परिवर्तन के अनुसार अपने एक्सट्रैक्टर्स को लगातार अपडेट करते हैं। अधिकांश निष्कर्षण 10 सेकंड से कम समय लेते हैं।",
    globalTrending: "वैश्विक ट्रेंडिंग हब",
    globalTrendingSubtitle: "सभी प्लेटफार्मों पर लोकप्रिय क्लिप खोजें।",
    recentDownloadsSubtitle: "दुनिया भर के उपयोगकर्ताओं द्वारा हाल ही में सफलतापूर्वक सहेजे गए मीडिया को देखें।",
    viewAllLatest: "सभी नवीनतम देखें",
    guidesTitle: "सर्वश्रेष्ठ गाइड 2026",
    guide2026: "2026 गाइड"
  },
  de: {
    welcome: "Video Downloader (ohne Wasserzeichen)",
    subtitle: "Der Premium-Hub für hochwertige MP4-Archive. Ohne Wasserzeichen, ohne Anmeldung, 100% kostenlos.",
    weeklyTrending: "Wöchentliche Trends",
    recentDownloads: "Aktuelle Downloads",
    startDownloading: "Jetzt Extraktion starten",
    bilibili: "Bilibili",
    bluesky: "Bluesky",
    discord: "Discord",
    facebook: "Facebook",
    lemon8: "Lemon8",
    pinterest: "Pinterest",
    reddit: "Reddit",
    telegram: "Telegram",
    threads: "Threads",
    tiktok: "TikTok",
    twitter: "Twitter (X)",
    notes: "Stabilitätshinweise",
    noteBody: "Wir aktualisieren unsere Extraktoren ständig। Die meisten Extraktionen dauern weniger als 10 Sekunden。",
    globalTrending: "Globaler Trend-Hub",
    globalTrendingSubtitle: "Entdecken Sie beliebte Clips auf allen Plattformen。",
    recentDownloadsSubtitle: "Entdecken Sie Medien, die von unseren Nutzern weltweit zuletzt erfolgreich gespeichert wurden.",
    viewAllLatest: "Alle neuesten anzeigen",
    guidesTitle: "Ultimative Guides 2026",
    guide2026: "Guide 2026"
  },
  tr: {
    welcome: "Video İndirici (Filigransız)",
    subtitle: "Yüksek kaliteli MP4 arşivleri için premium merkez. Filigran yok, giriş yok, %100 ücretsiz.",
    weeklyTrending: "Haftalık Gündem",
    recentDownloads: "Son İndirmeler",
    startDownloading: "Şimdi Çıkarmaya Başlayın",
    bilibili: "Bilibili",
    bluesky: "Bluesky",
    discord: "Discord",
    facebook: "Facebook",
    lemon8: "Lemon8",
    pinterest: "Pinterest",
    reddit: "Reddit",
    telegram: "Telegram",
    threads: "Threads",
    tiktok: "TikTok",
    twitter: "Twitter (X)",
    notes: "Platform Kararlılık Notları",
    noteBody: "Platform değişikliklerine uyum sağlamak için araçlarımızı sürekli güncelliyoruz। Çoğu işlem 10 saniyeden kısa sürer।",
    globalTrending: "Küresel Trend Merkezi",
    globalTrendingSubtitle: "Tüm platformlardaki popüler klipleri keşfedin。",
    recentDownloadsSubtitle: "Kullanıcılarımız tarafından yakın zamanda başarıyla kaydedilen medyaları keşfedin.",
    viewAllLatest: "Tüm yenileri gör",
    guidesTitle: "Nihai Kılavuzlar 2026",
    guide2026: "2026 Kılavuzu"
  }
};

export default async function HomePage({ searchParams }: HomeProps) {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = translations[locale] || translations.en;
  const menu = menuText[locale] || menuText.en;
  const faq = faqDict[locale] || faqDict.en;
  const base = SITE_URL;
  const url = `${base}/${locale !== 'en' ? `?locale=${locale}` : ''}`;
  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        'name': 'ClipKeep',
        'url': base,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${base}/?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'Organization',
        'name': 'ClipKeep',
        'url': base,
        'logo': `${base}/icon.png`,
        'sameAs': [
          'https://x.com/clipkeep'
        ]
      },
      {
        '@type': 'WebApplication',
        'name': 'ClipKeep Downloader',
        'url': base,
        'applicationCategory': 'MultimediaApplication',
        'operatingSystem': 'Windows, macOS, Android, iOS',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.8',
          'ratingCount': '2500'
        }
      },
      {
        '@type': 'CollectionPage',
        name: t.welcome,
        description: t.subtitle,
        url,
      },
      {
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': faq.q1,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.a1,
            }
          },
          {
            '@type': 'Question',
            'name': faq.q2,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.a2,
            }
          }
        ]
      },
      {
        '@type': 'ItemList',
        name: 'ClipKeep Supported Platforms',
        itemListElement: supportedPlatforms.map((name, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name,
        })),
      },
    ],
  };

  return (
    <main className="max-w-[1400px] mx-auto py-12 px-6 relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />
      
      {/* Premium Background Aesthetics */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px] animate-slow-blob" />
        <div className="absolute bottom-[10%] right-[-10%] w-[35%] h-[35%] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[120px] animate-slow-blob [animation-delay:2s]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full blur-[100px] animate-slow-blob [animation-delay:4s]" />
      </div>

      <div className="text-center mb-10 pt-8 sm:pt-16">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {t.startDownloading || "Ready to Archive"}
          </div>

          <Link
            href={`/trending?locale=${locale}`}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold backdrop-blur-sm hover:scale-105 transition-transform"
          >
            <span aria-hidden="true">🔥</span>
            {menu.rankings}
          </Link>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-slate-50 tracking-tight mb-6 leading-[1.1]">
          {t.welcome}
        </h1>
        
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
          {t.subtitle}
        </p>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-3 text-xs font-medium">
          {[
            "No login required",
            "Permanent archives",
            "Private by design",
            "Public posts only"
          ].map((feat) => (
            <span key={feat} className="glass-panel px-4 py-1.5 rounded-full text-slate-700 dark:text-slate-300">
              {feat}
            </span>
          ))}
        </div>

        {/* Supported platform icons — Refined animations */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {[
            { id: 'tiktok',    Icon: TiktokIcon,    bg: 'bg-slate-950',   glow: 'hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]' },
            { id: 'twitter',   Icon: TwitterXIcon,  bg: 'bg-slate-900',   glow: 'hover:shadow-[0_0_20px_rgba(15,23,42,0.3)]' },
            { id: 'telegram',  Icon: TelegramIcon,  bg: 'bg-blue-400',    glow: 'hover:shadow-[0_0_20px_rgba(96,165,250,0.4)]'  },
            { id: 'reddit',    Icon: RedditIcon,    bg: 'bg-orange-600',  glow: 'hover:shadow-[0_0_20px_rgba(234,88,12,0.4)]' },
            { id: 'facebook',  Icon: FacebookIcon,  bg: 'bg-blue-600',    glow: 'hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]'  },
            { id: 'pinterest', Icon: PinterestIcon, bg: 'bg-red-600',     glow: 'hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]'   },
            { id: 'threads',   Icon: ThreadsIcon,   bg: 'bg-slate-900',   glow: 'hover:shadow-[0_0_20px_rgba(15,23,42,0.3)]' },
            { id: 'bluesky',   Icon: BlueskyIcon,   bg: 'bg-blue-400',    glow: 'hover:shadow-[0_0_20px_rgba(96,165,250,0.4)]'  },
            { id: 'bilibili',  Icon: BilibiliIcon,  bg: 'bg-pink-400',    glow: 'hover:shadow-[0_0_20px_rgba(244,114,182,0.4)]'  },
            { id: 'discord',   Icon: DiscordIcon,   bg: 'bg-indigo-500',  glow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]'},
            { id: 'lemon8',    Icon: Lemon8Icon,    bg: 'bg-yellow-400',  glow: 'hover:shadow-[0_0_20px_rgba(250,204,21,0.4)]'},
          ].map(({ id, Icon, bg, glow }) => (
            <Link
              key={id}
              href={`/download-${id}-video${locale !== 'en' ? `?locale=${locale}` : ''}`}
              title={id.charAt(0).toUpperCase() + id.slice(1)}
              className="group relative"
            >
              <div className={`w-11 h-11 flex items-center justify-center rounded-2xl ${bg} ${glow} shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-active:scale-95`}>
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mb-16 dynamic-glow relative z-10 w-full max-w-3xl mx-auto">
          <ExtractorForm locale={locale} hero={true} />
        </div>

        <HistorySection locale={locale} />
        
        <div className="mt-16">
          <LiveStatsTicker locale={locale} />
        </div>
      </div>

      <section className="mb-16 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Personal archive first",
            body: "ClipKeep is built for saving public media links for personal reference, research, and offline access.",
          },
          {
            title: "No private access",
            body: "We do not ask for passwords, browser cookies, or logged-in sessions. Private and login-required posts stay unsupported.",
          },
          {
            title: "Know why it failed",
            body: "When a platform blocks a request, the result page explains the likely reason and points to the safest next step.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-5 text-left shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.body}</p>
          </div>
        ))}
      </section>

      <TrendingHubSection 
        locale={locale} 
        title={t.globalTrending || "Trending Hub"}
        subtitle={t.globalTrendingSubtitle}
      />

      <div className="mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 flex items-center mb-2">
              <span className="w-1.5 h-8 bg-blue-600 rounded-full mr-3 shadow-[0_0_8px_rgba(37,99,235,0.4)]"></span>
              {t.recentDownloads || "Recent Downloads"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base ml-4.5">
              {t.recentDownloadsSubtitle || "Explore the latest media successfully cached by our users worldwide."}
            </p>
          </div>
          
          <Link 
            href={`/latest?locale=${locale}`}
            className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline ml-4.5 sm:ml-0"
          >
            {t.viewAllLatest || "View All Latest"}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
        
        <GallerySection platform="all" locale={locale} type="recent" limit={8} hideMeta={false} layout="masonry" id="recent-downloads" title="" />
      </div>

      <section className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 sm:p-12 border border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-50">{t.notes}</h2>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-gray-800 dark:text-slate-300 font-medium">{t.noteBody}</p>
      </section>

      <div className="mb-20">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 flex items-center mb-8">
          <span className="w-1.5 h-8 bg-indigo-600 rounded-full mr-3 shadow-[0_0_8px_rgba(79,70,229,0.4)]"></span>
          {t.guidesTitle || "Ultimate Guides 2026"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { slug: "twitter-video-download-2026", title: (t.twitter || "Twitter") + " " + (t.guide2026 || "2026") },
            { slug: "tiktok-download-2026", title: (t.tiktok || "TikTok") + " " + (t.guide2026 || "2026") },
            { slug: "how-to-download-without-watermark", title: t.welcome },
            { slug: "how-to-save-on-iphone-android", title: t.notes },
            { slug: "best-quality-download-settings", title: "HD / 4K " + (t.guide2026 || "2026") },
            { slug: "reddit-video-downloader-not-working", title: (t.reddit || "Reddit") + " Fix" },
          ].map((guide) => (
            <Link 
              key={guide.slug}
              href={`/solution/${guide.slug}${locale !== 'en' ? `?locale=${locale}` : ''}`}
              className="glass-panel p-5 rounded-2xl hover:border-indigo-500/50 transition-all group block"
            >
              <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm sm:text-base">
                {guide.title}
              </h3>
              <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mt-2 flex items-center gap-1 group-hover:text-indigo-500">
                Read Guide <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </p>
            </Link>
          ))}
        </div>
      </div>

      <DiscoverySection locale={locale} />
    </main>
  );
}
