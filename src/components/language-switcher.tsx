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
    <div className="flex items-center gap-3">
      <button
        onClick={() => toggleLocale('en')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition ${
          currentLocale === 'en' 
            ? 'bg-black text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => toggleLocale('ar')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition ${
          currentLocale === 'ar' 
            ? 'bg-black text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        العربية
      </button>
    </div>
  );
}
