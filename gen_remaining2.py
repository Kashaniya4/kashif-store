import json
import base64
import os
import time
import urllib.request
import urllib.error
import re

API_URL = "http://localhost:20128/v1/images/generations"
AUTH = "Bearer sk-3c4a4c44bf0a105c-pbja32-3eb34f78"
OUT_DIR = r"C:\Users\REHMAN BABA\OneDrive\Desktop\store\public\products\generated-images"

REMAINING = [
    ("octo-music-bar-750.png", "Professional commercial 1:1 square product photography of Octo Music Bar 750 portable Bluetooth soundbar speaker on pure white background, studio lighting, front angle"),
    ("octo-wireless-airbuds-pro.png", "Professional commercial 1:1 square product photography of Octo Wireless AirBuds Pro wireless earphones in case on seamless white studio background, premium"),
    ("romoss-pct10-powerbank-10000mah.png", "Professional commercial 1:1 square product photography of Romoss PCT10 10000mAh 20W PD ultra slim fast charging power bank on pure white background, sleek design"),
    ("ronin-axis-bar-soundbar.png", "Professional commercial 1:1 square product photography of Ronin Axis Bar RGB desktop soundbar speaker with glowing ambient RGB lighting on pure white background, premium gaming audio look"),
    ("samsung-25w-pd-adapter-1.png", "Professional commercial 1:1 square product photography of Samsung 25W Super Fast Charging USB-C Power Adapter on pure white background, studio lighting, crisp finish"),
    ("samsung-25w-pd-adapter-2.png", "Professional commercial 1:1 square product photography of Samsung 25W Type-C fast charger wall adapter side angle on pure white background, studio lighting"),
    ("wiwu-35w-charger.png", "Professional commercial 1:1 square product photography of WIWU 35W Dual Port USB-C fast power charger on pure white background, compact modern design, studio lighting"),
]

def generate_one(filename, prompt):
    outfile = os.path.join(OUT_DIR, filename)
    if os.path.exists(outfile) and os.path.getsize(outfile) > 1000:
        print(f"ALREADY DONE: {filename}", flush=True)
        return True

    payload = json.dumps({
        "model": "ag/gemini-3.1-flash-image",
        "prompt": prompt,
        "n": 1, "size": "auto", "quality": "auto",
        "background": "auto", "image_detail": "high", "output_format": "png"
    }).encode("utf-8")

    for attempt in range(1, 11):
        print(f"  [{attempt}/10] {filename}...", flush=True)
        req = urllib.request.Request(API_URL, data=payload, headers={
            "Content-Type": "application/json",
            "Authorization": AUTH
        })
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                img = data["data"][0]
                if img.get("b64_json"):
                    raw = base64.b64decode(img["b64_json"])
                    with open(outfile, "wb") as f:
                        f.write(raw)
                    print(f"  OK: {filename} ({len(raw)} bytes)", flush=True)
                    return True
                elif img.get("url"):
                    urllib.request.urlretrieve(img["url"], outfile)
                    print(f"  OK (url): {filename}", flush=True)
                    return True
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="ignore")
            # parse "reset after 4m 26s" or "reset after 42s"
            m = re.search(r"reset after (?:(\d+)m\s*)?(\d+)s", body)
            if m:
                minutes = int(m.group(1)) if m.group(1) else 0
                seconds = int(m.group(2))
                wait = (minutes * 60) + seconds + 10
            else:
                wait = 60
            print(f"  Rate limited. Waiting {wait}s...", flush=True)
            time.sleep(wait)
        except Exception as e:
            print(f"  Error: {e}", flush=True)
            time.sleep(30)
    return False

for fname, pr in REMAINING:
    print(f"\n=== {fname} ===", flush=True)
    ok = generate_one(fname, pr)
    if ok:
        print("Cooldown 45s before next...", flush=True)
        time.sleep(45)
    else:
        print(f"FAILED after 10 attempts: {fname}", flush=True)

print("\n=== FINAL ===", flush=True)
for fname, _ in REMAINING:
    p = os.path.join(OUT_DIR, fname)
    st = "DONE" if os.path.exists(p) and os.path.getsize(p) > 1000 else "MISSING"
    print(f"  {fname}: {st}", flush=True)
