"""Hero-only unsharp-mask finish for the 21 November 2026 poster.

render.mjs calls this on the downscaled 1024x1024 entry.png as the last
step of the build. The mask is the classic unsharp blend — the image
combined with a Gaussian-blurred copy of itself,
addWeighted(img, k, blur, -(k - 1), 0) with sigma 3.0 and k = 1.5 —
computed over the full frame but pasted back only inside the hero-art
rectangle, so the Antalya dawn scene (lit windows, flag edges, the dawn
glitter on the water, the mountain ridges) regains the bite the Lanczos
downscale took out, while the masthead, panel type and ticker remain
exactly as typeset.

The unsharp function itself is the user's own perjelas_gambar recipe,
written out here in full so the build carries no imports from outside
the repository.

Hero-art rectangle in the final image (poster.html: 24px side padding,
3px frame border, masthead 92px + 10px margin + 16px page top, art
300px tall): x 27..997, y 121..421.

Fixed strength, fixed rectangle, fixed PNG compression: the same input
always yields the same bytes.
"""
import os
import sys

import cv2
import numpy as np

HERO_RECT = (27, 121, 997, 421)  # x0, y0, x1, y1 in the 1024x1024 final
K = 1.5
SIGMA = 3.0
PNG_COMPRESSION = 9


def perjelas_gambar(img, k=K, sigma=SIGMA):
    """Unsharp mask: sharpen img by blending it against its own blur."""
    blurred = cv2.GaussianBlur(img, (0, 0), sigma)
    return cv2.addWeighted(img, k, blurred, -(k - 1.0), 0)


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: sharpen_hero.py <entry.png>")
    path = sys.argv[1]

    img = cv2.imread(path, cv2.IMREAD_COLOR)
    if img is None:
        raise SystemExit(f"cannot read {path}")
    if img.shape[:2] != (1024, 1024):
        raise SystemExit(f"{path} is {img.shape[1]}x{img.shape[0]}, expected 1024x1024")

    sharpened = perjelas_gambar(img)

    x0, y0, x1, y1 = HERO_RECT
    out = np.array(img)
    out[y0:y1, x0:x1] = sharpened[y0:y1, x0:x1]

    before = os.path.getsize(path)
    if not cv2.imwrite(path, out, [cv2.IMWRITE_PNG_COMPRESSION, PNG_COMPRESSION]):
        raise SystemExit(f"failed to write {path}")
    check = cv2.imread(path, cv2.IMREAD_COLOR)
    if check is None or check.shape[:2] != (1024, 1024):
        raise SystemExit(f"{path} did not survive the rewrite at 1024x1024")
    print(f"hero unsharp k={K} sigma={SIGMA} rect={HERO_RECT}: "
          f"{before} -> {os.path.getsize(path)} bytes")


if __name__ == "__main__":
    main()
