export type TwitterMedia = {
  type: "video" | "audio" | "image";
  url: string;
  thumbUrl?: string;
};

export async function extractTwitter(sourceUrl: string): Promise<TwitterMedia[]> {
  try {
    // Normalize URL for vxtwitter API
    // Expected: https://api.vxtwitter.com/status/123... or https://api.vxtwitter.com/user/status/123...
    // The API documentation suggests https://api.vxtwitter.com/Twitter/status/1278747479005319169
    
    const url = new URL(sourceUrl);
    const pathParts = url.pathname.split("/").filter(Boolean);
    
    // Path should be like [user, "status", id] or just ["status", id]
    let statusId = "";
    if (pathParts.includes("status")) {
      statusId = pathParts[pathParts.indexOf("status") + 1];
    }

    if (!statusId) {
      throw new Error("Invalid Twitter status URL");
    }

    // We can use any username, "i" or the original one
    const apiUrl = `https://api.vxtwitter.com/i/status/${statusId}`;
    
    const res = await fetch(apiUrl, {
      headers: {
        "User-Agent": "ClipKeepBot/1.0",
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`vxtwitter API failed with status ${res.status}`);
    }

    const data = await res.json() as any;
    const results: TwitterMedia[] = [];

    if (data.media_extended && Array.isArray(data.media_extended)) {
      for (const m of data.media_extended) {
        if (m.type === "video") {
          results.push({
            type: "video",
            url: m.url,
            thumbUrl: m.thumbnail_url,
          });
        } else if (m.type === "image") {
          results.push({
            type: "image",
            url: m.url,
          });
        } else if (m.type === "gif") {
          results.push({
            type: "video", // GIFs are often returned as MP4s
            url: m.url,
            thumbUrl: m.thumbnail_url,
          });
        }
      }
    }

    return results;
  } catch (error) {
    console.error("Twitter extraction error:", error);
    return [];
  }
}
