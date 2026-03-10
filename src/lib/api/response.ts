import { NextResponse } from "next/server";
import type { ApiErrorBody, ApiFailure, ApiMeta, ApiSuccess } from "@/lib/api/types";

function buildMeta(requestId: string, locale: "en" | "ar", degraded: boolean): ApiMeta {
  return {
    requestId,
    locale,
    degraded,
    timestamp: new Date().toISOString(),
  };
}

export function success<T>(args: {
  data: T;
  requestId: string;
  locale?: "en" | "ar";
  degraded?: boolean;
  status?: number;
}): NextResponse<ApiSuccess<T>> {
  const payload: ApiSuccess<T> = {
    ok: true,
    data: args.data,
    meta: buildMeta(args.requestId, args.locale ?? "en", args.degraded ?? false),
  };

  return NextResponse.json(payload, {
    status: args.status ?? 200,
    headers: {
      "x-request-id": payload.meta.requestId,
    },
  });
}

export function failure(args: {
  error: ApiErrorBody;
  requestId: string;
  locale?: "en" | "ar";
  degraded?: boolean;
  status: number;
}): NextResponse<ApiFailure> {
  const payload: ApiFailure = {
    ok: false,
    error: args.error,
    meta: buildMeta(args.requestId, args.locale ?? "en", args.degraded ?? false),
  };

  return NextResponse.json(payload, {
    status: args.status,
    headers: {
      "x-request-id": payload.meta.requestId,
    },
  });
}
