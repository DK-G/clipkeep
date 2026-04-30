import { NextResponse } from "next/server";
import { runAutoTrendUpdate } from "@/lib/auto-trend";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "@/lib/db/d1";

export const dynamic = 'force-dynamic';

// Minimum interval between executions (55 min — just under the 1-hour cron).
const MIN_INTERVAL_MS = 55 * 60 * 1000;

async function getLastRunAt(): Promise<number> {
  try {
    const db = await getDb();
    const row = await db.prepare(
      `SELECT value FROM admin_meta WHERE key = 'auto_trend_last_run'`
    ).first<{ value: string }>();
    return row ? new Date(row.value).getTime() : 0;
  } catch {
    return 0;
  }
}

async function setLastRunAt(iso: string): Promise<void> {
  try {
    const db = await getDb();
    await db.prepare(
      `INSERT INTO admin_meta (key, value) VALUES ('auto_trend_last_run', ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`
    ).bind(iso).run();
  } catch (e) {
    console.warn("[AutoTrend API] Failed to persist last_run_at:", e);
  }
}

/**
 * 毎時トレンド抽出を実行するためのAPIエンドポイント。
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  // Cloudflareの環境変数を取得
  const cfContext = await getCloudflareContext();
  const env = (cfContext?.env as { CRON_SECRET?: string } | undefined) || {};
  // wrangler.production.tomlで定義した変数、または秘密情報から取得
  const internalSecret = env?.CRON_SECRET || process.env.CRON_SECRET;

  if (!secret || secret !== internalSecret) {
    // Avoid leaking any part of the secret in logs
    console.warn("[AutoTrend API] Unauthorized: secret mismatch.");
    return NextResponse.json({
      error: "Unauthorized",
      timestamp: new Date().toISOString()
    }, { status: 401 });
  }

  // Rate-limit: reject if last run was less than MIN_INTERVAL_MS ago.
  const lastRunAt = await getLastRunAt();
  const now = Date.now();
  if (lastRunAt && now - lastRunAt < MIN_INTERVAL_MS) {
    const retryAfterSec = Math.ceil((lastRunAt + MIN_INTERVAL_MS - now) / 1000);
    console.warn(`[AutoTrend API] Rate limited. Next run allowed in ${retryAfterSec}s.`);
    return NextResponse.json(
      { error: "Too Many Requests", retryAfterSeconds: retryAfterSec },
      { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
    );
  }

  try {
    console.log("[AutoTrend API] Triggering manual update (confirmed auth)...");

    // waitUntil でバックグラウンド実行（Edge タイムアウト回避）
    // 完了後に setLastRunAt を記録する
    const backgroundTask = runAutoTrendUpdate()
      .then(() => setLastRunAt(new Date().toISOString()))
      .catch((e: any) => {
        console.error("[AutoTrend API] Background update failed:", e);
      });

    if (cfContext?.ctx?.waitUntil) {
      cfContext.ctx.waitUntil(backgroundTask);
    }
    // ローカル開発環境ではそのまま Promise を流す（await しない）

    return NextResponse.json({
      status: "success",
      message: "Automated trend update started in background"
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
