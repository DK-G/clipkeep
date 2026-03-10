import type { ApiErrorBody } from "@/lib/api/types";

export class ApiError extends Error {
  public readonly status: number;
  public readonly body: ApiErrorBody;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.status = status;
    this.body = body;
  }
}

export function toInternalError(): ApiErrorBody {
  return {
    code: "INTERNAL_ERROR",
    message: "Internal server error",
    details: {},
  };
}
