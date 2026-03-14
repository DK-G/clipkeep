import urllib.request
import json
import time

def test_extraction(url, platform):
    print(f"Testing {platform} extraction for: {url}")
    api_url = "https://clipkeep.net/api/v1/extractor"
    payload = {
        "url": url,
        "platform": platform
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(api_url, data=data, method='POST')
    req.add_header('Content-Type', 'application/json')
    req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            status_code = response.getcode()
            print(f"Status Code: {status_code}")
            body = response.read().decode('utf-8')
            if status_code == 200 or status_code == 201:
                res_data = json.loads(body)
                print(f"Response: {json.dumps(res_data, indent=2)}")
                if res_data.get("status") == "success" or res_data.get("job_id"):
                    print("SUCCESS: Extraction triggered successfully.")
                    return True
                else:
                    print("FAILURE: API returned success status but no success/job_id field.")
                    return False
            else:
                print(f"FAILURE: API returned {status_code}")
                print(f"Body: {body}")
                return False
    except urllib.error.HTTPError as e:
        print(f"FAILURE: API returned {e.code}")
        print(f"Body: {e.read().decode('utf-8')}")
        return False
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    # Test Telegram
    tg_success = test_extraction("https://t.me/durov/243", "telegram")
    print("-" * 20)
    # Test Twitter
    tw_success = test_extraction("https://x.com/SpaceX/status/1767512271815147983", "twitter")
    
    if tg_success and tw_success:
        print("\nOVERALL STATUS: ALL CORE PLATFORMS VERIFIED.")
    else:
        print("\nOVERALL STATUS: SOME TESTS FAILED.")
