#!/usr/bin/env python3
"""Generate the VETTA identity concepts as pure-vector SVG.

Every glyph is a drawn polygon (no font dependency), so the files render
identically everywhere and can go straight to print or a sign shop.
Run: python3 scripts/brand/vetta_logos.py  -> assets/brand/vetta/
"""
import math
from pathlib import Path

OUT = Path(__file__).resolve().parents[2] / "assets" / "brand" / "vetta"

INK = "#0B1220"      # primary ink (near-black navy)
PAPER = "#F4F5F2"    # warm off-white
SIGNAL = "#14B8A6"   # civic teal: the single accent
STEEL = "#64748B"    # secondary neutral

H = 100.0            # cap height of the wordmark


# ---------------------------------------------------------------- geometry
def pts(p):
    return " ".join(f"{x:.2f},{y:.2f}" for x, y in p)


def poly(p, fill, extra=""):
    return f'<polygon points="{pts(p)}" fill="{fill}" {extra}/>'


def rect(x, y, w, h, fill, extra=""):
    return f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" fill="{fill}" {extra}/>'


def v_poly(x, y, w, h, tw):
    """Filled V with horizontal terminals. tw = horizontal stroke width."""
    a = w / 2 - tw / 2
    yi = h * (w - 2 * tw) / (2 * a)          # inner apex height
    return [(x, y), (x + tw, y), (x + w / 2, y + yi), (x + w - tw, y),
            (x + w, y), (x + w / 2 + tw / 2, y + h), (x + w / 2 - tw / 2, y + h)]


def flip(p, y, h):
    return [(px, 2 * y + h - py) for px, py in p]


# ---------------------------------------------------------------- wordmark
def wordmark(x=0.0, y=0.0, t=13.5, track=26.0, color=INK, accent=None,
             tt_ligature=False, a_bar=False):
    """Custom geometric VETTA. Returns (svg, width)."""
    tw = t * 1.18                           # diagonals read lighter; compensate
    g, cx = [], x
    # V
    g.append(poly(v_poly(cx, y, 88, H, tw), color)); cx += 88 + track
    # E: stem + three arms; middle arm shorter, optionally in accent
    ew = 64
    g.append(rect(cx, y, t, H, color))
    g.append(rect(cx, y, ew, t, color))
    g.append(rect(cx, y + H / 2 - t / 2, ew * 0.84, t, accent or color))
    g.append(rect(cx, y + H - t, ew, t, color))
    cx += ew + track
    # T T
    tw_ = 72
    if tt_ligature:
        span = tw_ * 2 + track * 0.55
        g.append(rect(cx, y, span, t, color))
        g.append(rect(cx + tw_ / 2 - t / 2, y, t, H, color))
        g.append(rect(cx + span - tw_ / 2 - t / 2, y, t, H, color))
        cx += span + track
    else:
        for _ in range(2):
            g.append(rect(cx, y, tw_, t, color))
            g.append(rect(cx + tw_ / 2 - t / 2, y, t, H, color))
            cx += tw_ + track
    # A (a V flipped; crossbar optional)
    aw = 88
    g.append(poly(flip(v_poly(cx, y, aw, H, tw), y, H), color))
    if a_bar:
        by = y + H * 0.64
        a = aw / 2 - tw / 2
        off = a * (H - (by - y)) / H        # inner edge offset at bar height
        xl = cx + tw + a - off - tw * 0.2
        xr = cx + aw - tw - a + off + tw * 0.2
        g.append(rect(xl, by, xr - xl, t * 0.9, accent or color))
    cx += aw
    return "\n".join(g), cx - x


# ---------------------------------------------------------------- marks
# Each mark draws inside a 100x100 box at (x, y) scaled by s.
def mark_aperture(c1=INK, c2=SIGNAL, bg=None):
    """Two translucent planes whose overlap forms the V apex."""
    L = [(6, 8), (30, 8), (62, 92), (38, 92)]
    R = [(70, 8), (94, 8), (62, 92), (38, 92)]
    return (f'<g style="isolation:isolate">{poly(L, c1)}'
            f'{poly(R, c2, "fill-opacity=\'0.8\'")}</g>')


def mark_ledger(c=INK, acc=SIGNAL):
    """A V assembled from ledger rows: the public record, line by line."""
    g, rows, gap = [], 6, 4.2
    rh = (84 - gap * (rows - 1)) / rows
    for i in range(rows):
        y0 = 8 + i * (rh + gap)
        # V edges at this row (outer edges of a V 88 wide, stroke 26)
        def xs(yy):
            f = (yy - 8) / 84
            return 6 + f * 37, 94 - f * 37, 6 + 26 + f * 18, 94 - 26 - f * 18
        a0, b0, ai0, bi0 = xs(y0)
        a1, b1, ai1, bi1 = xs(y0 + rh)
        fill = acc if i == rows - 1 else c
        if ai1 < bi1 and ai0 < bi0:     # two separate segments
            g.append(poly([(a0, y0), (ai0, y0), (ai1, y0 + rh), (a1, y0 + rh)], fill))
            g.append(poly([(bi0, y0), (b0, y0), (b1, y0 + rh), (bi1, y0 + rh)], fill))
        else:
            g.append(poly([(a0, y0), (b0, y0), (b1, y0 + rh), (a1, y0 + rh)], fill))
    return "\n".join(g)


def mark_dial(c=INK, acc=SIGNAL):
    """Combination-dial seal: security ring, 40 graduations, open V."""
    g = [f'<circle cx="50" cy="50" r="46" fill="none" stroke="{c}" stroke-width="3.2"/>']
    for i in range(40):
        ang = math.radians(i * 9 - 90)
        r1 = 41.5 if i % 5 else 38.5
        g.append(f'<line x1="{50 + r1 * math.cos(ang):.2f}" y1="{50 + r1 * math.sin(ang):.2f}" '
                 f'x2="{50 + 43.5 * math.cos(ang):.2f}" y2="{50 + 43.5 * math.sin(ang):.2f}" '
                 f'stroke="{acc if i == 0 else c}" stroke-width="{2.4 if i == 0 else 1.2}"/>')
    g.append(poly(v_poly(28, 32, 44, 40, 11), c))
    return "\n".join(g)


def mark_shield(c=INK, acc=SIGNAL):
    """Shield with the V cut clean through: protection you can see through."""
    shield = ("M50 4 L90 16 V46 C90 72 72 88 50 96 C28 88 10 72 10 46 V16 Z")
    v = v_poly(27, 26, 46, 48, 13)
    vpath = "M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in v) + " Z"
    return (f'<path d="{shield} {vpath}" fill="{c}" fill-rule="evenodd"/>'
            f'<rect x="44" y="80" width="12" height="3.2" fill="{acc}"/>')


def mark_facet(c=INK, acc=SIGNAL):
    """Two facets: one solid (secured), one open (disclosed)."""
    return (poly([(8, 10), (50, 10), (50, 90)], c) +
            f'<polygon points="{pts([(54, 10), (92, 10), (54, 81)])}" fill="none" '
            f'stroke="{acc}" stroke-width="3.6" stroke-linejoin="miter"/>')


def mark_grid(c=INK, acc=SIGNAL):
    """5x5 data field; the points that form the V are resolved."""
    g, on = [], {(0, 0), (4, 0), (1, 1), (3, 1), (1, 2), (3, 2), (2, 3), (2, 4)}
    for r in range(5):
        for k in range(5):
            cx, cy = 14 + k * 18, 14 + r * 18
            if (k, r) in on:
                fill = acc if (k, r) == (2, 4) else c
                g.append(f'<rect x="{cx - 6.5}" y="{cy - 6.5}" width="13" height="13" fill="{fill}"/>')
            else:
                g.append(f'<rect x="{cx - 2}" y="{cy - 2}" width="4" height="4" fill="{c}" fill-opacity="0.28"/>')
    return "\n".join(g)


def mark_keyhole(c=INK, acc=SIGNAL):
    """Rounded-square badge; the keyhole is also a V pointing to the record."""
    badge = "M22 4 H78 A18 18 0 0 1 96 22 V78 A18 18 0 0 1 78 96 H22 A18 18 0 0 1 4 78 V22 A18 18 0 0 1 22 4 Z"
    hole = "M50 20 A15 15 0 1 1 49.99 20 Z"
    v = "M36 48 L64 48 L50 80 Z"
    return (f'<path d="{badge} {hole} {v}" fill="{c}" fill-rule="evenodd"/>'
            f'<circle cx="50" cy="35" r="5" fill="{acc}"/>')


MARKS = {
    "01-aperture": ("Aperture", "Two translucent planes overlap to form the V. "
                    "Literal transparency: you see one layer through the other.", mark_aperture),
    "02-ledger": ("Ledger", "The V is built from rows of a public record. "
                  "Reads as data, audit trail, and structure.", mark_ledger),
    "03-dial": ("Dial Seal", "A combination dial set to zero, framed like a government seal. "
                "Security and institutional weight.", mark_dial),
    "04-shield": ("Open Shield", "A shield with the V cut clean through it. "
                  "Protected, yet nothing hidden.", mark_shield),
    "05-facet": ("Facet", "One facet solid, one open. Secured and disclosed, side by side.",
                 mark_facet),
    "06-grid": ("Signal Grid", "A field of data points; the ones that matter resolve into the V.",
                mark_grid),
    "07-keyhole": ("Keyhole", "Badge with a keyhole that doubles as a V. "
                   "Access, security, and looking through.", mark_keyhole),
}


def svg(w, h, body, bg=None):
    b = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" '
            f'width="{w:.0f}" height="{h:.0f}">{b}{body}</svg>\n')


def recolor(fn, dark):
    return fn(PAPER, SIGNAL) if dark else fn(INK, SIGNAL)


def lockup(key, dark=False):
    fn = MARKS[key][2]
    fg = PAPER if dark else INK
    mark = recolor(fn, dark)
    wm, wmw = wordmark(0, 0, color=fg, accent=None)
    scale = 1.0
    body = (f'<g transform="translate(40 40) scale(1.6)">{mark}</g>'
            f'<g transform="translate(250 70) scale({scale})">{wm}</g>')
    return svg(250 + wmw + 40, 240, body, INK if dark else None)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for key, (name, _, fn) in MARKS.items():
        (OUT / f"{key}-mark.svg").write_text(svg(100, 100, fn(INK, SIGNAL)))
        (OUT / f"{key}-mark-reverse.svg").write_text(svg(100, 100, fn(PAPER, SIGNAL), INK))
        (OUT / f"{key}-lockup.svg").write_text(lockup(key))
        (OUT / f"{key}-lockup-reverse.svg").write_text(lockup(key, dark=True))
    # Wordmark family
    for name, kw in {"wordmark": {}, "wordmark-tt": {"tt_ligature": True},
                     "wordmark-signal": {"accent": SIGNAL, "a_bar": True}}.items():
        body, w = wordmark(20, 20, **kw)
        (OUT / f"08-{name}.svg").write_text(svg(w + 40, H + 40, body))
        body, w = wordmark(20, 20, color=PAPER, **{**kw})
        (OUT / f"08-{name}-reverse.svg").write_text(svg(w + 40, H + 40, body, INK))
    print(OUT)


if __name__ == "__main__":
    main()
