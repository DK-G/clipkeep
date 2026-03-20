'use client';

import { useRouter } from 'next/navigation';
import { solutionText, localeDir, type Locale } from '@/lib/i18n/ui';
import type { SolutionPage as PageData } from '@/lib/solution-pages/store';

interface Props {
  data: PageData;
  locale: Locale;
}

export function SolutionContentClient({ data, locale }: Props) {
  const router = useRouter();
  const dir = localeDir(locale);
  const t = solutionText[locale] || solutionText.en;

  const buildUrlWithLocale = (path: string) => {
    return `${path}?locale=${locale}`;
  };

  return (
    <div dir={dir} className="max-w-4xl mx-auto p-4 sm:p-8">
      <header className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 dark:text-blue-400 mb-4">{data.title}</h1>
        <button onClick={() => router.push(buildUrlWithLocale('/'))} className="text-blue-600 hover:underline">
          {t.backToHome}
        </button>
      </header>

      <main className="space-y-12">
        {data.sections.map((section, idx) => (
          <section key={idx} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-6">{section.heading}</h2>
            <div className="prose prose-blue dark:prose-invert max-w-none text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {section.body}
            </div>
          </section>
        ))}

        <div className="bg-blue-900 rounded-3xl p-10 text-center text-white">
          <h3 className="text-2xl font-bold mb-6">{data.cta.label}</h3>
          <button 
            onClick={() => router.push(buildUrlWithLocale(data.cta.href))}
            className="px-10 py-4 bg-white text-blue-900 rounded-2xl font-bold text-lg hover:bg-gray-100 transition shadow-xl"
          >
            {t.getStarted}
          </button>
        </div>
      </main>
    </div>
  );
}
