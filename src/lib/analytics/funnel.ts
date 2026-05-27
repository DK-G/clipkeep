import type { Platform } from "@/lib/extract/types";
import type { Locale } from "@/lib/i18n/ui";

export type ExtractionOrigin = "form" | "demo" | "direct";

export type ExtractionAttribution = {
  attemptId: string;
  origin: ExtractionOrigin;
  platform: Platform;
  locale: Locale;
  startedAt: string;
};

const STORAGE_PREFIX = "clipkeep:extract-attribution:";

function makeAttemptId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createExtractionAttribution(
  origin: Exclude<ExtractionOrigin, "direct">,
  platform: Platform,
  locale: Locale,
): ExtractionAttribution {
  return {
    attemptId: makeAttemptId(),
    origin,
    platform,
    locale,
    startedAt: new Date().toISOString(),
  };
}

export function saveExtractionAttribution(jobId: string, attribution: ExtractionAttribution): void {
  if (typeof sessionStorage === "undefined") return;

  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${jobId}`, JSON.stringify(attribution));
  } catch {
    // ignore storage errors
  }
}

export function readExtractionAttribution(jobId: string): ExtractionAttribution | null {
  if (typeof sessionStorage === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${jobId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ExtractionAttribution;
    if (!parsed?.attemptId || !parsed?.origin) return null;
    return parsed;
  } catch {
    return null;
  }
}
