import { evaluateDegraded } from "@/lib/degraded/evaluator";
import { recordExtractAttempt } from "@/lib/degraded/state";
import { getRequestId } from "@/lib/api/request-id";
import { failure, success } from "@/lib/api/response";
import { createJob } from "@/lib/extract/store";
import { checkExtractRateLimit, getClientKey } from "@/lib/rate-limit/extract";
import type { Platform } from "@/lib/extract/types";
import type { Locale } from "@/lib/i18n/ui";

type PrepareBody = {
  url?: string;
  platform?: string;
  locale?: Locale;
};

function normalizePlatform(raw: string): Platform | null {
  const value = raw.toLowerCase();
  if (value === "x") return "twitter";
  if (value === "twitter" || value === "telegram" || value === "tiktok" || value === "instagram") return value;
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

  const url = body.url?.trim() ?? "";
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
        message: "Supported platforms are telegram, twitter, tiktok, instagram",
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




