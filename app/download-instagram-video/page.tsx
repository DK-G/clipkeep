'use client';

import { useSearchParams } from 'next/navigation';
import { normalizeLocale, localeDir } from '@/lib/i18n/ui';
import { AdsterraNative } from '@/components/ads/native-banner';
import { Suspense } from 'react';

function InstagramDownloaderContent() {
  const searchParams = useSearchParams();
  const locale = normalizeLocale(searchParams.get('locale'));
  const dir = localeDir(locale);

  const texts = {
    en: {
      title: "Instagram Downloader",
      subtitle: "Save Reels, Stories, and Photos from Instagram.",
      comingSoon: "Infrastructure setup in progress. Feature coming soon!",
    },
    ar: {
      title: "محمل إنستغرام",
      subtitle: "احفظ الريلز، والقصص، والصور من إنستغرام.",
      comingSoon: "نحن نعمل على إعداد البنية التحتية. الميزة قادمة قريبًا!",
    },
    ja: {
      title: "Instagram 保存",
      subtitle: "Instagramのリール、ストーリー、写真を保存します。",
      comingSoon: "現在準備中です。近日公開予定！",
    },
    es: {
      title: "Descargador de Instagram",
      subtitle: "Guarda Reels, Stories y fotos de Instagram.",
      comingSoon: "Configuración de infraestructura en progreso. ¡Próximamente disponible!",
    },
    pt: {
      title: "Downloader do Instagram",
      subtitle: "Salve Reels, Stories e fotos do Instagram.",
      comingSoon: "Configuração de infraestrutura em andamento. Recurso em breve!",
    },
    fr: {
      title: "Téléchargeur Instagram",
      subtitle: "Enregistrez des Reels, des Stories et des photos d'Instagram.",
      comingSoon: "Configuration de l'infrastructure en cours. Fonctionnalité bientôt disponible !",
    },
    id: {
      title: "Pengunduh Instagram",
      subtitle: "Simpan Reel, Cerita, dan Foto dari Instagram.",
      comingSoon: "Penyiapan infrastruktur sedang berlangsung. Fitur segera hadir!",
    },
    hi: {
      title: "इंस्टाग्राम डाउनलोडर",
      subtitle: "इंस्टाग्राम से रील्स, स्टोरीज़ और फ़ोटो सेव करें।",
      comingSoon: "इन्फ्रास्ट्रक्चर सेटअप प्रगति पर है। सुविधा जल्द ही आ रही है!",
    },
    de: {
      title: "Instagram Downloader",
      subtitle: "Speichere Reels, Stories und Fotos von Instagram.",
      comingSoon: "Infrastruktur-Setup läuft. Funktion bald verfügbar!",
    },
    tr: {
      title: "Instagram İndirici",
      subtitle: "Instagram'dan Reels, Hikayeler ve Fotoğraflar kaydedin.",
      comingSoon: "Altyapı kurulumu devam ediyor. Özellik yakında geliyor!",
    }
  };

  const t = texts[locale];

  return (
    <div dir={dir} className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="min-h-[40vh] flex flex-col justify-center text-center py-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">{t.title}</h1>
        <p className="text-xl text-gray-600 mb-8">{t.subtitle}</p>
        
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl max-w-2xl mx-auto">
          <p className="text-blue-800 font-medium">{t.comingSoon}</p>
        </div>
      </div>

      <div className="grid gap-12 mt-12 border-t border-gray-100 pt-12">
        <section className="text-left">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {locale === 'ja' ? 'Instagram保存機能について' : locale === 'ar' ? 'حول ميزة حفظ إنستغرام' : 'About Instagram Saving'}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            {locale === 'ja' 
              ? 'ClipKeepでは現在、Instagramのリールやストーリーを高品質で保存できる専用ツールの開発を進めています。近日中に公開予定ですので、今しばらくお待ちください。' 
              : locale === 'ar' 
              ? 'تعمل ClipKeep حاليًا على تطوير أداة مخصصة لحفظ ريلز وقصص إنستغرام بجودة عالية. سيتم إطلاقها قريبًا!' 
              : 'ClipKeep is currently developing a dedicated tool for saving Instagram Reels and Stories in high quality. It will be available very soon!'}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <a href={`/download-telegram-video?locale=${locale}`} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition border border-gray-100">
              <span className="font-bold block text-blue-900">Telegram Downloader</span>
              <span className="text-sm text-gray-500">{locale === 'ja' ? 'Telegramのメディアを保存' : 'Save Telegram media'}</span>
            </a>
            <a href={`/download-twitter-video?locale=${locale}`} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition border border-gray-100">
              <span className="font-bold block text-blue-900">Twitter (X) Downloader</span>
              <span className="text-sm text-gray-500">{locale === 'ja' ? 'Xの動画やGIFを保存' : 'Save X videos & GIFs'}</span>
            </a>
          </div>
        </section>

        <section className="text-left bg-gray-50 p-6 sm:p-10 rounded-3xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">FAQ</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                {locale === 'ja' ? 'ログインは必要ですか？' : locale === 'ar' ? 'هل يحتاج تسجيل دخول؟' : 'Is login required?'}
              </h3>
              <p className="text-gray-600 text-sm">
                {locale === 'ja' ? 'いいえ、ClipKeepではログイン情報は一切求めません。' : locale === 'ar' ? 'لا، لا تطلب ClipKeep أي معلومات دخول.' : 'No, ClipKeep never asks for login credentials.'}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                {locale === 'ja' ? 'リール動画は保存できますか？' : locale === 'ar' ? 'هل يمكن حفظ الريلز؟' : 'Can I save Reels?'}
              </h3>
              <p className="text-gray-600 text-sm">
                {locale === 'ja' ? 'はい、正式リリース時にはリール動画の高品質ダウンロードをフルサポート予定です。' : locale === 'ar' ? 'نعم، سيدعم التحديث الرسمي تنزيل الريلز بجودة عالية.' : 'Yes, the official release will fully support high-quality Reel downloads.'}
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12">
        <AdsterraNative />
      </div>
    </div>
  );
}

export default function InstagramDownloaderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-400">Loading...</div>}>
      <InstagramDownloaderContent />
    </Suspense>
  );
}
