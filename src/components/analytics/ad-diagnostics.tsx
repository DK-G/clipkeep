"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { trackEvent } from "@/lib/analytics/gtag";

type AdScript = {
  id: string;
  src: string;
  provider: "monetag";
  format: "in_page_push" | "push_notification";
  zone: string;
  extraProps?: Record<string, string>;
};

const AD_SCRIPTS: AdScript[] = [
  {
    id: "monetag-in-page-push",
    src: "https://nap5k.com/tag.min.js",
    provider: "monetag",
    format: "in_page_push",
    zone: "10760541",
    extraProps: { "data-zone": "10760541" },
  },
  {
    id: "monetag-push-notification",
    src: "https://3nbf4.com/pfe/current/tag.min.js?z=10969428",
    provider: "monetag",
    format: "push_notification",
    zone: "10969428",
  },
];

function looksLikeBot(userAgent: string): boolean {
  return /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegrambot|twitterbot|linkedinbot/i.test(userAgent);
}

function trackAdEvent(name: string, script: AdScript, params: Record<string, unknown> = {}) {
  trackEvent(name, {
    provider: script.provider,
    ad_format: script.format,
    ad_zone: script.zone,
    script_id: script.id,
    ...params,
  });
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
