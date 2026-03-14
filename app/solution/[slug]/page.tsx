'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { solutionText, normalizeLocale, localeDir } from '@/lib/i18n/ui';
import type { ApiSuccess, ApiFailure } from '@/lib/api/types';

type Section = {
  title: string;
  content: string;
};

type PageData = {
  slug: string;
  locale: string;
  title: string;
  sections: Section[];
  cta: {
    text: string;
    url: string;
  };
};

function SolutionContent() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const locale = normalizeLocale(searchParams.get('locale'));
  const dir = localeDir(locale);
  const t = solutionText[locale];

  const [data, setData] = useState<PageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buildUrlWithLocale = (path: string) => {
    return `${path}?locale=${locale}`;
  };

  useEffect(() => {
    if (!slug) return;

    const fetchPage = async () => {
      try {
        const res = await fetch(`/api/v1/solution-pages/${slug}?locale=${locale}`);
        const result = (await res.json()) as ApiSuccess<PageData> | ApiFailure;

        if (result.ok) {
          setData(result.data);
        } else {
          setError(result.error?.message || 'Page not found');
        }
      } catch {
        setError('Connection error');
      }
    };

    fetchPage();
  }, [slug, locale]);

  if (error) {
    return (
      <div dir={dir} className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{t.errorTitle}</h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <button onClick={() => router.push(buildUrlWithLocale('/'))} className="text-blue-600 hover:underline">
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
      <header className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-4">{data.title}</h1>
        <button onClick={() => router.push(buildUrlWithLocale('/'))} className="text-blue-600 hover:underline">
          {t.backToHome}
        </button>
      </header>

      <main className="space-y-12">
        {data.sections.map((section, idx) => (
          <section key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{section.title}</h2>
            <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
              {section.content}
            </div>
          </section>
        ))}

        <div className="bg-blue-900 rounded-3xl p-10 text-center text-white">
          <h3 className="text-2xl font-bold mb-6">{data.cta.text}</h3>
          <button 
            onClick={() => router.push(buildUrlWithLocale(data.cta.url))}
            className="px-10 py-4 bg-white text-blue-900 rounded-2xl font-bold text-lg hover:bg-gray-100 transition shadow-xl"
          >
            {t.getStarted}
          </button>
        </div>
      </main>
    </div>
  );
}

export default function SolutionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SolutionContent />
    </Suspense>
  );
}

