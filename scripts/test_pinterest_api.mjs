const pin_id = "768145280229407952";
const api_data = {
    options: {
        field_set_key: "unauth_react_main_pin",
        id: pin_id
    }
};
const api_url = `https://www.pinterest.com/resource/PinResource/get/?data=${encodeURIComponent(JSON.stringify(api_data))}`;

const headers = {
    "X-Pinterest-PWS-Handler": "www/signup.js",
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
};

async function testApi() {
    console.log(`Testing Pinterest API: ${api_url}`);
    try {
        const res = await fetch(api_url, { headers });
        if (!res.ok) {
            console.error(`Status: ${res.status} ${res.statusText}`);
            const text = await res.text();
            console.error(text.substring(0, 500));
            return;
        }
        const data = await res.json();
        const pinData = data.resource_response?.data;
        if (pinData) {
            console.log("✅ Success! Found pin data.");
            console.log("Title:", pinData.seo_title || pinData.grid_title);
            console.log("Images:", Object.keys(pinData.images || {}));
            console.log("Videos:", pinData.videos ? "Yes" : "No");
        } else {
            console.log("❌ No data in response.");
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

testApi();
