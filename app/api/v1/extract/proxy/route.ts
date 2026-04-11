import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "telesco.pe", "telegram.org",
  "twimg.com", "video.twimg.com", "pbs.twimg.com", "fxtwitter.com", "vxtwitter.com", "twitfix.com", "fixupx.com",
  "ddinstagram.com", "cdninstagram.com", "fbcdn.net", "fna.fbcdn.net",
  "tikwm.com", "tiktokv.com", "tiktok.com", "tiktokcdn.com", "tiktokcdn-us.com", "kktiktok.com",
  "redd.it", "redditstatic.com", "reddit.com", "rxddit.com", "spedit.com", "v.redd.it", "i.redd.it", "preview.redd.it", "external-preview.redd.it", "redditmedia.com",
  "pinimg.com", "pinterest.com",
  "bsky.social", "bsky.network", "bsky.app",
  "byteimg.com", "lemon8-app.com",
  "hdslb.com", "bilibili.com", "bilivideo.com",
  "discordapp.net", "discordapp.com", "discord.com",
  "threads.net", "threads.com",
];

const PRIVATE_IPV4_PATTERNS = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
];

function isPrivateHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host === "::1") return true;
  return PRIVATE_IPV4_PATTERNS.some((pattern) => pattern.test(host));
}

function isAllowedTarget(url: URL): boolean {
  const host = url.hostname.toLowerCase();
  return ALLOWED_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}

/**
 * Proxy for SNS media URLs to bypass hotlinking restrictions.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(rawUrl);
  } catch {
    return new NextResponse("Invalid URL format", { status: 400 });
  }

  if (!["http:", "https:"].includes(targetUrl.protocol)) {
    return new NextResponse("Invalid URL scheme", { status: 403 });
  }

  if (targetUrl.username || targetUrl.password) {
    return new NextResponse("Invalid URL auth", { status: 403 });
  }

  if (targetUrl.port && targetUrl.port !== "80" && targetUrl.port !== "443") {
    return new NextResponse("Invalid URL port", { status: 403 });
  }

  if (isPrivateHost(targetUrl.hostname) || !isAllowedTarget(targetUrl)) {
    return new NextResponse("Invalid URL domain", { status: 403 });
  }

  try {
    const host = targetUrl.hostname.toLowerCase();
    const isTelegram = host === "telesco.pe" || host.endsWith(".telesco.pe") || host === "telegram.org" || host.endsWith(".telegram.org");

    const headers: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    };

    if (isTelegram) {
      headers["Referer"] = "https://t.me/";
      headers["Origin"] = "https://t.me/";
    }

    const response = await fetch(targetUrl.toString(), { headers });
    if (!response.ok) {
      return new NextResponse(`Upstream error: ${response.status}`, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const isDownload = searchParams.get("dl") === "1";

    const headersConfig: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    };

    if (isDownload) {
      const ext = contentType.split("/")[1] || "mp4";
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
