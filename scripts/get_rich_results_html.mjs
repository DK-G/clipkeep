import fetch from "node-fetch";
import fs from "fs";

async function dumpHtml() {
  const url = "http://localhost:3000/download-tiktok-video";
  console.log(`Fetching ${url}...`);
  try {
    const res = await fetch(url);
    const html = await res.text();
    fs.writeFileSync("artifacts/rendered_tiktok.html", html);
    
    // Extract all JSON-LD scripts
    const matches = Array.from(html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g));
    console.log(`Found ${matches.length} JSON-LD blocks.`);
    
    const jsonLds = matches.map((m, i) => {
      const content = m[1].trim();
      fs.writeFileSync(`artifacts/json_ld_${i}.json`, content);
      return JSON.parse(content);
    });
    
    fs.writeFileSync("artifacts/all_json_lds.json", JSON.stringify(jsonLds, null, 2));
    console.log("Saved all blocks to artifacts/json_ld_*.json and artifacts/all_json_lds.json");
    
  } catch (e) {
    console.error("Fetch failed:", e.message);
  }
}

dumpHtml();
