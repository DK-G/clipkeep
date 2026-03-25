'use client';

import { Locale, resultText } from '@/lib/i18n/ui';
import type { MediaVariant } from '@/lib/api/types';
import type { Platform } from '@/lib/extract/types';
import { isSafeSourceUrl } from '@/lib/utils/url-safety';
import { PlatformIcon } from '@/components/platform-icons';
import { trackEvent } from '@/lib/analytics/gtag';

interface DownloadItemProps {
  variant: MediaVariant;
  locale: Locale;
  sourceUrl?: string;
  platform: Platform;
}

const mediaTypeLabels: Record<Locale, Record<string, string>> = {
  en: { video: 'Video', image: 'Image', audio: 'Audio', file: 'File' },
  ar: { video: 'فيديو', image: 'صورة', audio: 'صوت', file: 'ملف' },
  ja: { video: '動画', image: '画像', audio: '音声', file: 'ファイル' },
  es: { video: 'Video', image: 'Imagen', audio: 'Audio', file: 'Archivo' },
  pt: { video: 'Vídeo', image: 'Imagem', audio: 'Áudio', file: 'Arquivo' },
  fr: { video: 'Vidéo', image: 'Image', audio: 'Audio', file: 'Fichier' },
  id: { video: 'Video', image: 'Gambar', audio: 'Audio', file: 'Berkas' },
  hi: { video: 'वीडियो', image: 'छवि', audio: 'ऑडियो', file: 'फ़ाइल' },
  de: { video: 'Video', image: 'Bild', audio: 'Audio', file: 'Datei' },
  tr: { video: 'Video', image: 'Görsel', audio: 'Ses', file: 'Dosya' },
};

export function DownloadItem({ variant, locale, sourceUrl, platform }: DownloadItemProps) {
  const t = resultText[locale];
  const mediaLabels = mediaTypeLabels[locale] || mediaTypeLabels.en;

  const showPostButton = isSafeSourceUrl(sourceUrl, platform);

  const handlePostClick = () => {
    trackEvent('result_post_click', {
      platform,
      locale,
      has_source_url: !!sourceUrl,
      media_type: variant.type,
      quality: variant.quality
    });
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getLabel = () => {
    const parts = [];
    if (variant.quality) parts.push(variant.quality);
    if (variant.ext) parts.push(variant.ext.toUpperCase());
    const sizeStr = formatSize(variant.size);
    if (sizeStr) parts.push(sizeStr);
    
    return parts.length > 0 ? parts.join(' • ') : t.download;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow gap-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 dark:text-slate-100 uppercase">
          {mediaLabels[variant.type] || variant.type}
        </span>
        <span className="text-xs text-gray-500 dark:text-slate-400">
          {getLabel()}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        {showPostButton && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handlePostClick}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
          >
            <PlatformIcon platform={platform} className="w-4 h-4" />
            {t.sourcePost}
          </a>
        )}
        <a
          href={variant.url}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {t.download}
        </a>
      </div>
    </div>
  );
}

