'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'clipkeep_platform_usage';

export function usePlatformUsage() {
  const [usage, setUsage] = useState<Record<string, number>>({});

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUsage(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse platform usage:', e);
      }
    }
  }, []);

  const recordPlatformUse = (platformId: string) => {
    setUsage((prev) => {
      const next = { ...prev, [platformId]: (prev[platformId] || 0) + 1 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const getSortedPlatforms = <T extends { id: string }>(platforms: T[]): T[] => {
    return [...platforms].sort((a, b) => {
      const usageA = usage[a.id] || 0;
      const usageB = usage[b.id] || 0;
      if (usageA !== usageB) return usageB - usageA;
      // Default order if usage is same
      return 0; 
    });
  };

  return { usage, recordPlatformUse, getSortedPlatforms };
}
