'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Locale, homeText, normalizeLocale, localeNativeLabels } from '@/lib/i18n/ui';

const currentBadgeText: Record<Locale, string> = {
  en: 'Current',
  ar: 'الحالية',
  ja: '現在',
  es: 'Actual',
  pt: 'Atual',
  fr: 'Actuelle',
  id: 'Saat ini',
  hi: 'वर्तमान',
  de: 'Aktuell',
  tr: 'Geçerli',
};

const languageOptions: Array<{ code: Locale; label: string }> = [
  { code: 'en', label: localeNativeLabels.en },
  { code: 'ar', label: localeNativeLabels.ar },
  { code: 'ja', label: localeNativeLabels.ja },
  { code: 'es', label: localeNativeLabels.es },
  { code: 'pt', label: localeNativeLabels.pt },
  { code: 'fr', label: localeNativeLabels.fr },
  { code: 'id', label: localeNativeLabels.id },
  { code: 'hi', label: localeNativeLabels.hi },
  { code: 'de', label: localeNativeLabels.de },
  { code: 'tr', label: localeNativeLabels.tr },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = normalizeLocale(searchParams.get('locale'));
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const dict = homeText[currentLocale];

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const switchLocale = (newLocale: Locale) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('locale', newLocale);
    setOpen(false);
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentLabel = languageOptions.find((o) => o.code === currentLocale)?.label ?? 'English';

  return (
    <div ref={rootRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
      >
        <span className="text-gray-900 dark:text-white">{dict.localeLabel}</span>
        <span className="text-gray-500 dark:text-slate-400">{currentLabel}</span>
        <svg className={`h-4 w-4 text-gray-500 dark:text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl"
        >
          <ul className="max-h-72 overflow-auto py-1">
            {languageOptions.map((lang) => {
              const active = lang.code === currentLocale;
              return (
                <li key={lang.code}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => switchLocale(lang.code)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors ${
                      active 
                        ? 'bg-gray-100 dark:bg-slate-800 font-semibold text-gray-900 dark:text-white' 
                        : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {active && <span className="text-xs text-blue-600 dark:text-blue-400">{currentBadgeText[currentLocale]}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

