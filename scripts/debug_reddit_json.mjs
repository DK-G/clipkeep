import fetch from "node-fetch";

const urls = [
  "https://www.reddit.com/r/aww/comments/1fmfv2z/this_little_guy_is_too_cute/.json",
  "https://www.reddit.com/r/Unexpected/comments/1gzjr3a/screw_it/.json"
];

async function debugReddit() {
  for (const url of urls) {
    console.log(`\n--- Fetching: ${url} ---`);
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        }
      });
      
      if (!response.ok) {
        console.error(`HTTP Error: ${response.status} ${response.statusText}`);
        continue;
      }
      
      const data = await response.json();
      const post = data[0]?.data?.children[0]?.data;
      
      if (!post) {
        console.error("Could not find post data in JSON");
        continue;
      }
      
      console.log("Post Title:", post.title);
      console.log("Post Hint:", post.post_hint);
      console.log("Is Gallery:", post.is_gallery);
      console.log("Is Video:", post.is_video);
      
      if (post.is_gallery) {
        console.log("Gallery Data:", JSON.stringify(post.gallery_data, null, 2));
        console.log("Media Metadata Keys:", Object.keys(post.media_metadata || {}));
      }
      
      if (post.is_video) {
        console.log("Video Data:", JSON.stringify(post.secure_media?.reddit_video, null, 2));
      }

      console.log("URL:", post.url);
      
    } catch (error) {
      console.error("Fetch failed:", error.message);
    }
  }
}

debugReddit();
