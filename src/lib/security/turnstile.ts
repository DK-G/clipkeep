import { getCloudflareContext } from "@opennextjs/cloudflare";
import { SITE_URL } from "@/lib/site-url";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EXPECTED_HOSTNAME = new URL(SITE_URL).hostname; // e.g. "clipkeep.net"
const TIMEOUT_MS = 5000;
const MAX_RETRIES = 2;

type TurnstileOutcome = {
  success: boolean;
  "error-codes"?: string[];
  hostname?: string;
};

async function callSiteverify(
  formData: FormData
): Promise<TurnstileOutcome> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    return await response.json() as TurnstileOutcome;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Verifies a Cloudflare Turnstile token using the siteverify API.
 *
 * Behaviour on network failure:
 *   - Retries up to MAX_RETRIES times with 500 ms back-off.
 *   - If all attempts fail, verification fails closed (returns false).
 */
export async function verifyTurnstileToken(token: string, ip?: string): Promise<boolean> {
  const cloudflare = await getCloudflareContext();
  const env = cloudflare?.env as {
    TURNSTILE_SECRET_KEY?: string;
    turnsite_key?: string;
    turnstile_key?: string;
  };
  const secret = env?.TURNSTILE_SECRET_KEY || env?.turnsite_key || env?.turnstile_key;

  if (!secret) {
    console.error("[Turnstile] Secret key not configured — failing closed.");
    return false;
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  if (ip) formData.append("remoteip", ip);

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const outcome = await callSiteverify(formData);

      if (!outcome.success) {
        console.warn("[Turnstile] Verification failed:", outcome["error-codes"]);
        return false;
      }

      // Reject tokens issued for a different hostname (replay attack prevention).
      if (outcome.hostname && outcome.hostname !== EXPECTED_HOSTNAME) {
        console.warn(
          `[Turnstile] Hostname mismatch: expected=${EXPECTED_HOSTNAME}, got=${outcome.hostname}`
        );
        return false;
      }

      return true;
    } catch (error) {
      lastError = error;
      console.warn(`[Turnstile] Network error on attempt ${attempt}/${MAX_RETRIES}:`, error);
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }

  // All retries exhausted — fail closed.
  console.error("[Turnstile] All retries failed, failing closed. Last error:", lastError);
  return false;
}
