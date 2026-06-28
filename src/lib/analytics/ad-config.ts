// Framework-free configuration and helpers for the Monetag ad scripts.
//
// Extracted from `src/components/analytics/ad-diagnostics.tsx` so the
// north-star event logic (the `ad_script_load` family) can be unit-tested
// without rendering a React client component. The component imports these and
// keeps the same behavior; nothing here touches `window`/`next/script`.

export type AdScript = {
  id: string;
  src: string;
  provider: "monetag";
  format: "in_page_push" | "push_notification";
  zone: string;
  extraProps?: Record<string, string>;
};

export const AD_SCRIPTS: AdScript[] = [
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

export function looksLikeBot(userAgent: string): boolean {
  return /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegrambot|twitterbot|linkedinbot/i.test(userAgent);
}

// The payload attached to every ad diagnostic event. Kept pure so a test can
// assert the north-star attribution fields (provider / format / zone / id).
export function buildAdEventPayload(
  script: AdScript,
  params: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    provider: script.provider,
    ad_format: script.format,
    ad_zone: script.zone,
    script_id: script.id,
    ...params,
  };
}

// Zone-scoped companion event name (e.g. `ad_script_load_z10760541`). GA4 has
// no registered custom dimension for `ad_zone`, so encoding the zone in the
// event name lets the eventName breakdown attribute loads/errors per zone.
export function adZoneEventName(name: string, zone: string): string {
  return `${name}_z${zone}`;
}
