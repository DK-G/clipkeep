'use client';

import { aboutText, normalizeLocale, localeDir } from '@/lib/i18n/ui';

interface Props {
  localeParam?: string;
}

export function AboutContentClient({ localeParam }: Props) {
  const locale = normalizeLocale(localeParam);
  const dir = localeDir(locale);
  const t = aboutText[locale] || aboutText.en;

  return (
    <main dir={dir} className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-50 mb-6 tracking-tight">{t.title}</h1>
        <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">{t.body}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-6">{t.visionTitle}</h2>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-lg">{t.visionBody}</p>
        </section>

        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-6">{t.whyUsTitle}</h2>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-lg">{t.whyUsBody}</p>
        </section>
      </div>

      <div className="mt-16 bg-blue-50 dark:bg-blue-900/20 p-8 rounded-3xl text-center border border-blue-100 dark:border-blue-800/50">
        <p className="text-blue-800 dark:text-blue-300 font-semibold tracking-wide uppercase text-sm">{t.projectNote}</p>
      </div>
    </main>
  );
}

