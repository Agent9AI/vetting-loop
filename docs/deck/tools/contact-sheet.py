#!/usr/bin/env python3
"""Tile slides/slide-*.png into contact-sheet.png (2 columns). Run from docs/deck."""
from pathlib import Path
from PIL import Image

deck = Path(__file__).resolve().parent.parent
files = sorted((deck / "slides").glob("slide-*.png"))
w, h, gap, cols = 960, 540, 12, 2
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * w + (cols + 1) * gap, rows * h + (rows + 1) * gap), "#1b1f26")
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((w, h), Image.LANCZOS)
    sheet.paste(im, (gap + (i % cols) * (w + gap), gap + (i // cols) * (h + gap)))
sheet.save(deck / "contact-sheet.png", optimize=True)
print(f"{len(files)} slides -> contact-sheet.png")
