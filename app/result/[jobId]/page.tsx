'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { resultText, normalizeLocale, localeDir } from '@/lib/i18n/ui';
import type { ApiSuccess, ApiFailure } from '@/lib/api/types';
import { AdsterraNative } from '@/components/ads/native-banner';

type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

type JobData = {
  jobId: string;
  status: JobStatus;
  progress?: number;
  media?: Array<{
    mediaId: string;
    type: string;
    quality: string;
    downloadUrl: string;
    expiresAt: string;
    thumbUrl?: string;
  }>;
  warnings?: string[];
};

function ResultContent() {
  const params = useParams();
  const jobId = params.jobId as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const locale = normalizeLocale(searchParams.get('locale'));
  const dir = localeDir(locale);
  const t = resultText[locale];

  const [data, setData] = useState<JobData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buildUrlWithLocale = (path: string) => {
    return `${path}?locale=${locale}`;
  };

  useEffect(() => {
    if (!jobId) return;

    let timer: NodeJS.Timeout;

    const poll = async () => {
      try {
        const res = await fetch(`/api/v1/extract/jobs/${jobId}`);
        const result = (await res.json()) as ApiSuccess<JobData> | ApiFailure;

        if (result.ok) {
          setData(result.data);
          if (result.data.status !== 'completed' && result.data.status !== 'failed') {
            timer = setTimeout(poll, 2000);
          }
        } else {
          setError(result.error?.message || 'Failed to fetch job');
        }
      } catch {
        setError('Connection error');
      }
    };

    poll();
    return () => clearTimeout(timer);
  }, [jobId]);

  if (error) {
    return (
      <div dir={dir} className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{t.errorTitle}</h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <button 
          onClick={() => router.push(buildUrlWithLocale('/'))}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {t.backToHome}
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div dir={dir} className="p-8 text-center animate-pulse">
        <p className="text-gray-500">{t.loading}</p>
      </div>
    );
  }

  return (
    <div dir={dir} className="max-w-4xl mx-auto p-4 sm:p-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-900">ClipKeep</h1>
        <button onClick={() => router.push(buildUrlWithLocale('/'))} className="text-blue-600 hover:underline">
          {t.backToHome}
        </button>
      </header>

      <main className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-800">{t.statusTitle}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              data.status === 'completed' ? 'bg-green-100 text-green-700' :
              data.status === 'failed' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {t.states[data.status as keyof typeof t.states] || data.status}
            </span>
          </div>
          {data.status !== 'completed' && data.status !== 'failed' && (
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${data.progress || 10}%` }}
              ></div>
            </div>
          )}
        </div>

        {data.status === 'completed' && data.media && data.media.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-lg font-medium text-gray-700">{t.mediaTitle} ({data.media.length})</h3>
            <div className="grid gap-6">
              {data.media.map((item) => (
                <div key={item.mediaId} className="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden transition-all hover:shadow-md">
                  <div className="flex flex-col sm:flex-row">
                    {item.thumbUrl && (
                      <div className="w-full sm:w-48 h-32 bg-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={item.thumbUrl} 
                          alt="Thumbnail" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div className="mb-4 sm:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-gray-900 capitalize">{item.type}</p>
                          <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-md uppercase font-semibold">
                            {item.quality}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">ID: {item.mediaId}</p>
                      </div>
                      <div className="flex justify-end mt-2">
                        <a 
                          href={`/api/v1/extract/proxy?url=${encodeURIComponent(item.downloadUrl)}`} 
                          download
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto text-center px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-200 active:transform active:scale-95"
                        >
                          {t.download}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.status === 'completed' && data.warnings && data.warnings.length > 0 && (
          <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
            <p className="text-sm text-yellow-800 font-medium mb-1">Notice</p>
            <ul className="list-disc list-inside text-xs text-yellow-700 space-y-1">
              {data.warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}
      </main>

      <div className="mt-8">
        <AdsterraNative />
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}

