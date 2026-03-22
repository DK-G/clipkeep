'use client';

import { Locale, resultText } from '@/lib/i18n/ui';

interface MediaVariant {
  url: string;
  quality: string;
  ext: string;
  size?: number;
  type: 'video' | 'image' | 'audio' | 'gif';
}

interface DownloadItemProps {
  variant: MediaVariant;
  jobId: string;
  locale: Locale;
}

export function DownloadItem({ variant, jobId, locale }: DownloadItemProps) {
  const t = resultText[locale];

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
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 dark:text-slate-100 uppercase">
          {variant.type}
        </span>
        <span className="text-xs text-gray-500 dark:text-slate-400">
          {getLabel()}
        </span>
      </div>
      
      <a
        href={variant.url}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {t.download}
      </a>
    </div>
  );
}
