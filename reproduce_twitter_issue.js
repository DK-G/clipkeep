const sourceUrl = 'https://twitter.com/SpaceX/status/1860099499839959325';

function extractStatusId(sourceUrl) {
  try {
    const url = new URL(sourceUrl);
    const match = url.pathname.match(/status\/(\d+)/i);
    if (match?.[1]) return match[1];

    const onlyId = url.pathname.replaceAll('/', '');
    if (/^\d+$/.test(onlyId)) return onlyId;
    return null;
  } catch {
    return null;
  }
}

function findMeta(html, key) {
  const patterns = [
    new RegExp(`<meta[^>]*(?:property|name)=["']${key}["'][^>]*content=["']([^"']+)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']${key}["'][^>]*>`, 'i'),
  ];

  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

async function scrapeFixer(url) {
  console.log(`Scraping ${url}...`);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'TelegramBot (like TwitterBot)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!res.ok) {
      console.log(`Failed to fetch ${url}: ${res.status}`);
      return [];
    }
    const html = await res.text();
    console.log(`HTML length: ${html.length}`);
    if (html.length < 500) {
      console.log(`Response snippet: ${html}`);
    } else {
      console.log(`Response snippet: ${html.substring(0, 500)}`);
    }

    const videoUrl =
      findMeta(html, 'og:video') ||
      findMeta(html, 'og:video:url') ||
      findMeta(html, 'og:video:secure_url') ||
      findMeta(html, 'twitter:player:stream');

    const thumbUrl = findMeta(html, 'og:image') || findMeta(html, 'twitter:image');

    if (videoUrl) {
      return [{ type: 'video', url: videoUrl, thumbUrl: thumbUrl || undefined }];
    }

    if (thumbUrl) {
      return [{ type: 'image', url: thumbUrl }];
    }

    return [];
  } catch (e) {
    console.error(`Fetch error for ${url}:`, e);
    return [];
  }
}

async function testApi(statusId) {
  const formats = [
    `https://api.fxtwitter.com/SpaceX/status/${statusId}`,
    `https://api.fxtwitter.com/status/${statusId}`,
    `https://api.fxtwitter.com/i/status/${statusId}`,
  ];
  
  for (const url of formats) {
    console.log(`Testing API: ${url}...`);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`API failed (${url}): ${res.status}`);
        continue;
      }
      const data = await res.json();
      console.log(`API response (${url}):`, JSON.stringify(data, null, 2));
      return data;
    } catch (e) {
      console.error(`API error (${url}):`, e);
    }
  }
  return null;
}

async function testDirect(statusId) {
  const url = `https://d.fxtwitter.com/i/status/${statusId}`;
  console.log(`Testing Direct Redirect: ${url}...`);
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    console.log(`Direct Redirect result: ${res.status}, final URL: ${res.url}`);
    if (res.url.includes('twimg.com')) {
      console.log('SUCCESS: Direct video URL found!');
      return res.url;
    }
    return null;
  } catch (e) {
    console.error(`Direct Redirect error:`, e);
    return null;
  }
}

async function test() {
  const statusId = extractStatusId(sourceUrl);
  console.log(`Status ID: ${statusId}`);
  if (!statusId) return;

  await testApi(statusId);
  await testDirect(statusId);

  const candidates = [
    `https://fxtwitter.com/i/status/${statusId}`,
    `https://vxtwitter.com/i/status/${statusId}`,
    `https://fixupx.com/i/status/${statusId}`,
  ];

  for (const c of candidates) {
    const media = await scrapeFixer(c);
    console.log(`Media for ${c}:`, JSON.stringify(media, null, 2));
    if (media.length > 0) {
        console.log("SUCCESS");
        return;
    }
  }
  console.log("FAILED");
}

test();
