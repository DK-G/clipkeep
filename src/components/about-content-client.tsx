'use client';

import Link from 'next/link';
import { aboutText, normalizeLocale, localeDir, type Locale } from '@/lib/i18n/ui';
import {
  TiktokIcon, TwitterXIcon, TelegramIcon, RedditIcon,
  FacebookIcon, PinterestIcon, ThreadsIcon, BlueskyIcon,
  BilibiliIcon, DiscordIcon, Lemon8Icon,
} from '@/components/platform-icons';
import { DOWNLOADER_MAP } from '@/lib/utils/downloader-map';

interface Props {
  localeParam?: string;
}

const PLATFORMS = [
  { id: 'tiktok',    Icon: TiktokIcon,    bg: 'bg-slate-950', label: 'TikTok'    },
  { id: 'twitter',   Icon: TwitterXIcon,  bg: 'bg-slate-900', label: 'X/Twitter' },
  { id: 'telegram',  Icon: TelegramIcon,  bg: 'bg-blue-400',  label: 'Telegram'  },
  { id: 'reddit',    Icon: RedditIcon,    bg: 'bg-orange-600',label: 'Reddit'    },
  { id: 'facebook',  Icon: FacebookIcon,  bg: 'bg-blue-600',  label: 'Facebook'  },
  { id: 'pinterest', Icon: PinterestIcon, bg: 'bg-red-600',   label: 'Pinterest' },
  { id: 'threads',   Icon: ThreadsIcon,   bg: 'bg-slate-900', label: 'Threads'   },
  { id: 'bluesky',   Icon: BlueskyIcon,   bg: 'bg-blue-400',  label: 'Bluesky'   },
  { id: 'bilibili',  Icon: BilibiliIcon,  bg: 'bg-pink-400',  label: 'Bilibili'  },
  { id: 'discord',   Icon: DiscordIcon,   bg: 'bg-indigo-500',label: 'Discord'   },
  { id: 'lemon8',    Icon: Lemon8Icon,    bg: 'bg-yellow-400',label: 'Lemon8'    },
] as const;

const sectionLabels: Record<Locale, {
  platforms: string;
  howTo: string;
  step1: string; step1Body: string;
  step2: string; step2Body: string;
  step3: string; step3Body: string;
  privacy: string; privacyBody: string;
}> = {
  en: {
    platforms: 'Supported Platforms',
    howTo: 'How to Use',
    step1: 'Paste a URL', step1Body: 'Copy the public post link from any supported platform and paste it into the extractor.',
    step2: 'Extract',     step2Body: 'ClipKeep processes the link and retrieves the best available media quality.',
    step3: 'Download',    step3Body: 'Save the media file directly to your device with one click.',
    privacy: 'Privacy Stance',
    privacyBody: 'ClipKeep only processes public links. No account linking, no personal data collection. We do not store your extracted media — files are served transiently.',
  },
  ja: {
    platforms: '対応プラットフォーム',
    howTo: '使い方',
    step1: 'URLを貼り付ける', step1Body: '対応SNSの公開投稿URLをコピーして、抽出フォームに貼り付けます。',
    step2: '抽出する',        step2Body: 'ClipKeep がリンクを処理し、利用可能な最高品質のメディアを取得します。',
    step3: 'ダウンロード',    step3Body: '1クリックでデバイスに直接保存できます。',
    privacy: 'プライバシー方針',
    privacyBody: 'ClipKeep が扱うのは公開リンクのみです。アカウント連携や個人情報の収集は行いません。抽出されたメディアは保存せず、一時的に提供されるのみです。',
  },
  ar: {
    platforms: 'المنصات المدعومة',
    howTo: 'كيفية الاستخدام',
    step1: 'الصق الرابط',    step1Body: 'انسخ رابط المنشور العام من أي منصة مدعومة والصقه في حقل الاستخراج.',
    step2: 'استخراج',        step2Body: 'يعالج ClipKeep الرابط ويسترد أفضل جودة وسائط متاحة.',
    step3: 'تنزيل',          step3Body: 'احفظ ملف الوسائط مباشرة على جهازك بنقرة واحدة.',
    privacy: 'سياسة الخصوصية',
    privacyBody: 'يعالج ClipKeep الروابط العامة فقط. لا ربط بالحسابات، ولا جمع للبيانات الشخصية. لا نخزن الوسائط المستخرجة.',
  },
  es: {
    platforms: 'Plataformas compatibles',
    howTo: 'Cómo usarlo',
    step1: 'Pega una URL',   step1Body: 'Copia el enlace público de cualquier plataforma compatible y pégalo en el extractor.',
    step2: 'Extraer',        step2Body: 'ClipKeep procesa el enlace y recupera la mejor calidad disponible.',
    step3: 'Descargar',      step3Body: 'Guarda el archivo directamente en tu dispositivo con un clic.',
    privacy: 'Política de privacidad',
    privacyBody: 'ClipKeep solo procesa enlaces públicos. Sin vinculación de cuentas ni recopilación de datos personales.',
  },
  pt: {
    platforms: 'Plataformas suportadas',
    howTo: 'Como usar',
    step1: 'Cole uma URL',   step1Body: 'Copie o link público de qualquer plataforma suportada e cole no extrator.',
    step2: 'Extrair',        step2Body: 'O ClipKeep processa o link e recupera a melhor qualidade disponível.',
    step3: 'Baixar',         step3Body: 'Salve o arquivo diretamente no seu dispositivo com um clique.',
    privacy: 'Política de privacidade',
    privacyBody: 'O ClipKeep processa apenas links públicos. Sem vinculação de contas ou coleta de dados pessoais.',
  },
  fr: {
    platforms: 'Plateformes prises en charge',
    howTo: 'Comment utiliser',
    step1: 'Collez une URL',  step1Body: 'Copiez le lien public de n\'importe quelle plateforme compatible et collez-le dans l\'extracteur.',
    step2: 'Extraire',        step2Body: 'ClipKeep traite le lien et récupère la meilleure qualité disponible.',
    step3: 'Télécharger',     step3Body: 'Enregistrez le fichier directement sur votre appareil en un clic.',
    privacy: 'Politique de confidentialité',
    privacyBody: 'ClipKeep ne traite que des liens publics. Aucune liaison de compte, aucune collecte de données personnelles.',
  },
  id: {
    platforms: 'Platform yang didukung',
    howTo: 'Cara penggunaan',
    step1: 'Tempel URL',     step1Body: 'Salin tautan publik dari platform mana pun yang didukung dan tempel di ekstraktor.',
    step2: 'Ekstrak',        step2Body: 'ClipKeep memproses tautan dan mengambil kualitas media terbaik yang tersedia.',
    step3: 'Unduh',          step3Body: 'Simpan file media langsung ke perangkat Anda dengan satu klik.',
    privacy: 'Kebijakan privasi',
    privacyBody: 'ClipKeep hanya memproses tautan publik. Tidak ada tautan akun atau pengumpulan data pribadi.',
  },
  hi: {
    platforms: 'समर्थित प्लेटफ़ॉर्म',
    howTo: 'उपयोग कैसे करें',
    step1: 'URL पेस्ट करें', step1Body: 'किसी भी समर्थित प्लेटफ़ॉर्म का सार्वजनिक लिंक कॉपी करें और एक्सट्रैक्टर में पेस्ट करें।',
    step2: 'एक्सट्रैक्ट',   step2Body: 'ClipKeep लिंक को प्रोसेस करता है और सर्वोत्तम गुणवत्ता का मीडिया प्राप्त करता है।',
    step3: 'डाउनलोड',       step3Body: 'एक क्लिक में मीडिया फ़ाइल सीधे अपने डिवाइस पर सेव करें।',
    privacy: 'गोपनीयता नीति',
    privacyBody: 'ClipKeep केवल सार्वजनिक लिंक प्रोसेस करता है। कोई अकाउंट लिंकिंग या व्यक्तिगत डेटा संग्रह नहीं।',
  },
  de: {
    platforms: 'Unterstützte Plattformen',
    howTo: 'Verwendung',
    step1: 'URL einfügen',   step1Body: 'Kopieren Sie den öffentlichen Link einer unterstützten Plattform und fügen Sie ihn in den Extraktor ein.',
    step2: 'Extrahieren',    step2Body: 'ClipKeep verarbeitet den Link und ruft die beste verfügbare Medienqualität ab.',
    step3: 'Herunterladen',  step3Body: 'Speichern Sie die Mediendatei mit einem Klick direkt auf Ihrem Gerät.',
    privacy: 'Datenschutz',
    privacyBody: 'ClipKeep verarbeitet nur öffentliche Links. Keine Kontoverknüpfung, keine Erfassung personenbezogener Daten.',
  },
  tr: {
    platforms: 'Desteklenen platformlar',
    howTo: 'Nasıl kullanılır',
    step1: 'URL yapıştır',   step1Body: 'Desteklenen herhangi bir platformdan genel gönderi bağlantısını kopyalayın ve çıkarıcıya yapıştırın.',
    step2: 'Çıkar',          step2Body: 'ClipKeep bağlantıyı işler ve mevcut en iyi medya kalitesini getirir.',
    step3: 'İndir',          step3Body: 'Medya dosyasını tek tıklamayla doğrudan cihazınıza kaydedin.',
    privacy: 'Gizlilik politikası',
    privacyBody: 'ClipKeep yalnızca genel bağlantıları işler. Hesap bağlama veya kişisel veri toplama yapılmaz.',
  },
};

export function AboutContentClient({ localeParam }: Props) {
  const locale = normalizeLocale(localeParam);
  const dir = localeDir(locale);
  const t = aboutText[locale] || aboutText.en;
  const s = sectionLabels[locale] || sectionLabels.en;

  return (
    <main dir={dir} className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-50 mb-6 tracking-tight">{t.title}</h1>
        <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">{t.body}</p>
      </div>

      {/* Vision / How it works */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-4">{t.visionTitle}</h2>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed">{t.visionBody}</p>
        </section>
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-4">{t.whyUsTitle}</h2>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed">{t.whyUsBody}</p>
        </section>
      </div>

      {/* Supported Platforms */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-8 text-center">{s.platforms}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {PLATFORMS.map(({ id, Icon, bg, label }) => (
            <Link
              key={id}
              href={`${DOWNLOADER_MAP[id]}${locale !== 'en' ? `?locale=${locale}` : ''}`}
              className="group flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${bg} shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon />
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How to Use */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-8 text-center">{s.howTo}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { num: '1', title: s.step1, body: s.step1Body, color: 'bg-indigo-600' },
            { num: '2', title: s.step2, body: s.step2Body, color: 'bg-blue-600'   },
            { num: '3', title: s.step3, body: s.step3Body, color: 'bg-emerald-600'},
          ].map(({ num, title, body, color }) => (
            <div key={num} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <div className={`w-10 h-10 ${color} text-white font-black text-lg rounded-xl flex items-center justify-center mb-4`}>{num}</div>
              <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-2">{title}</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Stance */}
      <section className="mb-16 bg-emerald-50 dark:bg-emerald-900/20 p-8 rounded-3xl border border-emerald-100 dark:border-emerald-800/50">
        <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mb-3">🔒 {s.privacy}</h2>
        <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">{s.privacyBody}</p>
        <Link href={`/legal/privacy${locale !== 'en' ? `?locale=${locale}` : ''}`} className="mt-4 inline-block text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
          Privacy Policy →
        </Link>
      </section>

      {/* Footer note */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-3xl text-center border border-blue-100 dark:border-blue-800/50">
        <p className="text-blue-800 dark:text-blue-300 font-semibold tracking-wide uppercase text-sm">{t.projectNote}</p>
      </div>
    </main>
  );
}
