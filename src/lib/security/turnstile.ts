import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Verifies a Cloudflare Turnstile token using the siteverify API.
 */
export async function verifyTurnstileToken(token: string, ip?: string): Promise<boolean> {
  const cloudflare = await getCloudflareContext();
  const env = cloudflare?.env as { TURNSTILE_SECRET_KEY?: string };
  const secret = env?.TURNSTILE_SECRET_KEY;
  
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not configured in the environment.");
    // For testing/bootstrap, we might want to return true IF NO KEY IS FOUND, 
    // but in production we MUST return false.
    // For now, let's keep it strict.
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

