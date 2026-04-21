'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { normalizeLocale, homeText, menuText } from '@/lib/i18n/ui';
import { useHistory } from '@/hooks/use-history';
import { PlatformIcon } from '@/components/platform-icons';
import type { Platform } from '@/lib/extract/types';

const ui = {
  en: { empty: 'No downloads yet', emptyBody: 'Videos you extract will appear here so you can quickly reopen them.', openAgain: 'Open again' },
  ja: { empty: 'まだダウンロード履歴がありません', emptyBody: '抽出した動画がここに表示され、すぐに再アクセスできます。', openAgain: '再度開く' },
  ar: { empty: 'لا توجد تنزيلات بعد', emptyBody: 'ستظهر هنا مقاطع الفيديو التي تستخرجها لتتمكن من إعادة فتحها بسرعة.', openAgain: 'فتح مرة أخرى' },
  es: { empty: 'Aún no hay descargas', emptyBody: 'Los videos que extraigas aparecerán aquí para que puedas reabrirlos rápidamente.', openAgain: 'Abrir de nuevo' },
  pt: { empty: 'Nenhum download ainda', emptyBody: 'Os vídeos que você extrair aparecerão aqui para reabrir rapidamente.', openAgain: 'Abrir novamente' },
  fr: { empty: 'Aucun téléchargement encore', emptyBody: 'Les vidéos que vous extrayez apparaîtront ici pour les rouvrir rapidement.', openAgain: 'Ouvrir à nouveau' },
  id: { empty: 'Belum ada unduhan', emptyBody: 'Video yang Anda ekstrak akan muncul di sini agar bisa dibuka kembali dengan cepat.', openAgain: 'Buka lagi' },
  hi: { empty: 'अभी तक कोई डाउनलोड नहीं', emptyBody: 'आपके द्वारा निकाले गए वीडियो यहाँ दिखेंगे ताकि आप उन्हें जल्दी से फिर से खोल सकें।', openAgain: 'फिर से खोलें' },
  de: { empty: 'Noch keine Downloads', emptyBody: 'Hier erscheinen extrahierte Videos, damit Sie sie schnell erneut öffnen können.', openAgain: 'Erneut öffnen' },
  tr: { empty: 'Henüz indirme yok', emptyBody: 'Çıkardığınız videolar burada görünecek, böylece hızlıca yeniden açabilirsiniz.', openAgain: 'Tekrar aç' },
} as const;

function formatDate(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export function HistoryPageContent() {
  const searchParams = useSearchParams();
  const locale = normalizeLocale(searchParams.get('locale'));
  const { history, clearHistory } = useHistory();
  const home = homeText[locale] || homeText.en;
  const menu = menuText[locale] || menuText.en;
  const t = ui[locale] || ui.en;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">{home.historyTitle}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{menu.latest}</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-xs font-semibold text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-lg px-3 py-1.5 transition-colors"
          >
            {home.clearHistory}
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="text-5xl mb-4">📂</div>
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">{t.empty}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-2 max-w-xs mx-auto">{t.emptyBody}</p>
          <Link
            href={`/?locale=${locale}`}
            className="mt-6 inline-block bg-blue-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-blue-700 transition-colors"
          >
            {menu.downloads}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {history.map((item) => (
            <Link
              key={item.id}
              href={`/result/${item.id}?locale=${locale}`}
              className="group relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-video relative bg-slate-100 dark:bg-slate-950 overflow-hidden">
                <Image
                  src={item.thumbnail_url || '/placeholder-video.png'}
                  alt={item.title || 'Video thumbnail'}
                  fill
                  unoptimized
                  className="object-cover transition duration-300 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-video.png'; }}
                />
                <div className="absolute bottom-1 right-1">
                  <div className="bg-slate-950/70 rounded-sm px-1.5 py-0.5 flex items-center justify-center">
                    <PlatformIcon platform={item.platform as Platform} className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-2.5">
                {item.title && (
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug mb-1">{item.title}</p>
                )}
                <p className="text-[10px] text-slate-400 dark:text-slate-500">{formatDate(item.created_at, locale)}</p>
                <span className="mt-1.5 inline-block text-[10px] font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                  {t.openAgain} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
