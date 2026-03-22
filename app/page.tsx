import type { Metadata } from 'next';
import Link from 'next/link';
import { normalizeLocale } from '@/lib/i18n/ui';
import { DiscoverySection } from '@/components/discovery-section';
import { GallerySection } from '@/components/gallery-section';

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: HomeProps): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const base = 'https://clipkeep.net';
  const url = `${base}/${locale !== 'en' ? `?locale=${locale}` : ''}`;

  const meta: Record<string, { title: string; description: string }> = {
    en: {
      title: 'SNS Downloader Hub',
      description: 'ClipKeep home hub for Twitter, Telegram, and TikTok downloader tools, weekly ranking, and recent downloads.',
    },
    ja: {
      title: 'SNS動画保存ハブ',
      description: 'X、Telegram、TikTok、Instagram向けの保存ツール、週間ランキング、最近のダウンロードをまとめた案内ページです।',
    },
    ar: {
      title: 'مركز مطور SNS',
      description: 'ClipKeep هو المركز الرئيسي لأدوات تنزيل Twitter و Telegram و TikTok والتصنيفات الأسبوعية والتنزيلات الحديثة।',
    },
    es: {
      title: 'Centro de Descarga de Redes Sociales',
      description: 'Hub de ClipKeep para Twitter, Telegram y TikTok, con ranking semanal y descargas recientes।',
    },
    pt: {
      title: 'Central de Downloads de Redes Sociais',
      description: 'Hub do ClipKeep para Twitter, Telegram e TikTok, com ranking semanal e downloads recentes।',
    },
    fr: {
      title: 'Hub de Téléchargement SNS',
      description: 'Hub ClipKeep pour Twitter, Telegram et TikTok, avec classement hebdomadaire et téléchargements récents।',
    },
    id: {
      title: 'Hub Pengunduh SNS',
      description: 'Hub ClipKeep untuk Twitter, Telegram, dan TikTok, dengan peringkat mingguan dan unduhan terbaru।',
    },
    hi: {
      title: 'SNS डाउनलोडर हब',
      description: 'ट्विटर, टेलीग्राम और टिकटॉक डाउनलोडर टूल्स, साप्ताहिक रैंकिंग और हाल के डाउनलोड के लिए क्लिपकीप हब।',
    },
    de: {
      title: 'SNS Downloader Hub',
      description: 'ClipKeep Hub für Twitter, Telegram und TikTok Downloader, wöchentliches Ranking und aktuelle Downloads।',
    },
    tr: {
      title: 'SNS İndirici Merkezi',
      description: 'Twitter, Telegram ve TikTok indirici araçları, haftalık sıralama ve son indirmeler için ClipKeep merkezi।',
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

const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: "Welcome to ClipKeep",
    subtitle: "The all-in-one downloader hub for your favorite platforms.",
    weeklyTrending: "Weekly Trending",
    recentDonwloads: "Recent Downloads",
    startDownloading: "Start Extracting Now",
    twitter: "Twitter (X)",
    telegram: "Telegram",
    tiktok: "TikTok",
    instagram: "Instagram",
    notes: "Platform Stability Notes",
    noteBody: "We constantly update our extractors to match platform changes. Most extractions take less than 10 seconds.",
    globalTrending: "Global Trending Hub",
    globalTrendingSubtitle: "Discover popular clips across all platforms."
  },
  ja: {
    welcome: "ClipKeep へようこそ",
    subtitle: "お気に入りのプラットフォームに対応したオールインワン保存ハブ。",
    weeklyTrending: "週間トレンド",
    recentDonwloads: "最近のダウンロード",
    startDownloading: "今すぐ保存を開始",
    twitter: "Twitter (X)",
    telegram: "Telegram",
    tiktok: "TikTok",
    instagram: "Instagram",
    notes: "安定性について",
    noteBody: "プラットフォームの仕様変更に合わせて常に更新しています。ほとんどの抽出は10秒以内に完了します。",
    globalTrending: "グローバルトレンドハブ",
    globalTrendingSubtitle: "すべてのプラットフォームから人気のクリップを公開。"
  },
  ar: {
    welcome: "مرحبًا بك في ClipKeep",
    subtitle: "قم بتنزيل مقاطع فيديو عالية الجودة من منصات مختلفة।",
    weeklyTrending: "الأكثر رواجًا لهذا الأسبوع",
    recentDonwloads: "أحدث التنزيلات",
    startDownloading: "ابدأ الاستخراج الآن",
    twitter: "Twitter (X)",
    telegram: "Telegram",
    tiktok: "TikTok",
    instagram: "Instagram",
    notes: "ملاحظات استقرار المنصة",
    noteBody: "نحن نقوم باستمرار بتحديث المستخرجات الخاصة بنا لتناسب تغييرات المنصة। تستغرق معظم عمليات الاستخراج أقل من 10 ثوانٍ।",
    globalTrending: "مركز الترند العالمي",
    globalTrendingSubtitle: "اكتشف المقاطع الشائعة عبر جميع المنصات."
  },
  es: {
    welcome: "Bienvenido a ClipKeep",
    subtitle: "Descarga videos de alta calidad de varias plataformas।",
    weeklyTrending: "Tendencias Semanales",
    recentDonwloads: "Descargas Recientes",
    startDownloading: "Comenzar Extracción",
    twitter: "Twitter (X)",
    telegram: "Telegram",
    tiktok: "TikTok",
    instagram: "Instagram",
    notes: "Notas de Estabilidad",
    noteBody: "Actualizamos constantemente nuestros extractores। La mayoría de las extracciones tardan menos de 10 segundos।",
    globalTrending: "Hub de tendencias globales",
    globalTrendingSubtitle: "Descubre clips populares en todas las plataformas."
  },
  pt: {
    welcome: "Bem-vindo ao ClipKeep",
    subtitle: "Baixe vídeos de alta qualidade de várias plataformas।",
    weeklyTrending: "Tendências Semanais",
    recentDonwloads: "Downloads Recentes",
    startDownloading: "Começar Extração",
    twitter: "Twitter (X)",
    telegram: "Telegram",
    tiktok: "TikTok",
    instagram: "Instagram",
    notes: "Notas de Estabilidade",
    noteBody: "Atualizamos constantemente nossos extratores। A maioria das extrações leva menos de 10 segundos।",
    globalTrending: "Hub de tendências globais",
    globalTrendingSubtitle: "Descubra clipes populares em todas as plataformas."
  },
  fr: {
    welcome: "Bienvenue sur ClipKeep",
    subtitle: "Téléchargez des vidéos de haute qualité depuis diverses plateformes।",
    weeklyTrending: "Tendances Hebdomadaires",
    recentDonwloads: "Téléchargements Récents",
    startDownloading: "Démarrer l'Extraction",
    twitter: "Twitter (X)",
    telegram: "Telegram",
    tiktok: "TikTok",
    instagram: "Instagram",
    notes: "Notes sur la Stabilité",
    noteBody: "Nous mettons à jour nos extracteurs régulièrement। La plupart des extractions prennent moins de 10 secondes。",
    globalTrending: "Hub des tendances mondiales",
    globalTrendingSubtitle: "Découvrez les clips populaires sur toutes les plateformes."
  },
  id: {
    welcome: "Selamat datang di ClipKeep",
    subtitle: "Unduh video berkualitas tinggi dari berbagai platform।",
    weeklyTrending: "Tren Mingguan",
    recentDonwloads: "Unduhan Terbaru",
    startDownloading: "Mulai Ekstraksi Sekarang",
    twitter: "Twitter (X)",
    telegram: "Telegram",
    tiktok: "TikTok",
    instagram: "Instagram",
    notes: "Catatan Stabilitas Platform",
    noteBody: "Kami terus memperbarui ekstraktor kami। Sebagian besar ekstraksi memakan waktu kurang dari 10 detik。",
    globalTrending: "Pusat Tren Global",
    globalTrendingSubtitle: "Temukan klip populer di semua platform."
  },
  hi: {
    welcome: "क्लिपकीप में आपका स्वागत है",
    subtitle: "विभिन्न प्लेटफार्मों से उच्च गुणवत्ता वाले वीडियो डाउनलोड करें।",
    weeklyTrending: "साप्ताहिक ट्रेंडिंग",
    recentDonwloads: "हाल के डाउनलोड",
    startDownloading: "अभी निकालना शुरू करें",
    twitter: "Twitter (X)",
    telegram: "Telegram",
    tiktok: "TikTok",
    instagram: "Instagram",
    notes: "प्लेटफॉर्म स्थिरता नोट्स",
    noteBody: "हम प्लेटफॉर्म परिवर्तन के अनुसार अपने एक्सट्रैक्टर्स को लगातार अपडेट करते हैं। अधिकांश निष्कर्षण 10 सेकंड से कम समय लेते हैं।",
    globalTrending: "वैश्विक ट्रेंडिंग हब",
    globalTrendingSubtitle: "सभी प्लेटफार्मों पर लोकप्रिय क्लिप खोजें।"
  },
  de: {
    welcome: "Willkommen bei ClipKeep",
    subtitle: "Das All-in-One-Downloader-Hub für Ihre Lieblingsplattformen।",
    weeklyTrending: "Wöchentliche Trends",
    recentDonwloads: "Aktuelle Downloads",
    startDownloading: "Jetzt Extraktion starten",
    twitter: "Twitter (X)",
    telegram: "Telegram",
    tiktok: "TikTok",
    instagram: "Instagram",
    notes: "Stabilitätshinweise",
    noteBody: "Wir aktualisieren unsere Extraktoren ständig। Die meisten Extraktionen dauern weniger als 10 Sekunden。",
    globalTrending: "Globaler Trend-Hub",
    globalTrendingSubtitle: "Entdecken Sie beliebte Clips auf allen Plattformen。"
  },
  tr: {
    welcome: "ClipKeep'e Hoş Geldiniz",
    subtitle: "Favori platformlarınız için hepsi bir arada indirici merkezi।",
    weeklyTrending: "Haftalık Gündem",
    recentDonwloads: "Son İndirmeler",
    startDownloading: "Şimdi Çıkarmaya Başlayın",
    twitter: "Twitter (X)",
    telegram: "Telegram",
    tiktok: "TikTok",
    instagram: "Instagram",
    notes: "Platform Kararlılık Notları",
    noteBody: "Platform değişikliklerine uyum sağlamak için araçlarımızı sürekli güncelliyoruz। Çoğu işlem 10 saniyeden kısa sürer।",
    globalTrending: "Küresel Trend Merkezi",
    globalTrendingSubtitle: "Tüm platformlardaki popüler klipleri keşfedin。"
  }
};

export default async function HomePage({ searchParams }: HomeProps) {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = translations[locale] || translations.en;

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tight mb-4">
          {t.welcome}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
         <Link href={`/download-twitter-video${locale !== 'en' ? `?locale=${locale}` : ''}`} className="group p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 ring-4 ring-slate-50 dark:ring-slate-800">
               <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">{t.twitter}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t.startDownloading}</p>
         </Link>

         <Link href={`/download-telegram-video${locale !== 'en' ? `?locale=${locale}` : ''}`} className="group p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6 ring-4 ring-blue-50 dark:ring-slate-800">
               <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.762 5.319-1.056 6.887-.125.664-.371.887-.607.909-.513.048-.903-.337-1.4-.663-.777-.51-1.215-.828-1.967-1.323-.869-.57-.306-.883.19-.139 1.3 1.95 2.394 3.606 3.774 5.679.155.234.305.454.455.67.149.222.284.423.415.617.13.194.25.372.361.534.111.162.213.31.305.441.254.364.57 1.258.113 1.875l.136-.182zm-4.962 0zM12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">{t.telegram}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t.startDownloading}</p>
         </Link>

         <Link href={`/download-tiktok-video${locale !== 'en' ? `?locale=${locale}` : ''}`} className="group p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-pink-500/50 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center mb-6 ring-4 ring-slate-100 dark:ring-slate-800">
               <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">{t.tiktok}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t.startDownloading}</p>
         </Link>

         <Link href={`/download-instagram-video${locale !== 'en' ? `?locale=${locale}` : ''}`} className="group p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-purple-500/50 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 ring-4 ring-purple-50 dark:ring-slate-800">
               <svg className="w-6 h-6 text-white fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">{t.instagram}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t.startDownloading}</p>
         </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-8 flex items-center">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
            {t.weeklyTrending}
          </h2>
          <GallerySection platform="twitter" locale={locale} title={t.weeklyTrending} type="trending" limit={6} hideMeta={false} layout="masonry" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-8 flex items-center">
            <span className="w-1.5 h-6 bg-slate-400 dark:bg-slate-700 rounded-full mr-3"></span>
            {t.recentDonwloads}
          </h2>
          <GallerySection platform="twitter" locale={locale} title={t.recentDonwloads} type="recent" limit={6} hideMeta={false} layout="masonry" />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-2 flex items-center">
          <span className="w-1.5 h-6 bg-indigo-600 rounded-full mr-3 shadow-[0_0_8px_rgba(79,70,229,0.4)]"></span>
          {t.globalTrending}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 ml-4.5">
          {t.globalTrendingSubtitle}
        </p>
        <GallerySection platform="all" type="trending" locale={locale} layout="carousel" limit={12} id="global-hub" title="" hideMeta={true} />
      </div>

      <section className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 sm:p-12 border border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-50">{t.notes}</h2>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-gray-800 dark:text-slate-300 font-medium">{t.noteBody}</p>
      </section>

      <DiscoverySection locale={locale} />
    </main>
  );
}
