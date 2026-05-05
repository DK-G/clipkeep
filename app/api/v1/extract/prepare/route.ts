import { evaluateDegraded } from "@/lib/degraded/evaluator";
import { recordExtractAttempt } from "@/lib/degraded/state";
import { getRequestId } from "@/lib/api/request-id";
import { failure, success } from "@/lib/api/response";
import { createJob } from "@/lib/extract/store";
import { checkExtractRateLimit, getClientKey } from "@/lib/rate-limit/extract";
import { verifyTurnstileToken } from "@/lib/security/turnstile";
import type { Platform } from "@/lib/extract/types";
import type { Locale } from "@/lib/i18n/ui";
import { normalizeTikTokInputUrl } from "@/lib/extract/tiktok-url";
import { normalizeTwitterInputUrl } from "@/lib/extract/twitter-url";
import { normalizeTelegramUrl } from "@/lib/extract/telegram";
import { normalizeRedditUrl } from "@/lib/extract/reddit";
import { normalizePinterestUrl } from "@/lib/extract/pinterest";
import { normalizeThreadsUrl } from "@/lib/extract/threads";

type PrepareBody = {
  url?: string;
  platform?: string;
  locale?: Locale;
  turnstileToken?: string;
};

function normalizePlatform(raw: string): Platform | null {
  const value = raw.toLowerCase();
  if (value === "x") return "twitter";
  const validPlatforms = ["telegram", "twitter", "tiktok", "reddit", "pinterest", "facebook", "threads", "bluesky", "lemon8", "bilibili", "discord"];
  if (validPlatforms.includes(value)) return value as Platform;
  return null;
}

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const requestId = await getRequestId();

  const clientKey = getClientKey(request);
  const rate = await checkExtractRateLimit(clientKey);
  if (rate.limited) {
    const res = failure({
      status: 429,
      requestId,
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please retry later.",
        details: {
          retryAfterSec: rate.retryAfterSec,
          source: rate.source,
          limit: rate.limit,
          windowMs: rate.windowMs,
        },
      },
    });
    res.headers.set("x-rate-limit-source", rate.source);
    res.headers.set("x-rate-limit-limit", String(rate.limit));
    res.headers.set("x-rate-limit-window-ms", String(rate.windowMs));
    return res;
  }

  const degraded = evaluateDegraded();
  if (degraded.isDegraded) {
    return failure({
      status: 503,
      requestId,
      degraded: true,
      error: {
        code: "SERVICE_DEGRADED",
        message: "Extractor is temporarily limited",
        details: {
          retryAfterSec: 120,
          helpPageSlug: "extractor-temporary-limited",
          reason: degraded.reason,
        },
      },
    });
  }

  let body: PrepareBody;
  try {
    body = (await request.json()) as PrepareBody;
  } catch {
    return failure({
      status: 400,
      requestId,
      error: {
        code: "INVALID_REQUEST",
        message: "Request body must be valid JSON",
        details: {},
      },
    });
  }

  const rawUrl = body.url?.trim() ?? "";
  let url = rawUrl;

  // Verify Turnstile Token
  const token = body.turnstileToken;
  if (!token) {
    return failure({
      status: 403,
      requestId,
      error: {
        code: "TURNSTILE_MISSING",
        message: "Turnstile token is required for this action.",
        details: {},
      },
    });
  }

  if (token) {
    const isHuman = await verifyTurnstileToken(token);
    if (!isHuman) {
      return failure({
        status: 403,
        requestId,
        error: {
          code: "TURNSTILE_FAILED",
          message: "Bot detection triggered. Please refresh and try again.",
          details: {},
        },
      });
    }
  }
  const platformRaw = body.platform?.trim() ?? "";
  const platform = normalizePlatform(platformRaw);

  if (!url || !platformRaw) {
    return failure({
      status: 400,
      requestId,
      locale: body.locale,
      error: {
        code: "INVALID_REQUEST",
        message: "url and platform are required",
        details: {},
      },
    });
  }

  if (!platform) {
    return failure({
      status: 400,
      requestId,
      locale: body.locale,
      error: {
        code: "UNSUPPORTED_PLATFORM",
        message: "Supported platforms are telegram, twitter, tiktok, reddit, pinterest, facebook, threads, bluesky, lemon8, bilibili, discord",
        details: { platform: platformRaw },
      },
    });
  }

  if (!isValidUrl(url)) {
    return failure({
      status: 400,
      requestId,
      locale: body.locale,
      error: {
        code: "INVALID_URL",
        message: "url must be a valid http/https URL",
        details: { url },
      },
    });
  }

  if (platform === "tiktok") {
    try {
      url = normalizeTikTokInputUrl(url);
    } catch {
      return failure({
        status: 400,
        requestId,
        locale: body.locale,
        error: {
          code: "INVALID_URL",
          message: "TikTok URL must be a valid tiktok.com/@user/video/<id> or vt/vm short link.",
          details: { url: rawUrl },
        },
      });
    }
  }

  if (platform === "twitter") {
    try {
      url = normalizeTwitterInputUrl(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      let userMessage = "X URL must be a valid x.com/twitter.com status URL or t.co short link.";
      
      if (message === "X_PROFILE_URL_NOT_SUPPORTED") {
        userMessage = "Profile URLs are not supported. Please provide a link to a specific Post (Status).";
      } else if (message === "UNSUPPORTED_HOST") {
        userMessage = "This URL host is not supported for X/Twitter. Please use x.com or twitter.com.";
      }

      return failure({
        status: 400,
        requestId,
        locale: body.locale,
        error: {
          code: "INVALID_URL",
          message: userMessage,
          details: { url: rawUrl, reason: message },
        },
      });
    }
  }

  if (platform === "telegram") {
    try {
      url = normalizeTelegramUrl(url);
    } catch {
      return failure({
        status: 400,
        requestId,
        locale: body.locale,
        error: {
          code: "INVALID_URL",
          message: "Telegram URL must be a valid public t.me post URL.",
          details: { url: rawUrl },
        },
      });
    }
  }

  if (platform === "reddit") {
    try {
      url = normalizeRedditUrl(url);
    } catch {
      return failure({
        status: 400,
        requestId,
        locale: body.locale,
        error: {
          code: "INVALID_URL",
          message: "Reddit URL must be a valid public reddit.com or redd.it post URL.",
          details: { url: rawUrl },
        },
      });
    }
  }

  if (platform === "pinterest") {
    try {
      url = normalizePinterestUrl(url);
    } catch {
      return failure({
        status: 400,
        requestId,
        locale: body.locale,
        error: {
          code: "INVALID_URL",
          message: "Pinterest URL must be a valid public pinterest.com/pin/<id> or pin.it URL.",
          details: { url: rawUrl },
        },
      });
    }
  }

  if (platform === "threads") {
    try {
      url = normalizeThreadsUrl(url);
    } catch {
      return failure({
        status: 400,
        requestId,
        locale: body.locale,
        error: {
          code: "INVALID_URL",
          message: "Threads URL must be a valid public threads.com/threads.net post URL.",
          details: { url: rawUrl },
        },
      });
    }
  }

  try {
    const job = await createJob(platform, url, body.locale || 'en');
    recordExtractAttempt({ upstreamFailed: false, queueWaitMs: 0 });

    return success({
      status: 202,
      requestId,
      locale: body.locale,
      data: {
        jobId: job.id,
        status: job.status,
        pollAfterMs: 1200,
      },
    });
  } catch (error) {
    console.error("Critical error in prepare route:", error);
    return failure({
      status: 500,
      requestId,
      error: {
        code: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        details: {},
      },
    });
  }
}





