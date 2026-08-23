#!/bin/bash

API_URL="http://localhost:20128/v1/images/generations"
AUTH="Bearer sk-3c4a4c44bf0a105c-pbja32-3eb34f78"
OUT_DIR="/c/Users/REHMAN BABA/OneDrive/Desktop/store/public/products/generated-images"

generate() {
  local filename="$1"
  local prompt="$2"
  local outfile="$OUT_DIR/$filename"

  if [ -f "$outfile" ]; then
    echo "SKIP (exists): $filename"
    return
  fi

  echo "Generating: $filename"

  RESPONSE=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: $AUTH" \
    -d "{
      \"model\": \"ag/gemini-3.1-flash-image\",
      \"prompt\": \"$prompt\",
      \"n\": 1,
      \"size\": \"1024x1024\",
      \"quality\": \"high\",
      \"background\": \"white\",
      \"image_detail\": \"high\",
      \"output_format\": \"png\"
    }")

  # Extract base64 or URL
  B64=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data'][0].get('b64_json',''))" 2>/dev/null)
  URL=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data'][0].get('url',''))" 2>/dev/null)

  if [ -n "$B64" ] && [ "$B64" != "None" ]; then
    echo "$B64" | base64 -d > "$outfile"
    echo "SAVED (b64): $filename"
  elif [ -n "$URL" ] && [ "$URL" != "None" ]; then
    curl -s "$URL" -o "$outfile"
    echo "SAVED (url): $filename"
  else
    echo "ERROR: $filename"
    echo "$RESPONSE"
  fi

  sleep 2
}

# ---- PRODUCT IMAGES ----

generate "apple-earpods-usbc.png" \
  "Professional ecommerce product photo of Apple EarPods with USB-C connector on pure white background, 1:1 square format, studio lighting, sharp detail, minimalist style"

generate "apple-25w-adapter-1.png" \
  "Professional ecommerce product photo of Apple 25W USB-C Power Adapter charger plug on pure white background, 1:1 square, studio lighting, high detail"

generate "apple-25w-adapter-2.png" \
  "Professional ecommerce product photo of Apple 25W USB-C Power Adapter from side angle on pure white background, 1:1 square, studio lighting, sharp detail"

generate "apple-airpods-high-quality.png" \
  "Professional ecommerce product photo of Apple AirPods Pro wireless earbuds with charging case open on pure white background, 1:1 square, studio lighting, premium look"

generate "apple-earbuds-high-quality-1.png" \
  "Professional ecommerce product photo of Apple wired earbuds premium model on pure white background, 1:1 square, studio lighting, sharp detail"

generate "apple-earbuds-high-quality-2.png" \
  "Professional ecommerce product photo of Apple wired earbuds premium on pure white background, alternative angle, 1:1 square, studio lighting"

generate "apple-earpods-usbc-2.png" \
  "Professional ecommerce product photo of Apple EarPods USB-C cable detail close up on pure white background, 1:1 square, studio lighting"

generate "apple-earpods-3-high-quality-1.png" \
  "Professional ecommerce product photo of Apple EarPods 3rd generation high quality earphones on pure white background, 1:1 square, studio lighting"

generate "apple-earpods-usbc-3.png" \
  "Professional ecommerce product photo of Apple EarPods with USB-C connector laid flat on pure white background, 1:1 square, overhead studio lighting"

generate "apple-earpods-3-high-quality-2.png" \
  "Professional ecommerce product photo of Apple EarPods 3rd generation earphones close detail on pure white background, 1:1 square, studio lighting"

generate "google-pixel-usbc-cable.png" \
  "Professional ecommerce product photo of Google Pixel USB-C to USB-C charging and data transfer cable neatly coiled on pure white background, 1:1 square, studio lighting"

generate "lunar-ultrapods-max-1.png" \
  "Professional ecommerce product photo of Lunar UltraPods Max true wireless earbuds with open charging case on pure white background, 1:1 square, studio lighting, premium"

generate "lunar-ultrapods-max-2.png" \
  "Professional ecommerce product photo of Lunar UltraPods Max wireless earbuds floating product view on pure white background, 1:1 square, studio lighting"

generate "lunar-anc-enc-earbuds-max.png" \
  "Professional ecommerce product photo of Lunar ANC ENC quad microphone wireless earbuds with case on pure white background, 1:1 square, studio lighting, premium quality"

generate "octo-powerbank-20000mah-fast.png" \
  "Professional ecommerce product photo of Octo 20000mAh fast charging portable power bank on pure white background, 1:1 square, studio lighting, sleek modern design"

generate "octo-4usb-powerbank-50000mah.png" \
  "Professional ecommerce product photo of Octo 50000mAh 4-USB port large capacity power bank on pure white background, 1:1 square, studio lighting"

generate "octo-airbuds-pro2.png" \
  "Professional ecommerce product photo of Octo AirBuds Pro 2 true wireless earbuds with charging case on pure white background, 1:1 square, studio lighting"

generate "octo-music-bar-750.png" \
  "Professional ecommerce product photo of Octo Music Bar 750 portable Bluetooth speaker on pure white background, 1:1 square, studio lighting, modern design"

generate "octo-wireless-airbuds-pro.png" \
  "Professional ecommerce product photo of Octo Wireless AirBuds Pro true wireless earbuds with case on pure white background, 1:1 square, studio lighting"

generate "romoss-pct10-powerbank.png" \
  "Professional ecommerce product photo of Romoss PCT10 10000mAh fast charging slim power bank on pure white background, 1:1 square, studio lighting"

generate "ronin-axis-bar-soundbar.png" \
  "Professional ecommerce product photo of Ronin Axis Bar RGB soundbar speaker with glowing RGB lights on pure white background, 1:1 square, studio lighting, premium"

generate "samsung-25w-pd-adapter-1.png" \
  "Professional ecommerce product photo of Samsung 25W PD fast charging USB-C adapter on pure white background, 1:1 square, studio lighting"

generate "samsung-25w-pd-adapter-2.png" \
  "Professional ecommerce product photo of Samsung 25W USB-C fast charging adapter side view on pure white background, 1:1 square, studio lighting"

generate "wiwu-35w-charger.png" \
  "Professional ecommerce product photo of WIWU 35W high power dual USB-C compact charger on pure white background, 1:1 square, studio lighting"

echo "=== ALL DONE ==="
