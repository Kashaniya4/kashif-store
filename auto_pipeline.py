#!/usr/bin/env python3
"""
E-Commerce Product Image Redesign & Sync Automation
Powered by 9Router API (ag/gemini-3.1-flash-image)
"""

import os
import re
import sys
import json
import time
import base64
import urllib.request
import urllib.error

API_URL = "http://localhost:20128/v1/images/generations"
AUTH_TOKEN = "Bearer sk-3c4a4c44bf0a105c-pbja32-3eb34f78"
MODEL_NAME = "ag/gemini-3.1-flash-image"

BASE_DIR = r"C:\Users\REHMAN BABA\OneDrive\Desktop\store"
CAPTURED_DIR = os.path.join(BASE_DIR, "public", "products", "captured-images")
GENERATED_DIR = os.path.join(BASE_DIR, "public", "products", "generated-images")
PRODUCTS_JSON = os.path.join(BASE_DIR, "src", "data", "products.json")
LOG_FILE = os.path.join(BASE_DIR, "image_generation_log.json")

os.makedirs(GENERATED_DIR, exist_ok=True)

# Product catalog with groupings, exact prompts and output file names
PRODUCTS = [
    {
        "id": "prod-1",
        "name": "Ronin Axis Bar RGB Soundbar Speaker",
        "slug": "ronin-axis-bar-rgb-soundbar-speaker",
        "source_patterns": ["ronin axix bar"],
        "outputs": [
            {
                "file": "ronin-axis-bar-soundbar.png",
                "prompt": "Commercial 1:1 square product photography of Ronin Axis Bar RGB desktop soundbar speaker with vibrant ambient RGB lighting strips, high resolution, pure crisp white studio background, premium soft studio lighting, sharp reflections, minimal ecommerce product shot, 4k"
            }
        ]
    },
    {
        "id": "prod-2",
        "name": "Romoss PCT10 10000mAh 20W Fast Charge Power Bank",
        "slug": "romoss-pct10-10000mah-fast-charge-power-bank",
        "source_patterns": ["romoss pct10"],
        "outputs": [
            {
                "file": "romoss-pct10-powerbank-10000mah.png",
                "prompt": "Commercial 1:1 square product photography of Romoss PCT10 10000mAh 20W PD ultra slim portable power bank charger on seamless pure white background, studio lighting, crisp finish, minimalist e-commerce"
            }
        ]
    },
    {
        "id": "prod-3",
        "name": "Buds3 Pro ANC Wireless Earbuds",
        "slug": "buds3-pro-anc-wireless-earbuds",
        "source_patterns": ["luner anc+enc"],
        "outputs": [
            {
                "file": "lunar-anc-enc-earbuds-max.png",
                "prompt": "Commercial 1:1 square product photography of Lunar ANC and ENC quad-microphone true wireless earbuds in sleek matte black charging case with open lid on pure white background, premium lighting, 4k"
            }
        ]
    },
    {
        "id": "prod-4",
        "name": "Apple AirPods Pro Wireless Earbuds (Premium)",
        "slug": "apple-airpods-pro-wireless-earbuds-premium",
        "source_patterns": ["apple airpods high quality"],
        "outputs": [
            {
                "file": "apple-airpods-high-quality.png",
                "prompt": "Commercial 1:1 square product photography of Apple AirPods Pro wireless earbuds with open MagSafe charging case standing on pure white studio background, premium luxury lighting, ultra detailed"
            }
        ]
    },
    {
        "id": "prod-5",
        "name": "Octo Air Buds Pro2 Bluetooth 5.3 Earbuds",
        "slug": "octo-air-buds-pro2-bluetooth-earbuds",
        "source_patterns": ["octo airbuds pro2"],
        "outputs": [
            {
                "file": "octo-airbuds-pro2.png",
                "prompt": "Commercial 1:1 square product photography of Octo Air Buds Pro 2 true wireless earbuds with glossy white charging case on seamless pure white background, studio quality, sharp focus"
            }
        ]
    },
    {
        "id": "prod-6",
        "name": "Apple EarPods with USB-C Connector",
        "slug": "apple-earpods-usb-c-connector",
        "source_patterns": ["apple  earpods (usb-c)", "apple earpods  (usb-c)", "apple earpods (usb-c)"],
        "outputs": [
            {
                "file": "apple-earpods-usbc-1.png",
                "prompt": "Commercial 1:1 square product photography of Apple EarPods wired earphones with USB-C connector on pure white studio background, studio lighting, crisp finish"
            },
            {
                "file": "apple-earpods-usbc-2.png",
                "prompt": "Commercial 1:1 square product photography of Apple EarPods USB-C inline mic remote and speakers close-up detail on pure white background, high quality"
            },
            {
                "file": "apple-earpods-usbc-3.png",
                "prompt": "Commercial 1:1 square product photography of Apple EarPods with USB-C neatly coiled flat lay composition on pure white background, minimal ecommerce"
            }
        ]
    },
    {
        "id": "prod-7",
        "name": "Lunar Ultrapods Pro TWS Transparent Earbuds",
        "slug": "lunar-ultrapods-pro-tws-transparent-earbuds",
        "source_patterns": ["lunar  ultrapods max", "lunar ultrapods max"],
        "outputs": [
            {
                "file": "lunar-ultrapods-max-1.png",
                "prompt": "Commercial 1:1 square product photography of Lunar UltraPods Max transparent casing TWS wireless earbuds with digital LED power display on pure white background, vibrant modern tech"
            },
            {
                "file": "lunar-ultrapods-max-2.png",
                "prompt": "Commercial 1:1 square product photography of Lunar UltraPods Max wireless earbuds pair outside the case floating on pure white studio background"
            }
        ]
    },
    {
        "id": "prod-8",
        "name": "Apple 25W USB-C Power Adapter",
        "slug": "apple-20w-usb-c-power-adapter",
        "source_patterns": ["apple 25w  power adapter", "apple 25w power adapter"],
        "outputs": [
            {
                "file": "apple-25w-power-adapter-1.png",
                "prompt": "Commercial 1:1 square product photography of Apple 25W USB-C Power Adapter fast charger wall plug on pure white studio background, studio lighting"
            },
            {
                "file": "apple-25w-power-adapter-2.png",
                "prompt": "Commercial 1:1 square product photography of Apple 25W USB-C Fast Charger adapter angled perspective showing Type-C port on pure white background"
            }
        ]
    },
    {
        "id": "prod-9",
        "name": "AirPods Pro 2nd Gen (Standard Edition)",
        "slug": "airpods-pro-2nd-gen-standard-edition",
        "source_patterns": ["apple earbuds  (high quality)", "apple earbuds (high quality)"],
        "outputs": [
            {
                "file": "apple-earbuds-high-quality-1.png",
                "prompt": "Commercial 1:1 square product photography of Apple high quality wired earbuds 3.5mm headphone jack on pure white background, studio lighting"
            },
            {
                "file": "apple-earbuds-high-quality-2.png",
                "prompt": "Commercial 1:1 square product photography of Apple premium wired earbuds neatly arranged on seamless white background, minimalist composition"
            }
        ]
    },
    {
        "id": "prod-10",
        "name": "Octo Music Bar M-750 20W RGB Bluetooth Speaker",
        "slug": "octo-music-bar-m750-rgb-bluetooth-speaker",
        "source_patterns": ["octo music bar 750"],
        "outputs": [
            {
                "file": "octo-music-bar-750.png",
                "prompt": "Commercial 1:1 square product photography of Octo Music Bar 750 portable Bluetooth soundbar speaker on pure white background, studio lighting, front angle, crisp soundbar details"
            }
        ]
    },
    {
        "id": "prod-11",
        "name": "Octo OC-502 50000mAh 22.5W Mega Power Bank",
        "slug": "octo-oc502-50000mah-22-5w-mega-power-bank",
        "source_patterns": ["octo 4USB power bank 50000mAh"],
        "outputs": [
            {
                "file": "octo-4usb-powerbank-50000mah.png",
                "prompt": "Commercial 1:1 square product photography of Octo heavy duty 50000mAh 4-USB ports monster power bank with built-in LED flashlight on pure white background, studio lighting"
            }
        ]
    },
    {
        "id": "prod-12",
        "name": "Lunar Ultrapods Max Quad-Mic ANC+ENC Earbuds",
        "slug": "lunar-ultrapods-max-quad-mic-earbuds",
        "source_patterns": ["octo wireless airbuds pro"],
        "outputs": [
            {
                "file": "octo-wireless-airbuds-pro.png",
                "prompt": "Commercial 1:1 square product photography of Octo Wireless AirBuds Pro wireless earphones in case on seamless white studio background, premium audio"
            }
        ]
    },
    {
        "id": "prod-13",
        "name": "WiWU Noble 35W Power Bank & Dual-Port Charger",
        "slug": "wiwu-noble-35w-power-bank-charger",
        "source_patterns": ["wiwu 35w high power charge"],
        "outputs": [
            {
                "file": "wiwu-35w-charger.png",
                "prompt": "Commercial 1:1 square product photography of WIWU 35W Dual Port USB-C fast power charger wall adapter on pure white background, compact modern design, studio lighting"
            }
        ]
    },
    {
        "id": "prod-14",
        "name": "Google Pixel 30W USB-C to USB-C Fast Charging Cable",
        "slug": "google-pixel-30w-usb-c-charging-cable",
        "source_patterns": ["google pixel charging+data transfer cable"],
        "outputs": [
            {
                "file": "google-pixel-usbc-cable.png",
                "prompt": "Commercial 1:1 square product photography of Google Pixel USB-C to USB-C fast charging and data transfer cable neatly coiled on pure white background, studio lighting"
            }
        ]
    }
]

def generate_image_call(filename, prompt):
    out_path = os.path.join(GENERATED_DIR, filename)

    # Force overwrite/regeneration for fallback files
    force_regenerate = [
        "octo-music-bar-750.png",
        "octo-wireless-airbuds-pro.png",
        "romoss-pct10-powerbank-10000mah.png",
        "ronin-axis-bar-soundbar.png",
        "wiwu-35w-charger.png",
        "samsung-25w-power-adapter-1.png",
        "samsung-25w-power-adapter-2.png"
    ]

    if filename in force_regenerate:
        if os.path.exists(out_path):
            try:
                os.remove(out_path)
                print(f"[FORCE REGENERATE] Removed old fallback copy: {filename}", flush=True)
            except Exception as e:
                print(f"[WARNING] Could not remove old file: {e}", flush=True)
    elif os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
        print(f"[SKIP] Already exists: {filename}", flush=True)
        return True, "already_exists"

    payload = json.dumps({
        "model": MODEL_NAME,
        "prompt": prompt,
        "n": 1,
        "size": "1024x1024",
        "quality": "high",
        "background": "white",
        "image_detail": "high",
        "output_format": "png"
    }).encode("utf-8")

    max_attempts = 10
    for attempt in range(1, max_attempts + 1):
        print(f"  Attempt {attempt}/{max_attempts} -> {filename}...", flush=True)
        req = urllib.request.Request(
            API_URL,
            data=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": AUTH_TOKEN
            }
        )
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                img_entry = data["data"][0]

                if "b64_json" in img_entry and img_entry["b64_json"]:
                    raw = base64.b64decode(img_entry["b64_json"])
                    with open(out_path, "wb") as f:
                        f.write(raw)
                    print(f"  [SUCCESS] {filename} ({len(raw)} bytes)", flush=True)
                    return True, "generated_b64"
                elif "url" in img_entry and img_entry["url"]:
                    urllib.request.urlretrieve(img_entry["url"], out_path)
                    print(f"  [SUCCESS] {filename} (from URL)", flush=True)
                    return True, "generated_url"
                else:
                    print(f"  [FAILED] No image data returned", flush=True)
                    return False, "no_data"

        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="ignore")
            m = re.search(r"reset after (?:(\d+)m\s*)?(\d+)s", body)
            if m:
                mins = int(m.group(1)) if m.group(1) else 0
                secs = int(m.group(2))
                wait = (mins * 60) + secs + 5
            else:
                wait = 60
            print(f"  [RATE LIMITED] HTTP {e.code}. Waiting {wait}s...", flush=True)
            time.sleep(wait)
        except Exception as err:
            print(f"  [ERROR] {err}. Waiting 20s...", flush=True)
            time.sleep(20)

    return False, "max_retries_exceeded"

def sync_products_json():
    """Update products.json with exact mapped generated image URLs"""
    if not os.path.exists(PRODUCTS_JSON):
        print(f"Error: {PRODUCTS_JSON} not found!")
        return False

    with open(PRODUCTS_JSON, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    updated_count = 0
    for prod_def in PRODUCTS:
        target_prod = next((p for p in catalog if p["id"] == prod_def["id"]), None)
        if not target_prod:
            continue

        # Choose primary generated image
        primary_file = prod_def["outputs"][0]["file"]
        primary_path = f"/products/generated-images/{primary_file}"
        all_images = [f"/products/generated-images/{out['file']}" for out in prod_def["outputs"]]

        target_prod["image"] = primary_path
        target_prod["images"] = all_images
        updated_count += 1

    with open(PRODUCTS_JSON, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2)

    print(f"\n[CMS SYNC] Updated {updated_count} products in {PRODUCTS_JSON}")
    return True

def main():
    print("=" * 60)
    print("Starting 9Router E-Commerce Product Image Redesign Pipeline")
    print("=" * 60)

    summary = {}
    total_images = sum(len(p["outputs"]) for p in PRODUCTS)
    processed = 0

    for prod in PRODUCTS:
        print(f"\nProduct: [{prod['id']}] {prod['name']}")
        for out in prod["outputs"]:
            processed += 1
            print(f"Progress ({processed}/{total_images}): {out['file']}")
            ok, reason = generate_image_call(out["file"], out["prompt"])
            summary[out["file"]] = {"success": ok, "reason": reason}
            if ok and reason != "already_exists":
                print("  Cooldown 20s before next call...")
                time.sleep(20)

    # Save log
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    # Sync products.json
    sync_products_json()

    print("\n" + "=" * 60)
    print("PIPELINE EXECUTION COMPLETE")
    print("=" * 60)
    successes = sum(1 for v in summary.values() if v["success"])
    print(f"Total: {total_images} | Succeeded: {successes} | Failed: {total_images - successes}")

if __name__ == "__main__":
    main()
