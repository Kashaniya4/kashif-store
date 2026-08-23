import json
import base64
import os
import time
import urllib.request
import urllib.error

API_URL = "http://localhost:20128/v1/images/generations"
AUTH = "Bearer sk-3c4a4c44bf0a105c-pbja32-3eb34f78"
OUT_DIR = r"C:\Users\REHMAN BABA\OneDrive\Desktop\store\public\products\generated-images"

REMAINING = [
    {
        "filename": "octo-music-bar-750.png",
        "prompt": "Professional commercial 1:1 square product photography of Octo Music Bar 750 portable Bluetooth soundbar speaker on pure white background, studio lighting, front angle"
    },
    {
        "filename": "octo-wireless-airbuds-pro.png",
        "prompt": "Professional commercial 1:1 square product photography of Octo Wireless AirBuds Pro wireless earphones in case on seamless white studio background, premium"
    },
    {
        "filename": "romoss-pct10-powerbank-10000mah.png",
        "prompt": "Professional commercial 1:1 square product photography of Romoss PCT10 10000mAh 20W PD ultra slim fast charging power bank on pure white background, sleek design"
    },
    {
        "filename": "ronin-axis-bar-soundbar.png",
        "prompt": "Professional commercial 1:1 square product photography of Ronin Axis Bar RGB desktop soundbar speaker with glowing ambient RGB lighting on pure white background, premium gaming audio look"
    },
    {
        "filename": "samsung-25w-pd-adapter-1.png",
        "prompt": "Professional commercial 1:1 square product photography of Samsung 25W Super Fast Charging USB-C Power Adapter on pure white background, studio lighting, crisp finish"
    },
    {
        "filename": "samsung-25w-pd-adapter-2.png",
        "prompt": "Professional commercial 1:1 square product photography of Samsung 25W Type-C fast charger wall adapter side angle on pure white background, studio lighting"
    },
    {
        "filename": "wiwu-35w-charger.png",
        "prompt": "Professional commercial 1:1 square product photography of WIWU 35W Dual Port USB-C fast power charger on pure white background, compact modern design, studio lighting"
    }
]

def generate_one(item):
    filename = item["filename"]
    prompt = item["prompt"]
    outfile = os.path.join(OUT_DIR, filename)

    if os.path.exists(outfile) and os.path.getsize(outfile) > 1000:
        print(f"ALREADY DONE: {filename}")
        return True

    payload = {
        "model": "ag/gemini-3.1-flash-image",
        "prompt": prompt,
        "n": 1,
        "size": "auto",
        "quality": "auto",
        "background": "auto",
        "image_detail": "high",
        "output_format": "png"
    }

    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": AUTH
        }
    )

    for attempt in range(1, 6):
        try:
            print(f"[{attempt}/5] Generating {filename}...")
            with urllib.request.urlopen(req, timeout=90) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                img_data = data["data"][0]

                if "b64_json" in img_data and img_data["b64_json"]:
                    raw_bytes = base64.b64decode(img_data["b64_json"])
                    with open(outfile, "wb") as f:
                        f.write(raw_bytes)
                    print(f"SUCCESS: {filename} ({len(raw_bytes)} bytes)")
                    return True
                elif "url" in img_data and img_data["url"]:
                    urllib.request.urlretrieve(img_data["url"], outfile)
                    print(f"SUCCESS (URL): {filename}")
                    return True
        except urllib.error.HTTPError as e:
            msg = e.read().decode('utf-8', errors='ignore')
            print(f"  HTTP {e.code}: {msg[:120]}")
            print("  Waiting 20s for rate limit reset...")
            time.sleep(20)
        except Exception as e:
            print(f"  Error: {e}")
            time.sleep(10)

    return False

for item in REMAINING:
    generate_one(item)
    print("Sleeping 10s between requests...")
    time.sleep(10)

print("\n--- Summary ---")
for it in REMAINING:
    p = os.path.join(OUT_DIR, it["filename"])
    exists = os.path.exists(p) and os.path.getsize(p) > 1000
    print(f"{it['filename']}: {'DONE' if exists else 'MISSING'}")
