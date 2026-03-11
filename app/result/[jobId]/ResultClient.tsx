'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { resultPageText } from '@/lib/i18n/ui';

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
  }>;
  warnings?: string[];
};

export default function ResultClient() {
  const params = useParams();
  const jobId = params.jobId as string;
  const router = useRouter();
  const [data, setData] = useState<JobData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const locale = 'en'; // Simple default for now
  const t = resultPageText[locale as keyof typeof resultPageText] || resultPageText.en;

  useEffect(() => {
    if (!jobId) return;

    let timer: NodeJS.Timeout;

    const poll = async () => {
      try {
        const res = await fetch(`/api/v1/extract/jobs/${jobId}`);
        const result = await res.json();

        if (result.success) {
          setData(result.data);
          if (result.data.status !== 'completed' && result.data.status !== 'failed') {
            timer = setTimeout(poll, 2000);
          }
        } else {
          setError(result.error?.message || 'Failed to fetch job');
        }
      } catch (err) {
        setError('Connection error');
      }
    };

    poll();
    return () => clearTimeout(timer);
  }, [jobId]);

  if (error) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{t.errorTitle}</h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {t.backToHome}
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center animate-pulse">
        <p className="text-gray-500">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-900">ClipKeep</h1>
        <button onClick={() => router.push('/')} className="text-blue-600 hover:underline">
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
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700">{t.mediaTitle}</h3>
            <div className="grid gap-4">
              {data.media.map((item) => (
                <div key={item.mediaId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{item.type}</p>
                    <p className="text-sm text-gray-500">{item.quality}</p>
                  </div>
                  <a 
                    href={item.downloadUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    {t.download}
                  </a>
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
    </div>
  );
}
