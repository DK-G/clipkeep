'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { resultText, localeDir, Locale } from '@/lib/i18n/ui';
import type { ApiSuccess, ApiFailure, ExtractionResult } from '@/lib/api/types';
import type { Platform } from '@/lib/extract/types';
import { AdsterraNative } from '@/components/ads/native-banner';
import { DownloadItem } from '@/components/download-item';
import { GallerySection } from '@/components/gallery-section';
import { PlatformIcon } from '@/components/platform-icons';

interface ResultClientProps {
  jobId: string;
  locale: Locale;
  initialData: ExtractionResult | null;
}

export function ResultClient({ jobId, locale, initialData }: ResultClientProps) {
  const router = useRouter();
  const t = resultText[locale] || resultText.en;
  const dir = localeDir(locale);

  const [data, setData] = useState<ExtractionResult | null>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!initialData || (initialData.status !== 'completed' && initialData.status !== 'failed'));

  useEffect(() => {
    if (!jobId || (data?.status === 'completed' || data?.status === 'failed')) return;

    let pollInterval: NodeJS.Timeout;

    async function fetchResult() {
      try {
        const res = await fetch(`/api/v1/extract/jobs/${jobId}`);
        const json = (await res.json()) as ApiSuccess<ExtractionResult> | ApiFailure;

        if (json.ok) {
          setData(json.data);
          if (json.data.status === 'completed' || json.data.status === 'failed') {
            setLoading(false);
            if (json.data.status === 'failed') setError(t.errorTitle);
          } else {
            pollInterval = setTimeout(fetchResult, 2000);
          }
        } else {
          setError(json.error.message || t.errorTitle);
          setLoading(false);
        }
      } catch {
        setError(t.errorTitle);
        setLoading(false);
      }
    }

    fetchResult();
    return () => clearTimeout(pollInterval);
  }, [jobId, t.errorTitle, data?.status]);

  // Record access once job is completed
  useEffect(() => {
    if (data?.status !== 'completed' || !jobId) return;

    // Use a sessionStorage flag to avoid double-counting in the same session tab
    const storageKey = `recorded_${jobId}`;
    if (sessionStorage.getItem(storageKey)) return;

    const recordAccess = async () => {
      try {
        await fetch(`/api/v1/gallery/access/${jobId}?locale=${locale}`, { method: 'POST' });
        sessionStorage.setItem(storageKey, 'true');
      } catch (err) {
        console.error('Failed to record access:', err);
      }
    };

    recordAccess();
  }, [jobId, data?.status, locale]);

  if (loading && !data) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.loadingTitle}</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">{t.loadingSubtitle}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">!</div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.errorTitle}</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-md mx-auto">{error}</p>
        
        {data?.warnings && data.warnings.length > 0 && (
          <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-xl text-left max-w-2xl mx-auto">
             <ul className="text-amber-700 dark:text-amber-300 text-sm space-y-1 list-disc list-inside">
               {data.warnings.map((w, i) => <li key={i}>{w}</li>)}
             </ul>
          </div>
        )}

        <button onClick={() => router.back()} className="mt-8 px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-bold shadow-lg">
          {t.backToDownloader}
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6" dir={dir}>
      <header className="mb-8">
        <Link href={`/download-${data.platform}-video?locale=${locale}`} className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-2">
          ← {t.backToDownloader}
        </Link>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Preview Area */}
        <div className="lg:col-span-5">
           <div className="sticky top-24">
              <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                 <div className="aspect-video sm:aspect-[4/5] relative bg-slate-100 dark:bg-slate-950">
                    <Image
                      src={data.thumbnail_url || '/placeholder-video.png'}
                      alt={t.mediaTitle}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(min-width: 1024px) 40vw, 100vw"
                    />
                    {data.status === 'processing' && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-8 text-center">
                         <div className="animate-spin w-8 h-8 border-3 border-white border-t-transparent rounded-full mb-4"></div>
                         <p className="text-white font-bold">{t.loadingTitle}...</p>
                      </div>
                    )}
                 </div>
                 
                 <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-slate-900 dark:bg-slate-800 p-2 rounded-lg text-white">
                           <PlatformIcon platform={data.platform as Platform} className="w-5 h-5" />
                        </div>
                       <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight truncate max-w-[200px]">
                            {data.author_name || t.unknownAuthor}
                          </p>
                          <p className="text-xs text-slate-500">@{data.author_handle || 'source'}</p>
                       </div>
                    </div>
                    {data.title && (
                      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight line-clamp-2">
                        {data.title}
                      </h2>
                    )}
                 </div>
              </div>
           </div>
        </div>

        {/* Action Area */}
        <div className="lg:col-span-7">
           <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                {data.status === 'completed' ? t.successSubtitle : t.loadingTitle}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">{t.downloadDescription}</p>
           </div>

           <div className="space-y-4">
              {data.variants.map((variant, idx) => (
                <DownloadItem 
                  key={idx}
                  variant={variant}
                  locale={locale}
                  sourceUrl={data.source_url}
                  platform={data.platform as Platform}
                />
              ))}
           </div>

           <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-900">
              <AdsterraNative />
           </div>
        </div>

        {data.warnings.length > 0 && (
          <div className="lg:col-span-12 mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-xl">
            <h3 className="text-amber-800 dark:text-amber-200 font-bold mb-2 flex items-center gap-2">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
               {t.warningsTitle}
            </h3>
            <ul className="text-amber-700 dark:text-amber-300 text-sm space-y-1 list-disc list-inside">
              {data.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <div className="mt-16">
        <GallerySection 
          platform={data.platform as Platform}
          locale={locale}
          title={t.recommendedClips}
          type="trending"
          layout="carousel"
          hideMeta={true}
          limit={10}
        />
      </div>
    </div>
  );
}


