import { NextResponse } from "next/server";
import { runAutoTrendUpdate } from "@/lib/auto-trend";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { checkInMemory, getClientKey } from "@/lib/rate-limit/admin";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const clientKey = getClientKey(request);
  const { limited, retryAfterSec } = checkInMemory(clientKey, Date.now(), 60_000, 5);
  if (limited) {
    return NextResponse.json({ error: "Too Many Requests" }, {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    });
  }

  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  const context = await getCloudflareContext();
  const env = (context?.env as { CRON_SECRET?: string } | undefined) || {};
  const internalSecret = env?.CRON_SECRET || process.env.CRON_SECRET;

  if (!secret || secret !== internalSecret) {
    return NextResponse.json({
      error: "Unauthorized",
      timestamp: new Date().toISOString()
    }, { status: 401 });
  }

  try {
    const result = await runAutoTrendUpdate();
    return NextResponse.json({
      status: "success",
      message: "Automated trend update completed",
      result
    });
  } catch (error) {
    console.error("[AutoTrend API] error:", error);
    return NextResponse.json({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
