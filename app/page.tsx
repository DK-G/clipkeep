import type { Metadata } from 'next';
import { normalizeLocale } from '@/lib/i18n/ui';
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
      title: 'SNS Downloader Hub',
      description: 'ClipKeep home hub for Bilibili, Bluesky, Discord, Facebook, Lemon8, Pinterest, Reddit, Threads, TikTok, and Twitter downloader tools.',
    },
    ja: {
      title: 'SNS動画保存ハブ',
      description: 'Bilibili, Bluesky, Discord, Facebook, Lemon8, Pinterest, Reddit, Threads, TikTok, X(Twitter)などの保存ツールをまとめたハブページです。',
    },
    ar: {
      title: 'مركز مطور SNS',
      description: 'مركز ClipKeep لأدوات تنزيل Bilibili وBluesky وDiscord وFacebook وLemon8 وPinterest وReddit وThreads وTikTok وTwitter.',
    },
    es: {
      title: 'Centro de Descarga de Redes Sociales',
      description: 'Centro de ClipKeep para herramientas de descarga de Bilibili, Bluesky, Discord, Facebook, Lemon8, Pinterest, Reddit, Threads, TikTok y Twitter.',
    },
    pt: {
      title: 'Central de Downloads de Redes Sociais',
      description: 'Central do ClipKeep para ferramentas de download de Bilibili, Bluesky, Discord, Facebook, Lemon8, Pinterest, Reddit, Threads, TikTok e Twitter.',
    },
    fr: {
      title: 'Hub de Téléchargement SNS',
      description: 'Hub ClipKeep pour les outils de téléchargement Bilibili, Bluesky, Discord, Facebook, Lemon8, Pinterest, Reddit, Threads, TikTok et Twitter.',
    },
    id: {
      title: 'Hub Pengunduh SNS',
      description: 'Hub ClipKeep untuk alat unduh Bilibili, Bluesky, Discord, Facebook, Lemon8, Pinterest, Reddit, Threads, TikTok, dan Twitter.',
    },
    hi: {
      title: 'SNS डाउनलोडर हब',
      description: 'Bilibili, Bluesky, Discord, Facebook, Lemon8, Pinterest, Reddit, Threads, TikTok और Twitter डाउनलोड टूल्स के लिए ClipKeep हब।',
    },
    de: {
      title: 'SNS Downloader Hub',
      description: 'ClipKeep Hub für Downloader-Tools von Bilibili, Bluesky, Discord, Facebook, Lemon8, Pinterest, Reddit, Threads, TikTok und Twitter.',
    },
    tr: {
      title: 'SNS İndirici Merkezi',
      description: 'Bilibili, Bluesky, Discord, Facebook, Lemon8, Pinterest, Reddit, Threads, TikTok ve Twitter indirici araçları için ClipKeep merkezi.',
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
    welcome: "Welcome to ClipKeep",
    subtitle: "The all-in-one downloader hub for your favorite platforms.",
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
    viewAllLatest: "View All Latest"
  },
  ja: {
    welcome: "ClipKeep へようこそ",
    subtitle: "お気に入りのプラットフォームに対応したオールインワン保存ハブ。",
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
    viewAllLatest: "最新一覧を見る"
  },
  ar: {
    welcome: "مرحبًا بك في ClipKeep",
    subtitle: "قم بتنزيل مقاطع فيديو عالية الجودة من منصات مختلفة।",
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
    viewAllLatest: "عرض أحدث العناصر"
  },
  es: {
    welcome: "Bienvenido a ClipKeep",
    subtitle: "Descarga videos de alta calidad de varias plataformas।",
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
    viewAllLatest: "Ver todo lo reciente"
  },
  pt: {
    welcome: "Bem-vindo ao ClipKeep",
    subtitle: "Baixe vídeos de alta qualidade de várias plataformas।",
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
    viewAllLatest: "Ver tudo em latest"
  },
  fr: {
    welcome: "Bienvenue sur ClipKeep",
    subtitle: "Téléchargez des vidéos de haute qualité depuis diverses plateformes।",
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
    viewAllLatest: "Voir tout dans Latest"
  },
  id: {
    welcome: "Selamat datang di ClipKeep",
    subtitle: "Unduh video berkualitas tinggi dari berbagai platform।",
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
    viewAllLatest: "Lihat semua yang terbaru"
  },
  hi: {
    welcome: "क्लिपकीप में आपका स्वागत है",
    subtitle: "विभिन्न प्लेटफार्मों से उच्च गुणवत्ता वाले वीडियो डाउनलोड करें।",
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
    viewAllLatest: "सभी नवीनतम देखें"
  },
  de: {
    welcome: "Willkommen bei ClipKeep",
    subtitle: "Das All-in-One-Downloader-Hub für Ihre Lieblingsplattformen।",
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
    viewAllLatest: "Alle neuesten anzeigen"
  },
  tr: {
    welcome: "ClipKeep'e Hoş Geldiniz",
    subtitle: "Favori platformlarınız için hepsi bir arada indirici merkezi।",
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
    viewAllLatest: "Tüm yenileri gör"
  }
};

export default async function HomePage({ searchParams }: HomeProps) {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = translations[locale] || translations.en;
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
    <main className="max-w-[1400px] mx-auto py-12 px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tight mb-4">
          {t.welcome}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-3">
          Save public social media posts in seconds with one URL.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-6">
          Public posts only. If extraction fails, ClipKeep shows the reason and what to try next.
        </p>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
          <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-3 py-1 text-slate-700 dark:text-slate-300">No login required</span>
          <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-3 py-1 text-slate-700 dark:text-slate-300">Public posts only</span>
          <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-3 py-1 text-slate-700 dark:text-slate-300">Clear error reasons</span>
          <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-3 py-1 text-slate-700 dark:text-slate-300">No cookies or account access</span>
        </div>

        {/* Supported platform icons — signals compatibility at a glance */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {[
            { id: 'tiktok',    Icon: TiktokIcon,    bg: 'bg-slate-950' },
            { id: 'twitter',   Icon: TwitterXIcon,  bg: 'bg-slate-900' },
            { id: 'telegram',  Icon: TelegramIcon,  bg: 'bg-blue-400'  },
            { id: 'reddit',    Icon: RedditIcon,    bg: 'bg-orange-600'},
            { id: 'facebook',  Icon: FacebookIcon,  bg: 'bg-blue-600'  },
            { id: 'pinterest', Icon: PinterestIcon, bg: 'bg-red-600'   },
            { id: 'threads',   Icon: ThreadsIcon,   bg: 'bg-slate-900' },
            { id: 'bluesky',   Icon: BlueskyIcon,   bg: 'bg-blue-400'  },
            { id: 'bilibili',  Icon: BilibiliIcon,  bg: 'bg-pink-400'  },
            { id: 'discord',   Icon: DiscordIcon,   bg: 'bg-indigo-500'},
            { id: 'lemon8',    Icon: Lemon8Icon,    bg: 'bg-yellow-400'},
          ].map(({ id, Icon, bg }) => (
            <Link
              key={id}
              href={`/download-${id}-video${locale !== 'en' ? `?locale=${locale}` : ''}`}
              title={id.charAt(0).toUpperCase() + id.slice(1)}
              className="group"
            >
              <div className={`w-9 h-9 flex items-center justify-center rounded-xl ${bg} shadow-sm opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200`}>
                <Icon className="w-5 h-5" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mb-12 dynamic-glow relative z-10 w-full max-w-3xl mx-auto">
          <ExtractorForm locale={locale} hero={true} />
        </div>

        <HistorySection locale={locale} />
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

      <DiscoverySection locale={locale} />
    </main>
  );
}
