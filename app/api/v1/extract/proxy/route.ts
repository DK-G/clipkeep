import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy for Telegram media to bypass Referer/Hotlinking restrictions.
 * Telegram CDN (telesco.pe) checks for Referer: https://t.me/
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Security: Only allow proxying for known SNS CDN domains
  const allowedDomains = [
    "telesco.pe", "telegram.org", 
    "twimg.com", "fxtwitter.com", "vxtwitter.com", "twitfix.com",
    "ddinstagram.com", "cdninstagram.com", "fbcdn.net",
    "tikwm.com", "tiktokv.com", "tiktok.com", "tiktokcdn.com", "tiktokcdn-us.com", "kktiktok.com"
  ];
  if (!allowedDomains.some(domain => url.includes(domain))) {
    return new NextResponse("Invalid URL domain", { status: 403 });
  }

  try {
    const isTelegram = url.includes("telesco.pe") || url.includes("telegram.org");
    
    const headers: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    };

    if (isTelegram) {
      headers["Referer"] = "https://t.me/";
      headers["Origin"] = "https://t.me/";
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      return new NextResponse(`Upstream error: ${response.status}`, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const isDownload = searchParams.get("dl") === "1" || true; // Favor download for now per user request
    
    const headersConfig: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    };

    if (isDownload) {
      const ext = contentType.split('/')[1] || 'mp4';
      headersConfig["Content-Disposition"] = `attachment; filename="clipkeep_media.${ext}"`;
    }

    return new NextResponse(response.body, {
      status: 200,
      headers: headersConfig,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
