'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Locale, normalizeLocale } from '@/lib/i18n/ui';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentLocale = normalizeLocale(searchParams.get('locale'));

  const toggleLocale = (newLocale: Locale) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('locale', newLocale);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {[
        { code: 'en', label: 'EN' },
        { code: 'ar', label: 'العربية' },
        { code: 'ja', label: '日本語' },
        { code: 'es', label: 'ES' },
        { code: 'pt', label: 'PT' },
        { code: 'fr', label: 'FR' },
        { code: 'id', label: 'ID' },
        { code: 'hi', label: 'हिंदी' },
        { code: 'de', label: 'DE' },
        { code: 'tr', label: 'TR' },
      ].map((lang) => (
        <button
          key={lang.code}
          onClick={() => toggleLocale(lang.code as Locale)}
          className={`px-3 py-1 text-sm font-medium rounded-md transition ${
            currentLocale === lang.code 
              ? 'bg-black text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
