'use client';

import { useEffect, useRef } from 'react';

export function AdsterraNative() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptInjected = useRef(false);

  useEffect(() => {
    if (scriptInjected.current) return;
    
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl28916543.effectivegatecpm.com/f17b1c25b3e406196dcf4a0ac7fd392b/invoke.js';
    
    // Append to body or container. Adsterra invoke.js usually looks for the div ID.
    document.body.appendChild(script);
    scriptInjected.current = true;

    return () => {
      // Cleanup script if necessary, though Adsterra scripts often stay in DOM.
    };
  }, []);

  return (
    <div className="my-8 flex justify-center overflow-hidden flex-col items-center">
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 640px) {
          #container-f17b1c25b3e406196dcf4a0ac7fd392b div[class*="__bn-container"]:nth-child(n+2) {
            display: none !important;
          }
          #container-f17b1c25b3e406196dcf4a0ac7fd392b div[class*="__bn-container"]:first-child {
            flex-basis: 100% !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        }
      `}} />
      <div id="container-f17b1c25b3e406196dcf4a0ac7fd392b" ref={containerRef}></div>
    </div>
  );
}
