import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Verifies a Cloudflare Turnstile token using the siteverify API.
 */
export async function verifyTurnstileToken(token: string, ip?: string): Promise<boolean> {
  const cloudflare = await getCloudflareContext();
  const env = cloudflare?.env as { TURNSTILE_SECRET_KEY?: string; turnsite_key?: string; turnstile_key?: string };
  const secret = env?.TURNSTILE_SECRET_KEY || env?.turnsite_key || env?.turnstile_key;
  
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY (or turnsite_key) is not configured in the environment.");
    return false;
  }

  // Use FormData as required by the Turnstile API
  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', token);
  if (ip) {
    formData.append('remoteip', ip);
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const outcome = await response.json() as {
      success: boolean;
      'error-codes'?: string[];
      challenge_ts?: string;
      hostname?: string;
    };

    if (!outcome.success) {
      console.warn("Turnstile verification failed:", outcome['error-codes']);
    }

    return outcome.success;
  } catch (error) {
    console.error("Error verifying Turnstile token:", error);
    return false;
  }
}

