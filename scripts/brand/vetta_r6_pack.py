#!/usr/bin/env python3
"""VETTA Aperture R6 Blackout: final logo delivery package.

Builds the client hand-off set a logo designer would supply: vector masters
(SVG, PDF, EPS), high-resolution transparent PNGs, web and favicon icons, and
a two-page usage guide. All artwork is on transparent grounds, trimmed to the
art, and every version prints in solid spot colours (no opacity, no effects).

Needs cairosvg, Pillow and pypdf:
  python3 -m venv /tmp/venv && /tmp/venv/bin/pip install cairosvg pillow pypdf
  /tmp/venv/bin/python scripts/brand/vetta_r6_pack.py [OUT_DIR]
"""
import io
import sys
from pathlib import Path

import cairosvg
from PIL import Image
from pypdf import PdfWriter

from vetta_aperture import APEX, L_PLANE, R_PLANE
from vetta_logos import OUT as BASE, poly, wordmark

NAME = "VETTA_R6_Blackout"
BLACK, WHITE, RED, DEEP = "#000000", "#FFFFFF", "#FF0000", "#950101"

# Left plane and right plane with the apex cut away (one-colour versions).
L_CUT = [(6, 8), (30, 8), (50, 60.5), (38, 92)]
R_CUT = [(70, 8), (94, 8), (62, 92), (50, 60.5)]

MARK_BOX = (6, 8, 88, 84)          # x, y, w, h of the mark's drawn art
WM_W = wordmark()[1]               # wordmark width at cap height 100
WM_H = 100.0


# ---------------------------------------------------------------- artwork
def mark(ink, one_colour=False):
    if one_colour:
        return poly(L_CUT, ink) + poly(R_CUT, ink)
    return poly(L_PLANE, ink) + poly(R_PLANE, RED) + poly(APEX, DEEP)


def doc(w, h, body, bg=None):
    b = f'<rect width="{w:.2f}" height="{h:.2f}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" '
            f'width="{w:.2f}" height="{h:.2f}">{b}{body}</svg>\n')


def place_mark(x, y, s, ink, one):
    """Mark art (not its 100-unit box) with its top-left at (x, y)."""
    mx, my = MARK_BOX[:2]
    return (f'<g transform="translate({x - mx * s:.3f} {y - my * s:.3f}) '
            f'scale({s})">{mark(ink, one)}</g>')


def horizontal(ink, one=False):
    # Same proportions as the round-2 boards: mark 1.6x, wordmark centred.
    s = 1.6
    mh, mw = MARK_BOX[3] * s, MARK_BOX[2] * s
    gap = 250 - (40 + 94 * s)                      # 59.6, as approved
    w = mw + gap + WM_W
    wm = wordmark(0, 0, color=ink)[0]
    body = (place_mark(0, 0, s, ink, one) +
            f'<g transform="translate({mw + gap:.3f} {(mh - WM_H) / 2:.3f})">{wm}</g>')
    return doc(w, mh, body)


def stacked(ink, one=False):
    s = 2.2
    mh, mw = MARK_BOX[3] * s, MARK_BOX[2] * s
    gap = 64
    wm = wordmark(0, 0, color=ink)[0]
    body = (place_mark((WM_W - mw) / 2, 0, s, ink, one) +
            f'<g transform="translate(0 {mh + gap:.3f})">{wm}</g>')
    return doc(WM_W, mh + gap + WM_H, body)


def mark_only(ink, one=False):
    return doc(MARK_BOX[2], MARK_BOX[3], place_mark(0, 0, 1, ink, one))


def wordmark_only(ink):
    return doc(WM_W, WM_H, wordmark(0, 0, color=ink)[0])


# (file stem, svg, ground it is designed for)
def variants():
    out = []
    for kind, fn in (("Horizontal", horizontal), ("Stacked", stacked),
                     ("Mark", mark_only)):
        out += [(f"{kind}_FullColour_Positive", fn(BLACK), "light"),
                (f"{kind}_FullColour_Reverse", fn(WHITE), "dark"),
                (f"{kind}_OneColour_Black", fn(BLACK, True), "light"),
                (f"{kind}_OneColour_White", fn(WHITE, True), "dark")]
    out += [("Wordmark_Black", wordmark_only(BLACK), "light"),
            ("Wordmark_White", wordmark_only(WHITE), "dark")]
    return out


# ---------------------------------------------------------------- exports
def png(svg_text, width, bg=None):
    data = cairosvg.svg2png(bytestring=svg_text.encode(), output_width=width,
                            background_color=bg)
    return Image.open(io.BytesIO(data)).convert("RGBA")


def export_art(out):
    vec, hi, web = out / "01_Vector", out / "02_PNG_HighRes", out / "03_PNG_Web"
    for d in (vec / "SVG", vec / "PDF", vec / "EPS", hi, web):
        d.mkdir(parents=True, exist_ok=True)
    for stem, s, _ in variants():
        f = f"{NAME}_{stem}"
        (vec / "SVG" / f"{f}.svg").write_text(s)
        cairosvg.svg2pdf(bytestring=s.encode(), write_to=str(vec / "PDF" / f"{f}.pdf"))
        cairosvg.svg2eps(bytestring=s.encode(), write_to=str(vec / "EPS" / f"{f}.eps"))
        big = 3000 if stem.startswith("Mark") else 5000
        png(s, big).save(hi / f"{f}_{big}px.png", optimize=True)
        png(s, 1000).save(web / f"{f}_1000px.png", optimize=True)


def square_icon(size, bg, pad):
    """Full-colour mark centred on a square ground (pad = fraction per side)."""
    inner = size * (1 - 2 * pad)
    s = inner / MARK_BOX[2]
    x = (size - MARK_BOX[2] * s) / 2
    y = (size - MARK_BOX[3] * s) / 2
    ink = WHITE if bg == BLACK else BLACK
    return doc(size, size, place_mark(x, y, s, ink, False), bg)


def export_icons(out):
    d = out / "04_Web_Icons"
    d.mkdir(parents=True, exist_ok=True)
    # Favicons: black tile, tight padding so the V holds at 16 px.
    (d / "favicon.svg").write_text(square_icon(64, BLACK, 0.08))
    frames = [png(square_icon(n, BLACK, 0.08), n) for n in (16, 32, 48)]
    frames[-1].save(d / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)],
                    append_images=frames[:-1])
    for n in (16, 32, 48):
        png(square_icon(n, BLACK, 0.08), n).save(d / f"favicon-{n}.png")
    png(square_icon(180, BLACK, 0.16), 180).save(d / "apple-touch-icon-180.png")
    for n in (192, 512):
        png(square_icon(n, BLACK, 0.16), n).save(d / f"android-icon-{n}.png")
    # Maskable icon keeps the art inside the 80% safe zone.
    png(square_icon(512, BLACK, 0.24), 512).save(d / "android-icon-512-maskable.png")
    png(square_icon(1080, BLACK, 0.22), 1080).save(d / "social-avatar-black-1080.png")
    png(square_icon(1080, WHITE, 0.22), 1080).save(d / "social-avatar-white-1080.png")


# ---------------------------------------------------------------- guide
PW, PH = 842.0, 595.0              # A4 landscape, points
FONT = "Liberation Sans, DejaVu Sans, sans-serif"


def text(x, y, s, size=9, fill="#1A1A1A", weight="normal", anchor="start", ls=0):
    s = s.replace("&", "&amp;")
    return (f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" '
            f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" '
            f'letter-spacing="{ls}">{s}</text>')


def embed(svg_text, x, y, w):
    """Nest a generated SVG at (x, y), scaled to width w."""
    inner = svg_text.split(">", 1)[1].rsplit("</svg>", 1)[0]
    vb = svg_text.split('viewBox="', 1)[1].split('"', 1)[0]
    vw, vh = (float(v) for v in vb.split()[2:])
    h = w * vh / vw
    return (f'<svg x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" '
            f'viewBox="{vb}">{inner}</svg>'), h


def header(n, title):
    return (text(48, 52, "VETTA  /  LOGO GUIDELINES", 10, weight="bold", ls=2.4) +
            text(PW - 48, 52, f"R6 BLACKOUT  ·  {n} / 2", 8, "#6B6B6B", anchor="end", ls=1.6) +
            f'<rect x="48" y="62" width="{PW - 96}" height="1.2" fill="#000"/>' +
            text(48, 92, title, 16, weight="bold"))


def tile(x, y, w, h, bg, art, label, art_w):
    g, ah = embed(art, 0, 0, art_w)
    g = g.replace('x="0.00" y="0.00"',
                  f'x="{x + (w - art_w) / 2:.2f}" y="{y + (h - 18 - ah) / 2:.2f}"')
    lab = "#6B6B6B" if bg != BLACK else "#9A9A9A"
    stroke = ' stroke="#DDDDDD" stroke-width="0.8"' if bg == WHITE else ""
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{bg}"{stroke}/>' +
            g + text(x + 10, y + h - 9, label, 7, lab, ls=0.6))


def page_one():
    b = [header(1, "Logo versions")]
    b.append(text(48, 110, "Use the full-colour logo wherever possible. Choose the "
                  "version built for the ground it sits on.", 9, "#4A4A4A"))
    rows = [
        (tile(48, 128, 360, 150, WHITE, horizontal(BLACK), "PRIMARY  ·  HORIZONTAL, POSITIVE", 300),
         tile(424, 128, 370, 150, BLACK, horizontal(WHITE), "PRIMARY  ·  HORIZONTAL, REVERSE", 300)),
        (tile(48, 294, 176, 150, WHITE, stacked(BLACK), "STACKED", 120),
         tile(232, 294, 176, 150, BLACK, stacked(WHITE), "STACKED, REVERSE", 120)),
        (tile(424, 294, 118, 150, WHITE, mark_only(BLACK), "MARK", 70),
         tile(550, 294, 118, 150, BLACK, mark_only(WHITE), "MARK, REVERSE", 70)),
        (tile(676, 294, 118, 150, WHITE, mark_only(BLACK, True), "ONE COLOUR", 70),
         tile(48, 460, 360, 90, WHITE, horizontal(BLACK, True), "ONE COLOUR  ·  STAMPS, EMBOSSING, ENGRAVING", 200)),
        (tile(424, 460, 370, 90, WHITE, wordmark_only(BLACK), "WORDMARK ONLY  ·  WHEN THE MARK APPEARS NEARBY", 170),),
    ]
    for r in rows:
        b += list(r)
    return doc(PW, PH, "".join(b), WHITE)


def swatch(x, y, hex_, name, rows, border=False):
    s = ' stroke="#CCCCCC" stroke-width="0.8"' if border else ""
    g = [f'<rect x="{x}" y="{y}" width="160" height="56" fill="{hex_}"{s}/>',
         text(x, y + 72, name, 9, weight="bold")]
    for i, (k, v) in enumerate(rows):
        g.append(text(x, y + 86 + i * 11, k, 7, "#6B6B6B", ls=0.5))
        g.append(text(x + 44, y + 86 + i * 11, v, 7))
    return "".join(g)


def page_two():
    b = [header(2, "Colour, clear space and minimum size")]
    sw = [
        (BLACK, "VETTA Black", [("HEX", "#000000"), ("RGB", "0 0 0"),
                                ("CMYK", "0 0 0 100 (type)"), ("RICH", "60 40 40 100 (large areas)"),
                                ("PANTONE", "Black 6 C *")], False),
        (RED, "Signal Red", [("HEX", "#FF0000"), ("RGB", "255 0 0"),
                             ("CMYK", "0 100 100 0 †"), ("PANTONE", "485 C *")], False),
        (DEEP, "Apex Red", [("HEX", "#950101"), ("RGB", "149 1 1"),
                            ("CMYK", "0 99 99 42"), ("PANTONE", "7622 C *")], False),
        (WHITE, "Paper White", [("HEX", "#FFFFFF"), ("RGB", "255 255 255"),
                                ("CMYK", "0 0 0 0"), ("PANTONE", "none (unprinted)")], True),
    ]
    for i, (h, n, rows, br) in enumerate(sw):
        b.append(swatch(48 + i * 186, 116, h, n, rows, br))

    # Clear space diagram: X = width of one plane at the top of the mark.
    s = 100 / 88
    x0, y0 = 90, 356
    xu = 24 * s
    b.append(f'<rect x="{x0 - xu:.1f}" y="{y0 - xu:.1f}" width="{88 * s + 2 * xu:.1f}" '
             f'height="{84 * s + 2 * xu:.1f}" fill="none" stroke="#FF0000" '
             f'stroke-width="0.8" stroke-dasharray="3 3"/>')
    b.append(place_mark(x0, y0, s, BLACK, False))
    b.append(f'<rect x="{x0:.1f}" y="{y0 - 8:.1f}" width="{xu:.1f}" height="3" fill="#FF0000"/>')
    b.append(text(x0 + xu / 2, y0 - 12, "X", 8, "#FF0000", "bold", "middle"))
    b.append(text(48, 312, "CLEAR SPACE", 8, weight="bold", ls=1.2))
    b.append(text(48, 500, "Keep at least X clear on all sides, where X is the", 8, "#4A4A4A"))
    b.append(text(48, 511, "width of one plane at the top of the mark.", 8, "#4A4A4A"))

    b.append(text(320, 312, "MINIMUM SIZE", 8, weight="bold", ls=1.2))
    b.append(embed(horizontal(BLACK), 320, 330, 96)[0])
    b.append(text(320, 372, "Horizontal: 25 mm / 120 px wide", 8, "#4A4A4A"))
    b.append(embed(mark_only(BLACK), 320, 392, 16)[0])
    b.append(text(344, 404, "Mark: 6 mm / 16 px", 8, "#4A4A4A"))

    b.append(text(560, 312, "DO NOT", 8, weight="bold", ls=1.2))
    donts = ["Recolour the planes or swap the reds",
             "Add shadows, gradients, outlines or transparency",
             "Stretch, skew, rotate or re-space the wordmark",
             "Retype VETTA in a font; the letters are custom drawn",
             "Place full colour on red or busy photography;",
             "   use the one-colour white version instead"]
    for i, d in enumerate(donts):
        b.append(text(560, 330 + i * 14, ("×  " if not d.startswith(" ") else "") + d.strip(),
                      8, "#4A4A4A"))

    b.append(f'<rect x="48" y="548" width="{PW - 96}" height="0.6" fill="#CCCCCC"/>')
    b.append(text(48, 562, "* Pantone references are screen-derived starting points; "
                  "confirm against a printed Pantone guide before a spot-colour run.", 7, "#6B6B6B"))
    b.append(text(48, 573, "† #FF0000 is brighter than any CMYK ink can print. Process "
                  "print will read deeper; specify the Pantone spot where colour is critical.",
                  7, "#6B6B6B"))
    return doc(PW, PH, "".join(b), WHITE)


def export_guide(out):
    d = out / "05_Guidelines"
    d.mkdir(parents=True, exist_ok=True)
    w = PdfWriter()
    for i, page in enumerate((page_one(), page_two()), 1):
        w.append(io.BytesIO(cairosvg.svg2pdf(bytestring=page.encode())))
        png(page, 2400).convert("RGB").save(d / f"{NAME}_Guidelines_p{i}.png", optimize=True)
    with open(d / f"{NAME}_Logo_Guidelines.pdf", "wb") as f:
        w.write(f)


README = f"""VETTA  -  Aperture logo, R6 Blackout
Final artwork package

FOLDERS
01_Vector        Master artwork. SVG (web, apps), PDF (print, Office),
                 EPS (sign shops, embroidery, legacy software). Scales to any size.
02_PNG_HighRes   Transparent PNG. 5000 px wide (logos), 3000 px (mark).
03_PNG_Web       Transparent PNG, 1000 px wide, for slides and documents.
04_Web_Icons     favicon.ico / favicon.svg, Apple and Android icons,
                 1080 px social avatars (black and white grounds).
05_Guidelines    Two-page logo guide: versions, colour, clear space, don'ts.

WHICH FILE
Positive   = for white or light backgrounds.
Reverse    = for black or dark backgrounds.
OneColour  = single ink: stamps, embossing, engraving, fax, one-colour print.
Horizontal is the primary logo. Use Stacked where width is limited, and the
Mark alone for icons and avatars.

COLOUR
Black        #000000   RGB 0 0 0       CMYK 0 0 0 100
Signal Red   #FF0000   RGB 255 0 0     CMYK 0 100 100 0
Apex Red     #950101   RGB 149 1 1     CMYK 0 99 99 42
Pantone references in the guide are unconfirmed starting points; match them
against a printed Pantone guide before a spot-colour run.

All artwork is on a transparent ground and trimmed to the art. Letterforms are
drawn shapes, not type, so no fonts are needed to open or print any file.

Agent9  -  agent9.dev
"""


def main():
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else BASE / "r6-blackout" / f"{NAME}_Logo_Package"
    out.mkdir(parents=True, exist_ok=True)
    export_art(out)
    export_icons(out)
    export_guide(out)
    (out / "README.txt").write_text(README)
    print(out)


if __name__ == "__main__":
    main()
