import { headers } from "next/headers";

export async function getRequestId(): Promise<string> {
  const h = await headers();
  const incoming = h.get("x-request-id");
  return incoming?.trim() || crypto.randomUUID();
}

