import { NextResponse } from "next/server";
import { runAutoTrendUpdate } from "@/lib/auto-trend";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = 'force-dynamic';

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
    console.warn(`[AutoTrend API] Unauthorized: secret mismatch. (Provided: ${secret?.substring(0, 3)}..., Internal: ${internalSecret?.substring(0, 3)}...)`);
    return NextResponse.json({ 
      error: "Unauthorized",
      timestamp: new Date().toISOString()
    }, { status: 401 });
  }

  try {
    console.log("[AutoTrend API] Triggering manual update (confirmed auth)...");
    
    // 非同期で実行を開始し、クライアントにはすぐにレスポンスを返す（タイムアウト防止）
    // Next.jsのEdge Runtimeでは、cfContext.ctx.waitUntil を使用してバックグラウンド処理を行う
    if (cfContext && cfContext.ctx && cfContext.ctx.waitUntil) {
      cfContext.ctx.waitUntil(runAutoTrendUpdate().catch((e: any) => {
        console.error("[AutoTrend API] Background update failed:", e);
      }));
    } else {
      // ローカル開発環境などのフォールバック
      runAutoTrendUpdate().catch((e: any) => {
        console.error("[AutoTrend API] Background update failed:", e);
      });
    }
    
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
