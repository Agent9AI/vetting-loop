#!/usr/bin/env python3
"""Aperture (direction 01) in round-2 colorways, plus Mzalendo bonus versions.

The overlap of the two planes is drawn as its own flat shape (no opacity),
so every colorway prints as solid spot colours.
Run: python3 scripts/brand/vetta_aperture.py  -> assets/brand/vetta/aperture/
"""
from vetta_logos import OUT as BASE, H, flip, poly, rect, svg, v_poly, wordmark

OUT = BASE / "aperture"

L_PLANE = [(6, 8), (30, 8), (62, 92), (38, 92)]
R_PLANE = [(70, 8), (94, 8), (62, 92), (38, 92)]
APEX = [(50, 60.5), (62, 92), (38, 92)]  # exact intersection of the planes

# Palette sources are Color Hunt (colorhunt.co) palettes, ranked by likes
# on 2026-09-24; Mzalendo colours are sampled from mzalendo.com's CSS/logo.
# Each side: bg, left plane, right plane, overlap, wordmark.
COLORWAYS = [
    ("r1", "Crimson", "red", "Color Hunt · 13.6k likes",
     "Warm paper, true crimson, near-black. The most editorial of the reds; "
     "reads like a serious newspaper masthead.",
     ("#EEEBDD", "#1B1717", "#CE1212", "#810000", "#1B1717"),
     ("#1B1717", "#EEEBDD", "#CE1212", "#810000", "#EEEBDD")),
    ("r2", "Signal Red", "red", "Color Hunt · 16.0k likes",
     "Cooler, brighter red on neutral grey. The most digital of the reds; "
     "strongest in a product UI.",
     ("#EDEDED", "#171717", "#DA0037", "#6E001C", "#171717"),
     ("#171717", "#EDEDED", "#DA0037", "#6E001C", "#EDEDED")),
    ("r3", "Claret", "red", "Color Hunt · 7.1k likes",
     "Red softened toward wine and anchored in navy-black. Authority "
     "without alarm; the safest red for a vetting body.",
     ("#F6F1EE", "#09122C", "#BE3144", "#872341", "#09122C"),
     ("#09122C", "#F6F1EE", "#BE3144", "#E17564", "#F6F1EE")),
    ("r4", "Red Field", "red", "Color Hunt · 9.7k likes",
     "Red as the ground, not the accent. The overlap is knocked out, so the "
     "apex becomes a literal window. Boldest poster option.",
     ("#CF0A0A", "#000000", "#EEEEEE", "#CF0A0A", "#FFFFFF"),
     ("#000000", "#CF0A0A", "#EEEEEE", "#000000", "#EEEEEE")),
    ("r5", "Oxblood", "red", "Color Hunt · 9.1k likes",
     "Tonal reds that resolve to a dark apex. Dark-mode first; the heaviest "
     "and most premium of the reds.",
     ("#EEEEEE", "#8E1616", "#D84040", "#1D1616", "#1D1616"),
     ("#1D1616", "#8E1616", "#D84040", "#EEEEEE", "#EEEEEE")),
    ("r6", "Blackout", "red", "Color Hunt · 24.2k likes (top red/black)",
     "Pure black and pure red from Color Hunt's most-liked red/black palette. "
     "Maximum punch, least nuance.",
     ("#FFFFFF", "#000000", "#FF0000", "#950101", "#000000"),
     ("#000000", "#FFFFFF", "#FF0000", "#950101", "#FFFFFF")),
    ("p1", "Civic Teal", "picks", "Round 1 baseline",
     "The round-1 palette, kept for comparison. Distinct in a field "
     "crowded with blue and red.",
     ("#F4F5F2", "#0B1220", "#14B8A6", "#0E6A62", "#0B1220"),
     ("#0B1220", "#F4F5F2", "#14B8A6", "#0E6A62", "#F4F5F2")),
    ("p2", "Federal Blue", "picks", "Color Hunt · 46.4k likes (#2 all-time)",
     "Institutional trust. Closest to the language of government, courts "
     "and banks; lowest risk, least distinctive.",
     ("#F9F7F7", "#112D4E", "#3F72AF", "#DBE2EF", "#112D4E"),
     ("#112D4E", "#F9F7F7", "#3F72AF", "#DBE2EF", "#F9F7F7")),
    ("p3", "Slate", "picks", "Color Hunt · 36.1k likes",
     "Monochrome blue-grey. The quietest option; the record carries the "
     "weight, not the logo.",
     ("#EEF2F5", "#27374D", "#9DB2BF", "#526D82", "#27374D"),
     ("#27374D", "#DDE6ED", "#9DB2BF", "#526D82", "#DDE6ED")),
    ("p4", "Graphite & Sand", "picks", "Color Hunt · 12.5k likes",
     "Graphite with a warm stone accent. Reads like an archive or a law "
     "firm: considered, permanent, calm.",
     ("#F3EDE3", "#222831", "#948979", "#393E46", "#222831"),
     ("#222831", "#DFD0B8", "#948979", "#393E46", "#DFD0B8")),
    ("p5", "Evergreen", "picks", "Color Hunt · 4.7k likes",
     "Deep forest green. Nods to Kenya's green without using the flag "
     "outright; calm and civic.",
     ("#F1F6F3", "#091413", "#408A71", "#285A48", "#091413"),
     ("#091413", "#B0E4CC", "#408A71", "#285A48", "#E9F5EF")),
    ("p6", "One Colour", "picks", "Production essential",
     "Single ink with the apex knocked out. The version every identity "
     "needs for stamps, embossing, fax and engraving.",
     ("#FFFFFF", "#000000", "#000000", "#FFFFFF", "#000000"),
     ("#000000", "#FFFFFF", "#FFFFFF", "#000000", "#FFFFFF")),
]

MZ_RED, MZ_GREEN, MZ_BLACK, MZ_WHITE = "#BD141A", "#0D8140", "#111111", "#FFFFFF"


# ---------------------------------------------------------------- mark
def aperture(l, r, o, keyline=None):
    """Two planes and their overlap as three flat shapes."""
    k = (f'stroke="{keyline}" stroke-width="2.4" stroke-linejoin="miter"'
         if keyline else "")
    return poly(L_PLANE, l) + poly(R_PLANE, r) + poly(APEX, o, k)


def lockup(side, mark=None):
    bg, l, r, o, wm = side
    body, w = wordmark(0, 0, color=wm)
    mark = mark or aperture(l, r, o)
    return svg(250 + w + 40, 240,
               f'<g transform="translate(40 40) scale(1.6)">{mark}</g>'
               f'<g transform="translate(250 70)">{body}</g>', bg)


# ------------------------------------------------ extra letters (MZALENDO)
T = 13.5


def path(d, fill):
    return f'<path d="{d}" fill="{fill}" fill-rule="evenodd"/>'


def g_m(x, y, c):
    w = 96
    return (rect(x, y, T, H, c) + rect(x + w - T, y, T, H, c) +
            poly(v_poly(x, y, w, H * 0.72, T * 1.25), c)), w


def g_z(x, y, c):
    w, d = 70, T * 1.25
    return (rect(x, y, w, T, c) + rect(x, y + H - T, w, T, c) +
            poly([(x + w - d, y + T), (x + w, y + T), (x + d, y + H - T),
                  (x, y + H - T)], c)), w


def g_a(x, y, c):
    return poly(flip(v_poly(x, y, 88, H, T * 1.18), y, H), c), 88


def g_l(x, y, c):
    return rect(x, y, T, H, c) + rect(x, y + H - T, 58, T, c), 58 - 12


def g_e(x, y, c):
    return (rect(x, y, T, H, c) + rect(x, y, 64, T, c) +
            rect(x, y + H / 2 - T / 2, 64 * 0.84, T, c) +
            rect(x, y + H - T, 64, T, c)), 64


def g_n(x, y, c):
    w, d = 80, T * 1.3
    return (rect(x, y, T, H, c) + rect(x + w - T, y, T, H, c) +
            poly([(x, y), (x + d, y), (x + w, y + H), (x + w - d, y + H)], c)), w


def g_d(x, y, c):
    w, R, tx = 80, H / 2, T * 1.1
    s = x + w - R
    d = (f"M{x} {y} H{s} A{R} {R} 0 0 1 {s} {y + H} H{x} Z "
         f"M{x + T} {y + T} H{s} A{R - tx} {R - T} 0 0 1 {s} {y + H - T} H{x + T} Z")
    return path(d, c), w


def g_o(x, y, c):
    R, tx, cx, cy = H / 2, T * 1.1, x + H / 2, y + H / 2
    d = (f"M{cx - R} {cy} A{R} {R} 0 1 0 {cx + R} {cy} A{R} {R} 0 1 0 {cx - R} {cy} Z "
         f"M{cx - R + tx} {cy} A{R - tx} {R - T} 0 1 0 {cx + R - tx} {cy} "
         f"A{R - tx} {R - T} 0 1 0 {cx - R + tx} {cy} Z")
    return path(d, c), H


GLYPHS = {"M": g_m, "Z": g_z, "A": g_a, "L": g_l, "E": g_e, "N": g_n,
          "D": g_d, "O": g_o}


def word(text, x, y, c, track=26.0):
    out, cx = [], x
    for ch in text:
        s, w = GLYPHS[ch](cx, y, c)
        out.append(s)
        cx += w + track
    return "".join(out), cx - track - x


# ------------------------------------------------ Mzalendo bonus versions
def mz_flag(dark=False):
    bg = MZ_BLACK if dark else MZ_WHITE
    fg = MZ_WHITE if dark else MZ_BLACK
    return (bg, fg, MZ_RED, MZ_GREEN, fg), aperture(fg, MZ_RED, MZ_GREEN, keyline=bg)


def mz_cobrand(dark=False):
    bg = MZ_BLACK if dark else MZ_WHITE
    fg = MZ_WHITE if dark else MZ_BLACK
    vetta, vw = wordmark(0, 0, color=fg)
    mz, mw = word("MZALENDO", 0, 0, MZ_WHITE if dark else MZ_RED)
    x_div = 250 + vw + 64
    body = (f'<g transform="translate(40 40) scale(1.6)">{aperture(fg, MZ_RED, MZ_GREEN, bg)}</g>'
            f'<g transform="translate(250 70)">{vetta}</g>'
            + rect(x_div, 52, 3, 136, fg) +
            f'<g transform="translate({x_div + 67} 70)">{mz}</g>')
    return svg(x_div + 67 + mw + 48, 240, body, bg)


def mz_badge(dark=False):
    """Echoes Mzalendo's bar logo: black strip | panel | colour strip."""
    vetta, vw = wordmark(0, 0, color=MZ_WHITE)
    pw = 60 + 160 + 50 + vw + 60
    stripes = MZ_WHITE if dark else MZ_BLACK
    body = (rect(0, 0, 36, 240, stripes) + rect(48, 0, pw, 240, MZ_RED) +
            f'<g transform="translate({48 + 60} 40) scale(1.6)">'
            f'{aperture(MZ_WHITE, MZ_BLACK, MZ_GREEN, MZ_RED)}</g>'
            f'<g transform="translate({48 + 270} 70)">{vetta}</g>' +
            rect(48 + pw + 12, 0, 36, 240, MZ_GREEN))
    return svg(48 + pw + 48, 240, body, MZ_BLACK if dark else None)


MZ = [
    ("m1", "Mzalendo Flag",
     "Mzalendo's own red (#BD141A) with Kenyan black and green. The overlap "
     "carries the green, keylined like the flag's white fimbriation."),
    ("m2", "Sister Badge",
     "Borrows the structure of Mzalendo's bar logo (dark strip, colour panel, "
     "strip) so VETTA reads as part of the Mzalendo family."),
    ("m3", "Co-brand Lockup",
     "VETTA and Mzalendo at equal weight for a joint launch. Mzalendo's name "
     "is set in VETTA letterforms as a stand-in for its own logo."),
]


# ---------------------------------------------------------------- contrast
def _lum(h):
    rgb = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def contrast(a, b):
    la, lb = sorted((_lum(a), _lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for key, name, *_, light, dark in COLORWAYS:
        slug = f"{key}-{name.lower().replace(' & ', '-').replace(' ', '-')}"
        for suffix, side in (("", light), ("-reverse", dark)):
            (OUT / f"{slug}-lockup{suffix}.svg").write_text(lockup(side))
            (OUT / f"{slug}-mark{suffix}.svg").write_text(
                svg(100, 100, aperture(*side[1:4]), side[0]))
    for dark, suffix in ((False, ""), (True, "-reverse")):
        side, mark = mz_flag(dark)
        (OUT / f"m1-mzalendo-flag-lockup{suffix}.svg").write_text(lockup(side, mark))
        (OUT / f"m1-mzalendo-flag-mark{suffix}.svg").write_text(svg(100, 100, mark, side[0]))
        (OUT / f"m3-mzalendo-cobrand{suffix}.svg").write_text(mz_cobrand(dark))
        (OUT / f"m2-mzalendo-badge{suffix}.svg").write_text(mz_badge(dark))
    print(OUT)


if __name__ == "__main__":
    main()
