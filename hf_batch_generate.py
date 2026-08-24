import os
import time
import shutil
from gradio_client import Client, handle_file

# Hugging Face token read from environment variable
TOKEN = os.environ.get("HF_TOKEN", "")
QUICK_SHARE_DIR = os.path.join("public", "products", "Download", "Quick Share")

def main():
    print("=== STARTING EXCELLENCE BATCH IMAGE GENERATION ===", flush=True)

    # We will attempt FLUX.1-Kontext-dev first with the new token.
    # If limit hits, fallback instantly to Gemini899/img2img space.
    client_flux = None
    client_sdxl = None

    try:
        print("[CONNECTING] Connecting to FLUX.1-Kontext-dev...", flush=True)
        client_flux = Client("black-forest-labs/FLUX.1-Kontext-dev", headers={"Authorization": f"Bearer {TOKEN}"})
        print("  -> Connected to FLUX.1-Kontext-dev!", flush=True)
    except Exception as e:
        print(f"  -> FLUX connection failed/limited: {e}", flush=True)

    try:
        print("[CONNECTING] Connecting to Gemini899/img2img (SDXL-Turbo)...", flush=True)
        client_sdxl = Client("Gemini899/img2img", headers={"Authorization": f"Bearer {TOKEN}"})
        print("  -> Connected to Gemini899/img2img!", flush=True)
    except Exception as e:
        print(f"  -> SDXL space connection failed: {e}", flush=True)

    folders = [f for f in os.listdir(QUICK_SHARE_DIR) if os.path.isdir(os.path.join(QUICK_SHARE_DIR, f))]

    start_time = time.time()
    count = 0

    for idx, folder_name in enumerate(folders, 1):
        folder_path = os.path.join(QUICK_SHARE_DIR, folder_name)

        # Source images
        image_files = [
            f for f in os.listdir(folder_path)
            if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))
            and not f.startswith('generated_')
        ]

        if not image_files:
            print(f"[{idx}/{len(folders)}] Skipping '{folder_name}' (No source image)", flush=True)
            continue

        ref_image_name = image_files[0]
        ref_image_path = os.path.join(folder_path, ref_image_name)
        output_image_path = os.path.join(folder_path, "generated_product.png")

        if os.path.exists(output_image_path):
            print(f"[{idx}/{len(folders)}] Already exists for '{folder_name}'. Skipping.", flush=True)
            continue

        prompt = (
            f"Ultra clean commercial studio product photography of {folder_name}, placement on minimalist polished white podium, "
            f"soft studio lighting, neutral luxury background, sharp focus, 8k resolution, crisp detail"
        )

        print(f"[{idx}/{len(folders)}] Generating for '{folder_name}'...", flush=True)
        success = False

        # Try FLUX first
        if client_flux and not success:
            try:
                call_start = time.time()
                res = client_flux.predict(
                    input_image=handle_file(ref_image_path),
                    prompt=prompt,
                    seed=42 + idx,
                    randomize_seed=True,
                    guidance_scale=2.5,
                    steps=20,
                    api_name="/infer"
                )
                temp_file = res[0] if isinstance(res, (tuple, list)) else res
                shutil.copy(temp_file, output_image_path)
                dur = round(time.time() - call_start, 2)
                print(f"  [FLUX SUCCESS] Generated in {dur}s -> Saved", flush=True)
                success = True
                count += 1
            except Exception as e:
                print(f"  [FLUX LIMIT/ERROR]: {e}. Falling back to SDXL...", flush=True)
                client_flux = None  # Disable FLUX for rest of script if quota hit

        # Fallback to SDXL-Turbo
        if client_sdxl and not success:
            try:
                call_start = time.time()
                res = client_sdxl.predict(
                    image=handle_file(ref_image_path),
                    prompt=prompt,
                    strength=0.55,
                    seed=100 + idx,
                    inference_step=8,
                    api_name="/process_images"
                )
                temp_file = res[0] if isinstance(res, (tuple, list)) else res
                shutil.copy(temp_file, output_image_path)
                dur = round(time.time() - call_start, 2)
                print(f"  [SDXL SUCCESS] Generated in {dur}s -> Saved", flush=True)
                success = True
                count += 1
            except Exception as e:
                print(f"  [SDXL ERROR] Failed generating for '{folder_name}': {e}", flush=True)

    total_time = round(time.time() - start_time, 2)
    print(f"\n==========================================", flush=True)
    print(f"BATCH FINISHED: {count} images generated/updated in {total_time}s!", flush=True)
    print(f"==========================================", flush=True)

if __name__ == "__main__":
    main()
