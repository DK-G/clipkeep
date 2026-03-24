'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { normalizeLocale, localeDir } from '@/lib/i18n/ui';

export function LocaleUpdater() {
  const searchParams = useSearchParams();
  const locale = normalizeLocale(searchParams.get('locale'));

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = locale;
    
    // Update document direction (LTR/RTL)
    document.documentElement.dir = localeDir(locale);
  }, [locale]);

  return null;
}

