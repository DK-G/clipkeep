'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics/gtag';
import type { Locale } from '@/lib/i18n/ui';

const t: Record<Locale, { share: string; copied: string; shareTitle: string; shareBody: string }> = {
  en: { share: 'Share', copied: 'Copied!', shareTitle: 'Share this clip', shareBody: 'Found on ClipKeep' },
  ja: { share: 'シェア', copied: 'コピー済み！', shareTitle: 'このクリップをシェア', shareBody: 'ClipKeepで見つけました' },
  ar: { share: 'مشاركة', copied: 'تم النسخ!', shareTitle: 'شارك هذا المقطع', shareBody: 'وجدت على ClipKeep' },
  es: { share: 'Compartir', copied: '¡Copiado!', shareTitle: 'Compartir este clip', shareBody: 'Encontrado en ClipKeep' },
  pt: { share: 'Compartilhar', copied: 'Copiado!', shareTitle: 'Compartilhar este clip', shareBody: 'Encontrado no ClipKeep' },
  fr: { share: 'Partager', copied: 'Copié !', shareTitle: 'Partager ce clip', shareBody: 'Trouvé sur ClipKeep' },
  id: { share: 'Bagikan', copied: 'Disalin!', shareTitle: 'Bagikan klip ini', shareBody: 'Ditemukan di ClipKeep' },
  hi: { share: 'शेयर करें', copied: 'कॉपी हो गया!', shareTitle: 'यह क्लिप शेयर करें', shareBody: 'ClipKeep पर मिला' },
  de: { share: 'Teilen', copied: 'Kopiert!', shareTitle: 'Diesen Clip teilen', shareBody: 'Gefunden auf ClipKeep' },
  tr: { share: 'Paylaş', copied: 'Kopyalandı!', shareTitle: 'Bu klibi paylaş', shareBody: "ClipKeep'te bulundu" },
};

interface ShareButtonProps {
  locale: Locale;
  platform: string;
  title?: string;
}

export function ShareButton({ locale, platform, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const dict = t[locale] || t.en;

  const handleShare = async () => {
    const url = window.location.href;
    const shareTitle = title || dict.shareTitle;
    const text = dict.shareBody;

    trackEvent('share_click', { platform, locale });

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text, url });
        trackEvent('share_native_success', { platform, locale });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent('share_copy_link', { platform, locale });
    } catch {
      // clipboard not available
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-500 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-semibold transition-all duration-200 group"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-600 dark:text-green-400">{dict.copied}</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {dict.share}
        </>
      )}
    </button>
  );
}
