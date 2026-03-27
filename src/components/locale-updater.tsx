'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { normalizeLocale, localeDir } from '@/lib/i18n/ui';

export function LocaleUpdater() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const urlLocale = searchParams.get('locale');
    const browserLocale = typeof window !== 'undefined' ? window.navigator.language : 'en';
    const finalLocale = normalizeLocale(urlLocale || browserLocale);

    // Update HTML lang attribute
    document.documentElement.lang = finalLocale;
    
    // Update document direction (LTR/RTL)
    document.documentElement.dir = localeDir(finalLocale);
  }, [searchParams]);

  return null;
}

