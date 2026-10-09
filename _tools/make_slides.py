"""Turn a slide-deck PDF into images for the website's slide viewer.

Usage (from the website folder):
    python3 _tools/make_slides.py <deck.pdf> <deck-id> [first_page] [last_page]

Example: pages 1–12 of an exported Canva PDF become deck "takeover":
    python3 _tools/make_slides.py ~/Downloads/deck.pdf takeover 1 12

This writes assets/slides/<deck-id>/01.jpg, 02.jpg … (1920 px wide),
t01.jpg, t02.jpg … (thumbnails) and <deck-id>.pdf (the selected pages).
Then add the deck to _data/decks.yml with the printed "count".
Requires PyMuPDF and Pillow (both come with Anaconda: pip install pymupdf pillow).
"""
import os
import sys

import pymupdf
from PIL import Image


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    src, deck_id = sys.argv[1], sys.argv[2]
    doc = pymupdf.open(src)
    first = int(sys.argv[3]) if len(sys.argv) > 3 else 1
    last = int(sys.argv[4]) if len(sys.argv) > 4 else len(doc)

    out = os.path.join(os.path.dirname(__file__), "..", "assets", "slides", deck_id)
    os.makedirs(out, exist_ok=True)

    for n, page_no in enumerate(range(first, last + 1), start=1):
        page = doc[page_no - 1]
        zoom = 1920 / page.rect.width
        pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom))
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        img.save(os.path.join(out, f"{n:02d}.jpg"), "JPEG", quality=78, optimize=True, progressive=True)
        thumb = img.copy()
        thumb.thumbnail((320, 180), Image.LANCZOS)
        thumb.save(os.path.join(out, f"t{n:02d}.jpg"), "JPEG", quality=72, optimize=True)

    part = pymupdf.open()
    part.insert_pdf(doc, from_page=first - 1, to_page=last - 1)
    part.save(os.path.join(out, f"{deck_id}.pdf"), garbage=4, deflate=True)
    print(f"{deck_id}: count = {last - first + 1}")


if __name__ == "__main__":
    main()
