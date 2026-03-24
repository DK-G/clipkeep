import fetch from "node-fetch";

const cases = [
  { name: "TikTok Slideshow", url: "https://www.tiktok.com/@kiara6400/video/7462002597401922864", api: (url) => `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}` },
  { name: "Reddit Gallery", url: "https://www.reddit.com/r/aww/comments/1fmfv2z/this_little_guy_is_too_cute/.json" },
  { name: "Pinterest Story", url: "https://www.pinterest.com/pin/582653283069150341/" }
];

async function debug() {
  for (const c of cases) {
    console.log(`\n--- ${c.name}: ${c.url} ---`);
    const apiUrl = c.api ? c.api(c.url) : c.url;
    try {
      const response = await fetch(apiUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        }
      });
      console.log("Status:", response.status);
      if (response.headers.get("content-type")?.includes("json")) {
        const data = await response.json();
        console.log("Data:", JSON.stringify(data, null, 2).substring(0, 1000));
      } else {
        const text = await response.text();
        console.log("HTML Sample:", text.substring(0, 500));
      }
    } catch (e) {
      console.error("Failed:", e.message);
    }
  }
}

debug();
