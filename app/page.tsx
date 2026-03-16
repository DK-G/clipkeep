import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale, normalizeLocale } from '@/lib/i18n/ui';

export const metadata: Metadata = {
  title: 'ClipKeep Home | SNS Downloader Hub',
  description: 'ClipKeep home hub for Twitter, Telegram, and TikTok downloader tools, weekly ranking, and recent downloads.',
  alternates: {
    canonical: '/',
  },
};

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
    weeklyRanking: 'Weekly Ranking',
    recentDownloads: 'Recent Downloads',
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
    toolsFeeds: 'SNS Tools & Feeds',
    downloader: 'Downloader',
    weeklyRanking: 'Weekly Ranking',
    recentDownloads: 'Recent Downloads',
    siteInfo: 'Site Information',
    notes: 'Notes',
    noteBody: 'トップページでは抽出機能を提供しません。抽出は各専用ダウンローダーページから行ってください。',
    sitemap: 'Sitemap',
    serviceStatus: 'Service Status',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    cookies: 'Cookie Policy',
    dmca: 'DMCA / Copyright',
    contact: 'Contact',
  },
  ar: {
    intro: 'هذه صفحة التوجيه لأدوات تنزيل فيديوهات SNS. اختر الصفحة المناسبة حسب الهدف.',
    toolsFeeds: 'الأدوات والخلاصات',
    downloader: 'أداة التنزيل',
    weeklyRanking: 'الترتيب الأسبوعي',
    recentDownloads: 'أحدث التنزيلات',
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
    weeklyRanking: 'Ranking semanal',
    recentDownloads: 'Descargas recientes',
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
    downloader: 'Downloader',
    weeklyRanking: 'Ranking semanal',
    recentDownloads: 'Downloads recentes',
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
    weeklyRanking: 'Classement hebdomadaire',
    recentDownloads: 'Téléchargements récents',
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
    weeklyRanking: 'Peringkat mingguan',
    recentDownloads: 'Unduhan terbaru',
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
    weeklyRanking: 'साप्ताहिक रैंकिंग',
    recentDownloads: 'हालिया डाउनलोड',
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
    weeklyRanking: 'Wochenranking',
    recentDownloads: 'Neueste Downloads',
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
    weeklyRanking: 'Haftalık sıralama',
    recentDownloads: 'Son indirmeler',
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
  'block rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm sm:text-base font-medium text-gray-800 no-underline hover:border-blue-300 hover:bg-blue-50 transition';

const badgeClass =
  'inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs sm:text-sm font-semibold text-slate-700';

const sectionCardClass =
  'rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm';

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
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">ClipKeep</h1>
        <p className="mt-3 text-base sm:text-lg leading-relaxed text-gray-600">{t.intro}</p>
        <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
          <span className={badgeClass}>X (Twitter)</span>
          <span className={badgeClass}>TikTok</span>
          <span className={badgeClass}>Telegram</span>
        </div>
      </header>

      <section className="mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t.toolsFeeds}</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={sectionCardClass}>
            <h3 className="mb-3 text-lg font-bold text-gray-900">Telegram</h3>
            <div className="grid gap-2.5">
              <Link href={`/download-telegram-video?locale=${locale}`} className={cardClass}>{t.downloader}</Link>
              <Link href={`/telegram-trending-videos?locale=${locale}`} className={cardClass}>{t.weeklyRanking}</Link>
              <Link href={`/telegram-latest-videos?locale=${locale}`} className={cardClass}>{t.recentDownloads}</Link>
            </div>
          </div>

          <div className={sectionCardClass}>
            <h3 className="mb-3 text-lg font-bold text-gray-900">X (Twitter)</h3>
            <div className="grid gap-2.5">
              <Link href={`/download-twitter-video?locale=${locale}`} className={cardClass}>{t.downloader}</Link>
              <Link href={`/twitter-trending-videos?locale=${locale}`} className={cardClass}>{t.weeklyRanking}</Link>
              <Link href={`/twitter-latest-videos?locale=${locale}`} className={cardClass}>{t.recentDownloads}</Link>
            </div>
          </div>

          <div className={sectionCardClass}>
            <h3 className="mb-3 text-lg font-bold text-gray-900">TikTok</h3>
            <div className="grid gap-2.5">
              <Link href={`/download-tiktok-video?locale=${locale}`} className={cardClass}>{t.downloader}</Link>
              <Link href={`/tiktok-trending-videos?locale=${locale}`} className={cardClass}>{t.weeklyRanking}</Link>
              <Link href={`/tiktok-latest-videos?locale=${locale}`} className={cardClass}>{t.recentDownloads}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t.siteInfo}</h2>
        <ul className="mt-3 list-disc pl-5 leading-8 text-sm sm:text-base text-gray-700">
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
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t.notes}</h2>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-gray-600">{t.noteBody}</p>
      </section>
    </main>
  );
}
