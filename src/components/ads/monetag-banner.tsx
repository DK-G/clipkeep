'use client';

import { useEffect, useRef } from 'react';

/**
 * Monetag display banner.
 *
 * Usage:
 *   <MonetagBanner zoneId="XXXXXXXX" width={300} height={250} />
 *
 * Zone IDs are obtained from the Monetag dashboard per placement.
 * Set them via env vars (NEXT_PUBLIC_MONETAG_ZONE_RESULT etc.) and pass in.
 *
 * This component injects Monetag only for explicit banner placements.
 * (No global auto-injection from layout.)
 */

interface MonetagBannerProps {
  zoneId: string;
  width?: number;
  height?: number;
  className?: string;
}

export function MonetagBanner({ zoneId, width = 300, height = 250, className }: MonetagBannerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (!zoneId || loaded.current || !ref.current) return;
    loaded.current = true;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://quge5.com/88/tag.min.js';
    script.setAttribute('data-zone', zoneId);
    ref.current.appendChild(script);
  }, [zoneId]);

  if (!zoneId) return null;

  return (
    <div
      ref={ref}
      className={className}
      style={{ minWidth: width, minHeight: height, overflow: 'hidden' }}
      aria-hidden="true"
    />
  );
}

// Backward-compatible alias for existing imports.
export const MonteagBanner = MonetagBanner;
