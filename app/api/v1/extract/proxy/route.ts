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
    "tikwm.com", "tiktokv.com", "tiktok.com"
  ];
  if (!allowedDomains.some(domain => url.includes(domain))) {
    return new NextResponse("Invalid URL domain", { status: 403 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://t.me/",
        "Origin": "https://t.me/",
      },
    });

    if (!response.ok) {
      return new NextResponse(`Upstream error: ${response.status}`, { status: response.status });
    }

    // Proxy the content-type and stream the body
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    
    // Create a new response with the streamed body
    const proxiedResponse = new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        "Content-Disposition": `attachment; filename="clipkeep_telegram_media.mp4"`,
        "Access-Control-Allow-Origin": "*", // Allow cross-origin for the dynamic player if needed
      },
    });

    return proxiedResponse;
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
