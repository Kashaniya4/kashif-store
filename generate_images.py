import json
import base64
import os
import time
import urllib.request
import urllib.error

API_URL = "http://localhost:20128/v1/images/generations"
AUTH = "Bearer sk-3c4a4c44bf0a105c-pbja32-3eb34f78"
OUT_DIR = r"C:\Users\REHMAN BABA\OneDrive\Desktop\store\public\products\generated-images"

os.makedirs(OUT_DIR, exist_ok=True)

# List of all products to redesign
ITEMS = [
    {
        "filename": "apple-earpods-usbc-1.png",
        "prompt": "Professional commercial 1:1 square product photography of Apple EarPods with USB-C connector on clean pure white studio background, premium soft studio lighting, ultra sharp 4k, ecommerce hero image"
    },
    {
        "filename": "apple-earpods-usbc-2.png",
        "prompt": "Professional commercial 1:1 square product photography of Apple EarPods with USB-C connector close up shot showing controller and speakers on pure white background, studio lighting"
    },
    {
        "filename": "apple-earpods-usbc-3.png",
        "prompt": "Professional commercial 1:1 square product photography of Apple EarPods USB-C coiled neatly on seamless white background, minimalist ecommerce product shot"
    },
    {
        "filename": "apple-25w-power-adapter-1.png",
        "prompt": "Professional commercial 1:1 square product photography of Apple 25W USB-C Power Adapter charger plug on pure white studio background, sharp reflections, clean modern aesthetic"
    },
    {
        "filename": "apple-25w-power-adapter-2.png",
        "prompt": "Professional commercial 1:1 square product photography of Apple 25W USB-C Power Adapter charger from angled perspective on pure white background, high detail"
    },
    {
        "filename": "apple-airpods-high-quality.png",
        "prompt": "Professional commercial 1:1 square product photography of Apple AirPods Pro wireless earbuds with open wireless charging case on pure white background, premium luxury lighting"
    },
    {
        "filename": "apple-earbuds-high-quality-1.png",
        "prompt": "Professional commercial 1:1 square product photography of Apple high quality wired earbuds 3.5mm headphone jack on pure white background, studio lighting"
    },
    {
        "filename": "apple-earbuds-high-quality-2.png",
        "prompt": "Professional commercial 1:1 square product photography of Apple premium wired earbuds on seamless white background, minimalist composition"
    },
    {
        "filename": "apple-earpods-3-high-quality-1.png",
        "prompt": "Professional commercial 1:1 square product photography of Apple 3rd generation EarPods wired earphones on pure white studio background, sharp clarity"
    },
    {
        "filename": "apple-earpods-3-high-quality-2.png",
        "prompt": "Professional commercial 1:1 square product photography of Apple EarPods 3rd gen earphones pair on white background, studio lighting"
    },
    {
        "filename": "google-pixel-usbc-cable.png",
        "prompt": "Professional commercial 1:1 square product photography of Google Pixel USB-C to USB-C fast charging and data transfer cable neatly coiled on pure white background, studio lighting"
    },
    {
        "filename": "lunar-ultrapods-max-1.png",
        "prompt": "Professional commercial 1:1 square product photography of Lunar UltraPods Max transparent case wireless earbuds with LED display on pure white background, vibrant modern tech style"
    },
    {
        "filename": "lunar-ultrapods-max-2.png",
        "prompt": "Professional commercial 1:1 square product photography of Lunar UltraPods Max true wireless earbuds pair out of case on pure white studio background"
    },
    {
        "filename": "lunar-anc-enc-earbuds-max.png",
        "prompt": "Professional commercial 1:1 square product photography of Lunar ANC + ENC Quad Mic wireless earbuds in sleek matte black charging case on pure white background, high-end audio"
    },
    {
        "filename": "octo-fast-charging-powerbank-20000mah.png",
        "prompt": "Professional commercial 1:1 square product photography of Octo 20000mAh fast charging portable power bank with LED percentage display on pure white background, sleek modern design"
    },
    {
        "filename": "octo-4usb-powerbank-50000mah.png",
        "prompt": "Professional commercial 1:1 square product photography of Octo heavy duty 50000mAh 4-USB ports power bank with built-in LED flashlight on pure white background, studio lighting"
    },
    {
        "filename": "octo-airbuds-pro2.png",
        "prompt": "Professional commercial 1:1 square product photography of Octo AirBuds Pro 2 true wireless earbuds with glossy white charging case on pure white background, studio quality"
    },
    {
        "filename": "octo-music-bar-750.png",
        "prompt": "Professional commercial 1:1 square product photography of Octo Music Bar 750 portable Bluetooth speaker soundbar on pure white background, studio lighting, front angle"
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

def generate_image(item):
    filename = item["filename"]
    prompt = item["prompt"]
    outfile = os.path.join(OUT_DIR, filename)

    if os.path.exists(outfile) and os.path.getsize(outfile) > 1000:
        print(f"SKIP (already exists): {filename}")
        return True

    print(f"Generating ({filename})...")
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

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
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
            else:
                print(f"FAILED (No image data): {filename}")
                return False
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8', errors='ignore')
        print(f"ERROR on {filename}: {e.code} {e.reason} -> {err_body[:100]}")
        time.sleep(15)
        return False
    except Exception as e:
        print(f"ERROR on {filename}: {e}")
        time.sleep(10)
        return False

MAX_ROUNDS = 6
total = len(ITEMS)
for round_num in range(1, MAX_ROUNDS + 1):
    pending = [it for it in ITEMS if not (os.path.exists(os.path.join(OUT_DIR, it["filename"])) and os.path.getsize(os.path.join(OUT_DIR, it["filename"])) > 1000)]
    if not pending:
        break
    print(f"\n=== ROUND {round_num}: {len(pending)} pending ===")
    for item in pending:
        success = generate_image(item)
        if success:
            time.sleep(5)
        else:
            time.sleep(15)

done = sum(1 for it in ITEMS if os.path.exists(os.path.join(OUT_DIR, it["filename"])) and os.path.getsize(os.path.join(OUT_DIR, it["filename"])) > 1000)
print(f"\nDone: {done}/{total} images generated.")
if done < total:
    print("MISSING: " + ", ".join(it["filename"] for it in ITEMS if not os.path.exists(os.path.join(OUT_DIR, it["filename"]))))
