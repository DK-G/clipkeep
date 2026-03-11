'use client';

export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { solutionPageText } from '@/lib/i18n/ui';

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

export default function SolutionPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const [data, setData] = useState<PageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const locale = 'en';
  const t = solutionPageText[locale as keyof typeof solutionPageText] || solutionPageText.en;

  useEffect(() => {
    if (!slug) return;

    const fetchPage = async () => {
      try {
        const res = await fetch(`/api/v1/solution-pages/${slug}?locale=${locale}`);
        const result = await res.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error?.message || 'Page not found');
        }
      } catch (err) {
        setError('Connection error');
      }
    };

    fetchPage();
  }, [slug]);

  if (error) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{t.errorTitle}</h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <button onClick={() => router.push('/')} className="text-blue-600 hover:underline">
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
      <header className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-4">{data.title}</h1>
        <button onClick={() => router.push('/')} className="text-blue-600 hover:underline">
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
            onClick={() => router.push(data.cta.url)}
            className="px-10 py-4 bg-white text-blue-900 rounded-2xl font-bold text-lg hover:bg-gray-100 transition shadow-xl"
          >
            {t.getStarted}
          </button>
        </div>
      </main>
    </div>
  );
}
