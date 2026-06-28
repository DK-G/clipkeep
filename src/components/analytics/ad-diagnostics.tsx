"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { trackEvent } from "@/lib/analytics/gtag";
import {
  AD_SCRIPTS,
  type AdScript,
  adZoneEventName,
  buildAdEventPayload,
  looksLikeBot,
} from "@/lib/analytics/ad-config";

function trackAdEvent(name: string, script: AdScript, params: Record<string, unknown> = {}) {
  const payload = buildAdEventPayload(script, params);
  trackEvent(name, payload);
  // Aggregate `ad_script_load` is emitted above for backward compatibility; the
  // zone-scoped companion event lets the GA4 eventName breakdown attribute
  // loads/errors/timeouts per zone without a registered `ad_zone` dimension.
  trackEvent(adZoneEventName(name, script.zone), payload);
}

export function AdDiagnostics() {
  const loadedScripts = useRef<Set<string>>(new Set());

  useEffect(() => {
    const userAgent = navigator.userAgent || "";

    trackEvent("ad_diagnostic_context", {
      bot_like_user_agent: looksLikeBot(userAgent),
      webdriver: navigator.webdriver === true,
      do_not_track: navigator.doNotTrack || "unknown",
      cookies_enabled: navigator.cookieEnabled,
      service_worker_supported: "serviceWorker" in navigator,
      notification_permission: "Notification" in window ? Notification.permission : "unsupported",
      document_visibility: document.visibilityState,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
    });

    const timeoutId = window.setTimeout(() => {
      for (const script of AD_SCRIPTS) {
        if (!loadedScripts.current.has(script.id)) {
          trackAdEvent("ad_script_timeout", script, {
            timeout_ms: 8000,
          });
        }
      }
    }, 8000);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <>
      {AD_SCRIPTS.map((script) => (
        <Script
          key={script.id}
          id={script.id}
          src={script.src}
          strategy="afterInteractive"
          data-cfasync="false"
          onLoad={() => {
            loadedScripts.current.add(script.id);
            trackAdEvent("ad_script_load", script);
          }}
          onError={() => {
            trackAdEvent("ad_script_error", script);
          }}
          {...script.extraProps}
        />
      ))}
    </>
  );
}
