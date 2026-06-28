import { describe, expect, it } from "vitest";
import {
  AD_SCRIPTS,
  adZoneEventName,
  buildAdEventPayload,
  looksLikeBot,
} from "./ad-config";

describe("AD_SCRIPTS config integrity", () => {
  it("ships exactly the two Monetag zones, all monetag provider", () => {
    expect(AD_SCRIPTS).toHaveLength(2);
    for (const s of AD_SCRIPTS) {
      expect(s.provider).toBe("monetag");
      expect(s.src.startsWith("https://")).toBe(true);
      expect(s.zone).toMatch(/^\d+$/);
    }
  });

  it("has unique script ids and zones", () => {
    const ids = AD_SCRIPTS.map((s) => s.id);
    const zones = AD_SCRIPTS.map((s) => s.zone);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(zones).size).toBe(zones.length);
  });

  it("keeps data-zone in sync with the script zone when present", () => {
    for (const s of AD_SCRIPTS) {
      if (s.extraProps?.["data-zone"]) {
        expect(s.extraProps["data-zone"]).toBe(s.zone);
      }
    }
  });
});

describe("buildAdEventPayload (north-star attribution)", () => {
  const script = AD_SCRIPTS[0];

  it("attaches provider / format / zone / script_id", () => {
    expect(buildAdEventPayload(script)).toEqual({
      provider: "monetag",
      ad_format: script.format,
      ad_zone: script.zone,
      script_id: script.id,
    });
  });

  it("merges extra params without dropping the base fields", () => {
    const payload = buildAdEventPayload(script, { timeout_ms: 8000 });
    expect(payload.timeout_ms).toBe(8000);
    expect(payload.ad_zone).toBe(script.zone);
  });

  it("lets explicit params override base fields (caller intent wins)", () => {
    const payload = buildAdEventPayload(script, { ad_zone: "override" });
    expect(payload.ad_zone).toBe("override");
  });
});

describe("adZoneEventName", () => {
  it("encodes the zone into the event name", () => {
    expect(adZoneEventName("ad_script_load", "10760541")).toBe("ad_script_load_z10760541");
    expect(adZoneEventName("ad_script_error", "10969428")).toBe("ad_script_error_z10969428");
  });
});

describe("looksLikeBot", () => {
  it.each([
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "facebookexternalhit/1.1",
    "WhatsApp/2.23",
    "TelegramBot (like TwitterBot)",
    "Twitterbot/1.0",
    "LinkedInBot/1.0",
    "Mozilla/5.0 ... Slurp",
  ])("flags crawler/preview UA: %s", (ua) => {
    expect(looksLikeBot(ua)).toBe(true);
  });

  it.each([
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1",
    "",
  ])("does not flag a real/empty UA: %s", (ua) => {
    expect(looksLikeBot(ua)).toBe(false);
  });
});
