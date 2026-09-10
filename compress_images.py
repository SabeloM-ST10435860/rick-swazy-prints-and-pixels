from pathlib import Path
from PIL import Image, ImageOps
import os
import tempfile

IMAGE_ROOT = Path("assets/images")

# Maximum dimensions for website images
MAX_WIDTH = 1920
MAX_HEIGHT = 1280

# JPEG quality
JPEG_QUALITY = 82

total_before = 0
total_after = 0
processed = 0
skipped = 0


def compress_jpeg(image_path):
    global total_before, total_after, processed, skipped

    original_size = image_path.stat().st_size
    total_before += original_size

    try:
        with Image.open(image_path) as img:

            # Correct phone-camera orientation
            img = ImageOps.exif_transpose(img)

            # JPEG images must use RGB
            if img.mode != "RGB":
                img = img.convert("RGB")

            # Resize while keeping the original proportions
            img.thumbnail(
                (MAX_WIDTH, MAX_HEIGHT),
                Image.Resampling.LANCZOS
            )

            # Create temporary file in the same folder
            temp_fd, temp_name = tempfile.mkstemp(
                suffix=".jpg",
                dir=image_path.parent
            )
            os.close(temp_fd)

            try:
                img.save(
                    temp_name,
                    format="JPEG",
                    quality=JPEG_QUALITY,
                    optimize=True,
                    progressive=True
                )

                compressed_size = os.path.getsize(temp_name)

                # Only replace the original if compression actually
                # makes the file smaller
                if compressed_size < original_size:

                    os.replace(temp_name, image_path)

                    total_after += compressed_size
                    processed += 1

                    saved = original_size - compressed_size
                    percent = (saved / original_size) * 100

                    print(
                        f"COMPRESSED: {image_path}"
                    )
                    print(
                        f"  {original_size / 1024 / 1024:.2f} MB "
                        f"-> {compressed_size / 1024 / 1024:.2f} MB "
                        f"({percent:.1f}% smaller)"
                    )

                else:
                    os.remove(temp_name)
                    total_after += original_size
                    skipped += 1

                    print(f"SKIPPED: {image_path} (already optimized)")

            except Exception:
                if os.path.exists(temp_name):
                    os.remove(temp_name)
                raise

    except Exception as e:
        print(f"ERROR: {image_path}")
        print(f"  {e}")


def compress_png(image_path):
    global total_before, total_after, processed, skipped

    original_size = image_path.stat().st_size
    total_before += original_size

    try:
        with Image.open(image_path) as img:

            # Preserve transparency
            img = ImageOps.exif_transpose(img)

            temp_fd, temp_name = tempfile.mkstemp(
                suffix=".png",
                dir=image_path.parent
            )
            os.close(temp_fd)

            try:
                img.save(
                    temp_name,
                    format="PNG",
                    optimize=True
                )

                compressed_size = os.path.getsize(temp_name)

                if compressed_size < original_size:

                    os.replace(temp_name, image_path)

                    total_after += compressed_size
                    processed += 1

                    saved = original_size - compressed_size
                    percent = (saved / original_size) * 100

                    print(
                        f"COMPRESSED: {image_path}"
                    )
                    print(
                        f"  {original_size / 1024 / 1024:.2f} MB "
                        f"-> {compressed_size / 1024 / 1024:.2f} MB "
                        f"({percent:.1f}% smaller)"
                    )

                else:
                    os.remove(temp_name)
                    total_after += original_size
                    skipped += 1

                    print(f"SKIPPED: {image_path}")

            except Exception:
                if os.path.exists(temp_name):
                    os.remove(temp_name)
                raise

    except Exception as e:
        print(f"ERROR: {image_path}")
        print(f"  {e}")


print("=" * 60)
print("RICK SWAZY PRINTS & PIXELS")
print("Website Image Compression")
print("=" * 60)
print()

# Process images while preserving filenames and folders
for image_path in IMAGE_ROOT.rglob("*"):

    # Never touch the backup folder
    if "images-backup" in image_path.parts:
        continue

    if not image_path.is_file():
        continue

    extension = image_path.suffix.lower()

    if extension in [".jpg", ".jpeg"]:
        compress_jpeg(image_path)

    elif extension == ".png":
        compress_png(image_path)

print()
print("=" * 60)
print("COMPRESSION COMPLETE")
print("=" * 60)

print(
    f"Files compressed: {processed}"
)

print(
    f"Files skipped:    {skipped}"
)

print(
    f"Original size:    {total_before / 1024 / 1024:.2f} MB"
)

print(
    f"Final size:       {total_after / 1024 / 1024:.2f} MB"
)

if total_before > 0:
    saved = total_before - total_after
    percent = (saved / total_before) * 100

    print(
        f"Space saved:      {saved / 1024 / 1024:.2f} MB"
    )

    print(
        f"Overall reduction: {percent:.1f}%"
    )

print("=" * 60)