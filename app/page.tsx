import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale, normalizeLocale } from '@/lib/i18n/ui';

export async function generateMetadata({ searchParams }: HomeProps): Promise<Metadata> {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const base = 'https://clipkeep.net';
  const url = `${base}${locale !== 'en' ? `?locale=${locale}` : ''}`;

  const meta = {
    en: {
      title: 'SNS Downloader Hub',
      description: 'ClipKeep home hub for Twitter, Telegram, and TikTok downloader tools, weekly ranking, and recent downloads.',
    },
    ja: {
      title: 'SNS動画保存ハブ',
      description: 'X、Telegram、TikTok、Instagram向けの保存ツール、週間ランキング、最近のダウンロードをまとめた案内ページです。',
    },
    ar: {
      title: 'بوابة تنزيل فيديوهات SNS',
      description: 'صفحة ClipKeep الرئيسية لأدوات التنزيل والتصنيف الأسبوعي وأحدث التنزيلات.',
    },
    es: {
      title: 'Centro de descarga SNS',
      description: 'Página principal de ClipKeep con herramientas de descarga, ranking semanal y descargas recientes.',
    },
    pt: {
      title: 'Hub de download SNS',
      description: 'Página inicial do ClipKeep com ferramentas de download, ranking semanal e downloads recentes.',
    },
    fr: {
      title: 'Hub de téléchargement SNS',
      description: 'Page d’accueil ClipKeep avec outils de téléchargement, classement hebdomadaire et téléchargements récents.',
    },
    id: {
      title: 'Pusat unduhan SNS',
      description: 'Halaman utama ClipKeep untuk alat unduh, peringkat mingguan, dan unduhan terbaru.',
    },
    hi: {
      title: 'SNS डाउनलोड हब',
      description: 'ClipKeep का मुख्य पृष्ठ: डाउनलोड टूल, साप्ताहिक रैंकिंग और हालिया डाउनलोड।',
    },
    de: {
      title: 'SNS-Download-Hub',
      description: 'ClipKeep-Startseite mit Download-Tools, Wochenranking und neuesten Downloads.',
    },
    tr: {
      title: 'SNS indirme merkezi',
      description: 'ClipKeep ana sayfası: indirme araçları, haftalık sıralama ve son indirmeler.',
    },
  } as const;

  return {
    title: meta[locale].title,
    description: meta[locale].description,
    alternates: {
      canonical: url,
      languages: {
        en: `${base}`,
        ja: `${base}?locale=ja`,
        ar: `${base}?locale=ar`,
      },
    },
  };
}

type TopPageDict = {
  intro: string;
  toolsFeeds: string;
  downloader: string;
  weeklyRanking: string;
  recentDownloads: string;
  siteInfo: string;
  notes: string;
  noteBody: string;
  sitemap: string;
  serviceStatus: string;
  terms: string;
  privacy: string;
  cookies: string;
  dmca: string;
  contact: string;
};

const topPageText: Record<Locale, TopPageDict> = {
  en: {
    intro: 'This is the gateway page for SNS video downloaders. Choose a page based on your purpose.',
    toolsFeeds: 'SNS Tools & Feeds',
    downloader: 'Downloader',
    weeklyRanking: 'Trend',
    recentDownloads: 'Latest',
    siteInfo: 'Site Information',
    notes: 'Notes',
    noteBody: 'The home page does not provide extraction directly. Please use each dedicated downloader page.',
    sitemap: 'Sitemap',
    serviceStatus: 'Service Status',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    cookies: 'Cookie Policy',
    dmca: 'DMCA / Copyright',
    contact: 'Contact',
  },
  ja: {
    intro: 'SNS動画ダウンローダーへの案内ページです。用途に応じて各ページへ進んでください。',
    toolsFeeds: 'SNSツールとフィード',
    downloader: 'ダウンローダー',
    weeklyRanking: 'トレンド',
    recentDownloads: '最新',
    siteInfo: 'サイト情報',
    notes: '注意事項',
    noteBody: 'トップページでは抽出機能を提供しません。抽出は各専用ダウンローダーページから行ってください。',
    sitemap: 'サイトマップ',
    serviceStatus: 'サービス稼働状況',
    terms: '利用規約',
    privacy: 'プライバシーポリシー',
    cookies: 'クッキーポリシー',
    dmca: 'DMCA / 著作権',
    contact: 'お問い合わせ',
  },
  ar: {
    intro: 'هذه صفحة التوجيه لأدوات تنزيل فيديوهات SNS. اختر الصفحة المناسبة حسب الهدف.',
    toolsFeeds: 'الأدوات والخلاصات',
    downloader: 'أداة التنزيل',
    weeklyRanking: 'الرائج',
    recentDownloads: 'الأحدث',
    siteInfo: 'معلومات الموقع',
    notes: 'ملاحظات',
    noteBody: 'لا توفر الصفحة الرئيسية الاستخراج مباشرة. استخدم صفحات التنزيل المخصصة.',
    sitemap: 'خريطة الموقع',
    serviceStatus: 'حالة الخدمة',
    terms: 'شروط الخدمة',
    privacy: 'سياسة الخصوصية',
    cookies: 'سياسة ملفات تعريف الارتباط',
    dmca: 'حقوق النشر / DMCA',
    contact: 'اتصل بنا',
  },
  es: {
    intro: 'Esta es la página de acceso a los descargadores SNS. Elige la sección según tu objetivo.',
    toolsFeeds: 'Herramientas y feeds SNS',
    downloader: 'Descargador',
    weeklyRanking: 'Tendencias',
    recentDownloads: 'Últimos',
    siteInfo: 'Información del sitio',
    notes: 'Notas',
    noteBody: 'La página principal no ofrece extracción directa. Usa cada página de descargador dedicada.',
    sitemap: 'Mapa del sitio',
    serviceStatus: 'Estado del servicio',
    terms: 'Términos de servicio',
    privacy: 'Política de privacidad',
    cookies: 'Política de cookies',
    dmca: 'DMCA / Copyright',
    contact: 'Contacto',
  },
  pt: {
    intro: 'Esta é a página de entrada dos baixadores SNS. Escolha a página conforme seu objetivo.',
    toolsFeeds: 'Ferramentas e feeds SNS',
    downloader: 'Baixador',
    weeklyRanking: 'Tendências',
    recentDownloads: 'Últimos',
    siteInfo: 'Informações do site',
    notes: 'Notas',
    noteBody: 'A página inicial não oferece extração direta. Use cada página de downloader dedicada.',
    sitemap: 'Mapa do site',
    serviceStatus: 'Status do serviço',
    terms: 'Termos de serviço',
    privacy: 'Política de privacidade',
    cookies: 'Política de cookies',
    dmca: 'DMCA / Copyright',
    contact: 'Contato',
  },
  fr: {
    intro: 'Ceci est la page d’entrée des outils de téléchargement SNS. Choisissez la page selon votre besoin.',
    toolsFeeds: 'Outils et flux SNS',
    downloader: 'Téléchargeur',
    weeklyRanking: 'Tendances',
    recentDownloads: 'Récents',
    siteInfo: 'Informations du site',
    notes: 'Notes',
    noteBody: 'La page d’accueil ne fournit pas l’extraction directe. Utilisez les pages dédiées.',
    sitemap: 'Plan du site',
    serviceStatus: 'État du service',
    terms: 'Conditions d’utilisation',
    privacy: 'Politique de confidentialité',
    cookies: 'Politique de cookies',
    dmca: 'DMCA / Copyright',
    contact: 'Contact',
  },
  id: {
    intro: 'Ini adalah halaman gerbang untuk pengunduh video SNS. Pilih halaman sesuai kebutuhan Anda.',
    toolsFeeds: 'Alat & feed SNS',
    downloader: 'Pengunduh',
    weeklyRanking: 'Tren',
    recentDownloads: 'Terbaru',
    siteInfo: 'Informasi situs',
    notes: 'Catatan',
    noteBody: 'Halaman beranda tidak menyediakan ekstraksi langsung. Gunakan halaman pengunduh khusus.',
    sitemap: 'Peta situs',
    serviceStatus: 'Status layanan',
    terms: 'Ketentuan layanan',
    privacy: 'Kebijakan privasi',
    cookies: 'Kebijakan cookie',
    dmca: 'DMCA / Hak cipta',
    contact: 'Kontak',
  },
  hi: {
    intro: 'यह SNS वीडियो डाउनलोडर का प्रवेश पृष्ठ है। अपने उपयोग के अनुसार पेज चुनें।',
    toolsFeeds: 'SNS टूल्स और फीड्स',
    downloader: 'डाउनलोडर',
    weeklyRanking: 'ट्रेंडिंग',
    recentDownloads: 'नवीनतम',
    siteInfo: 'साइट जानकारी',
    notes: 'नोट्स',
    noteBody: 'होम पेज सीधे एक्सट्रैक्शन नहीं देता। कृपया प्रत्येक समर्पित डाउनलोडर पेज का उपयोग करें।',
    sitemap: 'साइटमैप',
    serviceStatus: 'सेवा स्थिति',
    terms: 'सेवा की शर्तें',
    privacy: 'गोपनीयता नीति',
    cookies: 'कुकी नीति',
    dmca: 'DMCA / कॉपीराइट',
    contact: 'संपर्क',
  },
  de: {
    intro: 'Dies ist die Einstiegsseite für SNS-Video-Downloader. Wählen Sie je nach Zweck die passende Seite.',
    toolsFeeds: 'SNS-Tools & Feeds',
    downloader: 'Downloader',
    weeklyRanking: 'Trends',
    recentDownloads: 'Neueste',
    siteInfo: 'Seiteninformationen',
    notes: 'Hinweise',
    noteBody: 'Die Startseite bietet keine direkte Extraktion. Bitte verwenden Sie die jeweiligen Downloader-Seiten.',
    sitemap: 'Sitemap',
    serviceStatus: 'Service-Status',
    terms: 'Nutzungsbedingungen',
    privacy: 'Datenschutzerklärung',
    cookies: 'Cookie-Richtlinie',
    dmca: 'DMCA / Urheberrecht',
    contact: 'Kontakt',
  },
  tr: {
    intro: 'Bu, SNS video indiricileri için giriş sayfasıdır. Amacınıza göre ilgili sayfayı seçin.',
    toolsFeeds: 'SNS araçları ve akışlar',
    downloader: 'İndirici',
    weeklyRanking: 'Trend',
    recentDownloads: 'En Son',
    siteInfo: 'Site bilgileri',
    notes: 'Notlar',
    noteBody: 'Ana sayfa doğrudan çıkarım sağlamaz. Lütfen ilgili indirici sayfalarını kullanın.',
    sitemap: 'Site haritası',
    serviceStatus: 'Servis durumu',
    terms: 'Hizmet şartları',
    privacy: 'Gizlilik politikası',
    cookies: 'Çerez politikası',
    dmca: 'DMCA / Telif hakkı',
    contact: 'İletişim',
  },
};

const cardClass =
  'block rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm sm:text-base font-bold text-gray-900 dark:text-slate-100 no-underline hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition';

const badgeClass =
  'inline-flex items-center rounded-full border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200';

const sectionCardClass =
  'rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm';

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: HomeProps) {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = topPageText[locale];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-slate-50">ClipKeep</h1>
        <p className="mt-3 text-base sm:text-lg leading-relaxed text-gray-800 dark:text-slate-300 font-medium">{t.intro}</p>
        <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
          <span className={badgeClass}>X (Twitter)</span>
          <span className={badgeClass}>Instagram</span>
          <span className={badgeClass}>TikTok</span>
          <span className={badgeClass}>Telegram</span>
        </div>
      </header>

      <section className="mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-50">{t.toolsFeeds}</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={sectionCardClass}>
            <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-slate-50">Instagram</h3>
            <div className="grid gap-2.5">
              <Link href={`/download-instagram-video?locale=${locale}`} className={cardClass}>{t.downloader}</Link>
              <Link href={`/instagram-trending-videos?locale=${locale}`} className={cardClass}>{t.weeklyRanking}</Link>
              <Link href={`/instagram-latest-videos?locale=${locale}`} className={cardClass}>{t.recentDownloads}</Link>
            </div>
          </div>

          <div className={sectionCardClass}>
            <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-slate-50">X (Twitter)</h3>
            <div className="grid gap-2.5">
              <Link href={`/download-twitter-video?locale=${locale}`} className={cardClass}>{t.downloader}</Link>
              <Link href={`/twitter-trending-videos?locale=${locale}`} className={cardClass}>{t.weeklyRanking}</Link>
              <Link href={`/twitter-latest-videos?locale=${locale}`} className={cardClass}>{t.recentDownloads}</Link>
            </div>
          </div>

          <div className={sectionCardClass}>
            <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-slate-50">TikTok</h3>
            <div className="grid gap-2.5">
              <Link href={`/download-tiktok-video?locale=${locale}`} className={cardClass}>{t.downloader}</Link>
              <Link href={`/tiktok-trending-videos?locale=${locale}`} className={cardClass}>{t.weeklyRanking}</Link>
              <Link href={`/tiktok-latest-videos?locale=${locale}`} className={cardClass}>{t.recentDownloads}</Link>
            </div>
          </div>
 
          <div className={sectionCardClass}>
            <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-slate-50">Telegram</h3>
            <div className="grid gap-2.5">
              <Link href={`/download-telegram-video?locale=${locale}`} className={cardClass}>{t.downloader}</Link>
              <Link href={`/telegram-trending-videos?locale=${locale}`} className={cardClass}>{t.weeklyRanking}</Link>
              <Link href={`/telegram-latest-videos?locale=${locale}`} className={cardClass}>{t.recentDownloads}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-50">{t.siteInfo}</h2>
        <ul className="mt-3 list-disc pl-5 leading-8 text-sm sm:text-base text-gray-700 dark:text-slate-300">
          <li><Link href="/sitemap.xml" className="hover:text-blue-700">{t.sitemap}</Link></li>
          <li><Link href={`/status?locale=${locale}`} className="hover:text-blue-700">{t.serviceStatus}</Link></li>
          <li><Link href={`/legal/terms?locale=${locale}`} className="hover:text-blue-700">{t.terms}</Link></li>
          <li><Link href={`/legal/privacy?locale=${locale}`} className="hover:text-blue-700">{t.privacy}</Link></li>
          <li><Link href={`/legal/cookies?locale=${locale}`} className="hover:text-blue-700">{t.cookies}</Link></li>
          <li><Link href={`/legal/dmca?locale=${locale}`} className="hover:text-blue-700">{t.dmca}</Link></li>
          <li><Link href={`/contact?locale=${locale}`} className="hover:text-blue-700">{t.contact}</Link></li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-50">{t.notes}</h2>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-gray-800 dark:text-slate-300 font-medium">{t.noteBody}</p>
      </section>
    </main>
  );
}
