import fetch from "node-fetch";

const url = "https://www.tiktok.com/@barbrusa_social/video/7338426065553198369";
const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;

async function debugTikWM() {
  console.log(`\n--- Fetching TikWM: ${apiUrl} ---`);
  try {
    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      }
    });
    
    const data = await response.json();
    console.log("Raw Data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Fetch failed:", error.message);
  }
}

debugTikWM();
