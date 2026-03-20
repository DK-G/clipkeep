'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { normalizeLocale } from '@/lib/i18n/ui';

function NotFoundContent() {
  const searchParams = useSearchParams();
  const locale = normalizeLocale(searchParams.get('locale'));
  
  const dict = {
    en: { title: '404 - Page Not Found', message: 'The page you are looking for does not exist or has been moved.', back: 'Back to Home' },
    ja: { title: '404 - ページが見つかりません', message: 'お探しのページは存在しないか、移動した可能性があります。', back: 'ホームに戻る' },
    ar: { title: '404 - الصفحة غير موجودة', message: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.', back: 'العودة للرئيسية' },
    es: { title: '404 - Página no encontrada', message: 'La página que buscas no existe o ha sido movida.', back: 'Volver al inicio' },
    pt: { title: '404 - Página não encontrada', message: 'A página que você está procurando não existe ou foi movida.', back: 'Voltar para o início' },
    fr: { title: '404 - Page non trouvée', message: 'La page que vous recherchez n\'existe pas ou a été déplacée.', back: 'Retour à l\'accueil' },
    id: { title: '404 - Halaman Tidak Ditemukan', message: 'Halaman yang Anda cari tidak ada atau telah dipindahkan.', back: 'Kembali ke Beranda' },
    hi: { title: '404 - पृष्ठ नहीं मिला', message: 'आप जो पृष्ठ ढूंढ रहे हैं वह मौजूद नहीं है या हटा दिया गया है।', back: 'होम पर वापस जाएं' },
    de: { title: '404 - Seite nicht gefunden', message: 'Die gesuchte Seite existiert nicht oder wurde verschoben.', back: 'Zurück zur Startseite' },
    tr: { title: '404 - Sayfa Bulunamadı', message: 'Aradığınız sayfa mevcut değil veya taşınmış.', back: 'Ana Sayfaya Dön' },
  };

  const t = dict[locale] || dict.en;

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{t.title}</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
        {t.message}
      </p>
      <Link 
        href={`/?locale=${locale}`}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
      >
        {t.back}
      </Link>
    </main>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <NotFoundContent />
    </Suspense>
  );
}
