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

// IPv6 loopback, link-local, unique-local, and mapped IPv4-private ranges
const PRIVATE_IPV6_PATTERNS = [
  /^\[?::1\]?$/,           // loopback
  /^\[?fe80:/i,            // link-local
  /^\[?fc[0-9a-f]{2}:/i,  // unique-local fc00::/7
  /^\[?fd[0-9a-f]{2}:/i,  // unique-local fd00::/8
  /^\[?::ffff:127\./i,     // IPv4-mapped loopback
  /^\[?::ffff:10\./i,      // IPv4-mapped private
  /^\[?::ffff:192\.168\./i,
  /^\[?::ffff:172\.(1[6-9]|2\d|3[0-1])\./i,
];

function isPrivateHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (host === "localhost") return true;
  if (PRIVATE_IPV4_PATTERNS.some((p) => p.test(host))) return true;
  if (PRIVATE_IPV6_PATTERNS.some((p) => p.test(host))) return true;
  return false;
}

function isAllowedTarget(url: URL): boolean {
  const host = url.hostname.toLowerCase();
  return ALLOWED_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}

function normalizeContentType(value: string | null): string {
  return (value || "application/octet-stream").split(";")[0].trim().toLowerCase();
}

function extensionFromContentType(contentType: string): string {
  switch (contentType) {
    case "video/mp4":
      return "mp4";
    case "video/webm":
      return "webm";
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "audio/mpeg":
      return "mp3";
    case "audio/mp4":
      return "m4a";
    case "application/vnd.apple.mpegurl":
    case "application/x-mpegurl":
      return "m3u8";
    default: {
      const slashIndex = contentType.indexOf("/");
      if (slashIndex >= 0 && slashIndex < contentType.length - 1) {
        return contentType.slice(slashIndex + 1).replace(/[^a-z0-9.+-]/gi, "") || "bin";
      }
      return "bin";
    }
  }
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

    const contentType = normalizeContentType(response.headers.get("content-type"));
    const isDownload = searchParams.get("dl") === "1";

    const headersConfig: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    };

    if (isDownload) {
      const ext = extensionFromContentType(contentType);
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
