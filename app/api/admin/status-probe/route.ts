import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { probeAndRecord } from "@/lib/platform-status/probes";

export const dynamic = "force-dynamic";

/**
 * Track A-v1 cron entry. Called by the 6h scheduled worker (src/worker.ts) to
 * probe platform upstreams and append a sample to the rolling uptime history.
 * HTTP-only (no browser) — independent of the auto-trend/browser pipeline.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  const cfContext = await getCloudflareContext();
  const env = (cfContext?.env as { CRON_SECRET?: string } | undefined) || {};
  const internalSecret = env?.CRON_SECRET || process.env.CRON_SECRET;

  if (!secret || secret !== internalSecret) {
    console.warn("[StatusProbe API] Unauthorized: secret mismatch.");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const task = probeAndRecord().catch((e: unknown) => {
      console.error("[StatusProbe API] Background probe failed:", e);
    });
    if (cfContext?.ctx?.waitUntil) {
      cfContext.ctx.waitUntil(task);
    } else {
      await task;
    }
    return NextResponse.json({ status: "success", message: "Platform status probe recorded" });
  } catch (error) {
    console.error("[StatusProbe API] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
