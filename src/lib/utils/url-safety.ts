import { Platform } from "../extract/types";

const ALLOWED_HOSTS: Record<Platform, string[]> = {
  twitter: ["twitter.com", "x.com", "www.twitter.com", "www.x.com"],
  tiktok: ["tiktok.com", "www.tiktok.com", "vt.tiktok.com", "vm.tiktok.com"],
  reddit: ["reddit.com", "www.reddit.com", "old.reddit.com", "redd.it"],
  pinterest: ["pinterest.com", "www.pinterest.com", "pin.it"],
  bilibili: ["bilibili.com", "www.bilibili.com", "b23.tv"],
  threads: ["threads.net", "www.threads.net"],
  bluesky: ["bsky.app", "www.bsky.app"],
  lemon8: ["lemon8-app.com", "www.lemon8-app.com"],
  facebook: ["facebook.com", "www.facebook.com", "fb.watch"],
  telegram: ["t.me", "telegram.me"],
  discord: ["discord.com", "cdn.discordapp.com", "media.discordapp.net"],
};

export function isSafeSourceUrl(url: string | undefined, platform: Platform): boolean {
  if (!url) return false;

  try {
    const u = new URL(url);
    
    // Only allow http and https
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return false;
    }

    const hostname = u.hostname.toLowerCase();
    const allowed = ALLOWED_HOSTS[platform] || [];
    
    // Check if the hostname matches exactly or is a subdomain of an allowed host
    return allowed.some(allowedHost => {
      if (hostname === allowedHost) return true;
      if (hostname.endsWith("." + allowedHost)) return true;
      return false;
    });
  } catch {
    return false;
  }
}
