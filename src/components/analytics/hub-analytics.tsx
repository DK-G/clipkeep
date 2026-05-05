'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics/gtag';

interface TrendingHubAnalyticsProps {
  type: 'trending' | 'latest';
}

export function HubAnalytics({ type }: TrendingHubAnalyticsProps) {
  useEffect(() => {
    trackEvent(`${type}_hub_view`, { 
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    });
  }, [type]);

  return null;
}
