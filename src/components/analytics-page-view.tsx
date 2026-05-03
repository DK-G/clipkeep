'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/analytics/gtag';

interface AnalyticsPageViewProps {
  gaId: string;
}

export function AnalyticsPageView({ gaId }: AnalyticsPageViewProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    trackPageView(gaId, url);
  }, [gaId, pathname, searchParams]);

  return null;
}
