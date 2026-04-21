'use client';

import { useEffect, useRef } from 'react';

// To activate ads: create Display ad units in your AdSense console
// (google.com/adsense → Ads → By ad unit → Display ads)
// then replace the adSlot prop values at each usage site.

interface AdSenseUnitProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid';
  adLayout?: 'in-article' | 'in-feed';
  className?: string;
}

export function AdSenseUnit({ adSlot, adFormat = 'auto', adLayout, className = '' }: AdSenseUnitProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // AdSense script not yet loaded
    }
  }, []);

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5877075056686035"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        {...(adLayout ? { 'data-ad-layout': adLayout } : {})}
        data-full-width-responsive="true"
      />
    </div>
  );
}
