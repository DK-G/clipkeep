'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

/**
 * Adsterra SocialBar and Popunder scripts.
 * SocialBar is loaded immediately.
 * Popunder can be triggered via a global state or prop if needed, 
 * but here we provide a way to mount it dynamically.
 */
export function AdsterraAds({ showPopunder = false }: { showPopunder?: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* SocialBar - Global */}
      <Script 
        src="https://pl28916536.effectivegatecpm.com/93/a3/05/93a305874ff7aa9542dff8f824db8e76.js" 
        strategy="lazyOnload"
      />

      {/* Popunder - Loaded conditionally or globally depending on preference. 
          The user mentioned "after start extract", so we can use showPopunder state. */}
      {showPopunder && (
        <Script 
          src="https://pl28915034.effectivegatecpm.com/e3/85/b8/e385b8653df6d49480f4caab7d312227.js" 
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
