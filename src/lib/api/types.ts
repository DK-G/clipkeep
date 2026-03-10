export type ApiMeta = {
  requestId: string;
  locale: "en" | "ar";
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
    | "INTERNAL_ERROR";
  message: string;
  details: Record<string, unknown>;
};

export type ApiFailure = {
  ok: false;
  error: ApiErrorBody;
  meta: ApiMeta;
};
