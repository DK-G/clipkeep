'use client';

import Link from 'next/link';
import { statusText, normalizeLocale, localeDir } from '@/lib/i18n/ui';

interface Props {
  localeParam?: string;
}

export function StatusContentClient({ localeParam }: Props) {
  const locale = normalizeLocale(localeParam);
  const dir = localeDir(locale);
  const t = statusText[locale];

  return (
    <main dir={dir} className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-50 mb-6">{t.title}</h1>
      <p className="text-xl text-slate-700 dark:text-slate-300 mb-8">
        {t.liveHealth}: <Link href="/api/v1/health" className="text-blue-600 dark:text-blue-400 hover:underline">/api/v1/health</Link>
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">{t.currentTitle}</h2>
      <p className="text-slate-700 dark:text-slate-300 mb-8">{t.currentBody}</p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">{t.incidentTitle}</h2>

      <div className="space-y-4">
        <section className="border border-gray-100 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400 mb-2">{t.partialDegradation.title}</h3>
          <p className="text-slate-700 dark:text-slate-300 mb-2">{t.partialDegradation.body}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 italic">{t.partialDegradation.nextUpdate}</p>
        </section>

        <section className="border border-gray-100 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2">{t.scheduledMaintenance.title}</h3>
          <p className="text-slate-700 dark:text-slate-300 mb-2">{t.scheduledMaintenance.body}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 italic">{t.scheduledMaintenance.window}</p>
        </section>

        <section className="border border-gray-100 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="text-lg font-bold text-red-900 dark:text-red-400 mb-2">{t.majorOutage.title}</h3>
          <p className="text-slate-700 dark:text-slate-300 mb-2">{t.majorOutage.body}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 italic">{t.majorOutage.nextUpdate}</p>
        </section>
      </div>
    </main>
  );
}
