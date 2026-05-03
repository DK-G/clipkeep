'use client';

import { useEffect, useRef } from 'react';

// Create a "Banner" type zone in your Monetag dashboard (monetag.com → Websites → Add Zone → Banner)
// then pass the resulting zone ID as the zoneId prop.

interface MonetaguBannerProps {
  zoneId: string;
  className?: string;
}

export function MonetaguBanner({ zoneId, className = '' }: MonetaguBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://nap5k.com/tag.min.js';
    script.dataset.zone = zoneId;
    script.async = true;
    script.dataset.cfasync = 'false';
    containerRef.current.appendChild(script);

    return () => { script.remove(); };
  }, [zoneId]);

  return <div ref={containerRef} className={`overflow-hidden ${className}`} />;
}
