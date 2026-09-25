#!/usr/bin/env python3
"""Generate the deck's security-print artwork (guilloche rosette, band, seal).

Pure vector, deterministic. Run from docs/deck:  python3 tools/make-art.py
"""
import base64
import math
from pathlib import Path

DECK = Path(__file__).resolve().parent.parent
OUT = DECK / "art"
# Seals are used as <img>, which cannot see page fonts, so the face is embedded.
FONT = base64.b64encode((DECK / "fonts/ibm-plex-sans-latin-600-normal.woff2").read_bytes()).decode()
APERTURE = (
    '<polygon points="6,8 30,8 62,92 38,92" fill="{a}"/>'
    '<polygon points="70,8 94,8 62,92 38,92" fill="#14B8A6" fill-opacity="0.8"/>'
)


def path(points):
    head, *rest = points
    return "M{:.1f},{:.1f}".format(*head) + "".join("L{:.1f},{:.1f}".format(*p) for p in rest) + "Z"


def rosette(cx, cy, r0, amp, lobes, copies, twist, steps=640):
    """Rotated copies of a lobed ring; overlapping copies give the engraved moire."""
    out = []
    for c in range(copies):
        ph = 2 * math.pi * c / copies
        pts = []
        for i in range(steps):
            t = 2 * math.pi * i / steps
            r = r0 + amp * math.sin(lobes * t + ph) * math.cos(twist * t - ph)
            pts.append((cx + r * math.cos(t), cy + r * math.sin(t)))
        out.append(path(pts))
    return out


def spiro(cx, cy, big, small, pen, copies, steps=2400):
    """Hypotrochoid flower, the engraved centre of a banknote rosette."""
    out = []
    turns = small // math.gcd(big, small)
    for c in range(copies):
        ph = 2 * math.pi * c / (copies * big / math.gcd(big, small))
        pts = []
        for i in range(steps):
            t = 2 * math.pi * turns * i / steps
            k = (big - small) / small
            x = (big - small) * math.cos(t + ph) + pen * math.cos(k * t - ph)
            y = (big - small) * math.sin(t + ph) - pen * math.sin(k * t - ph)
            pts.append((cx + x, cy + y))
        out.append(path(pts))
    return out


def rosette_svg(stroke, size=1400):
    c = size / 2
    rings = spiro(c, c, 150, 40, 66, 3)
    rings += rosette(c, c, 640, 34, 24, 18, 3)
    rings += rosette(c, c, 520, 48, 18, 22, 2)
    rings += rosette(c, c, 380, 60, 12, 26, 1)
    rings += rosette(c, c, 230, 44, 9, 20, 2)
    body = "".join(f'<path d="{d}"/>' for d in rings)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">'
            f'<g fill="none" stroke="{stroke}" stroke-width="0.9">{body}</g></svg>')


def band_svg(stroke, w=1920, h=90, lines=14):
    out = []
    for k in range(lines):
        ph = 2 * math.pi * k / lines
        pts = [(x, h / 2 + (h * 0.42) * math.sin(x / 38 + ph) * math.cos(x / 211 - ph))
               for x in range(0, w + 1, 3)]
        head, *rest = pts
        out.append("M{:.1f},{:.1f}".format(*head) + "".join("L{:.1f},{:.1f}".format(*p) for p in rest))
    body = "".join(f'<path d="{d}"/>' for d in out)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" preserveAspectRatio="none">'
            f'<g fill="none" stroke="{stroke}" stroke-width="0.8">{body}</g></svg>')


def seal_svg(ink, paper, accent, text):
    s, c = 600, 300
    inner = "".join(f'<path d="{d}"/>' for d in rosette(c, c, 160, 13, 20, 16, 2, steps=700))
    ticks = "".join(
        f'<line x1="{c + 276 * math.cos(a):.1f}" y1="{c + 276 * math.sin(a):.1f}" '
        f'x2="{c + 284 * math.cos(a):.1f}" y2="{c + 284 * math.sin(a):.1f}"/>'
        for a in (2 * math.pi * i / 120 for i in range(120)))
    mark = APERTURE.format(a=ink)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {s} {s}">
<style>@font-face{{font-family:"IBM Plex Sans";font-weight:600;src:url(data:font/woff2;base64,{FONT}) format("woff2")}}</style>
<defs><path id="ring" d="M{c},{c} m-232,0 a232,232 0 1,1 464,0 a232,232 0 1,1 -464,0"/></defs>
<circle cx="{c}" cy="{c}" r="292" fill="{paper}" stroke="{ink}" stroke-width="3"/>
<g stroke="{ink}" stroke-width="1.4">{ticks}</g>
<circle cx="{c}" cy="{c}" r="268" fill="none" stroke="{ink}" stroke-width="1.5"/>
<circle cx="{c}" cy="{c}" r="200" fill="none" stroke="{ink}" stroke-width="1.5"/>
<text font-family="IBM Plex Sans" font-weight="600" font-size="27" letter-spacing="7" fill="{ink}">
<textPath href="#ring" startOffset="0" textLength="1452" lengthAdjust="spacing">{text}</textPath></text>
<g fill="none" stroke="{accent}" stroke-width="0.8" opacity="0.55">{inner}</g>
<circle cx="{c}" cy="{c}" r="118" fill="{paper}" stroke="{ink}" stroke-width="1.5"/>
<g transform="translate({c - 70} {c - 70}) scale(1.4)">{mark}</g>
</svg>'''


def main():
    OUT.mkdir(exist_ok=True)
    (OUT / "rosette-dark.svg").write_text(rosette_svg("#6FD3C4"))
    (OUT / "rosette-light.svg").write_text(rosette_svg("#0B1220"))
    (OUT / "band-dark.svg").write_text(band_svg("#6FD3C4"))
    (OUT / "band-light.svg").write_text(band_svg("#0B1220"))
    ring = "VETTA · PUBLIC APPOINTMENTS RECORD · OPEN · VERIFIABLE · "
    (OUT / "seal.svg").write_text(seal_svg("#0B1220", "#F4F5F2", "#0F766E", ring))
    (OUT / "seal-reverse.svg").write_text(seal_svg("#F4F5F2", "#0B1220", "#6FD3C4", ring))


if __name__ == "__main__":
    main()
