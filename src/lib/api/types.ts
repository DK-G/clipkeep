import type { Locale } from "@/lib/i18n/ui";

export type ApiMeta = {
  requestId: string;
  locale: Locale;
  degraded: boolean;
  timestamp: string;
};

export type ApiSuccess<T> = {
  ok: true;
  data: T;
  meta: ApiMeta;
};

export type ApiErrorBody = {
  code:
    | "INVALID_REQUEST"
    | "UNSUPPORTED_PLATFORM"
    | "INVALID_URL"
    | "RATE_LIMITED"
    | "JOB_NOT_FOUND"
    | "UPSTREAM_FAILED"
    | "SERVICE_DEGRADED"
    | "INTERNAL_ERROR"
    | "DB_ERROR"
    | "MISSING_PLATFORM"
    | "MISSING_JOB_ID"
    | "TRACKING_ERROR"
    | "TURNSTILE_MISSING"
    | "TURNSTILE_FAILED";
  message: string;
  details: Record<string, unknown>;
};

export type ApiFailure = {
  ok: false;
  error: ApiErrorBody;
  meta: ApiMeta;
};

export interface MediaVariant {
  url: string;
  quality: string;
  ext: string;
  size?: number;
  type: 'video' | 'image' | 'audio' | 'gif';
  width?: number;
  height?: number;
}

export interface ExtractionResult {
  id: string;
  platform: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  variants: MediaVariant[];
  author_name?: string;
  author_handle?: string;
  title?: string;
  thumbnail_url?: string;
  warnings: string[];
}
