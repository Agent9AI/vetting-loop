#!/usr/bin/env python3
"""Compose the VETTA concept boards (HTML) for PNG export with headless Chromium."""
from pathlib import Path

from vetta_logos import MARKS, OUT, INK, PAPER, SIGNAL, STEEL

CSS = f"""
*{{box-sizing:border-box;margin:0;padding:0}}
body{{background:#E9EBE7;font-family:'Liberation Sans',Arial,sans-serif;color:{INK};padding:56px}}
header{{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:36px;
  border-bottom:2px solid {INK};padding-bottom:18px}}
h1{{font-size:15px;letter-spacing:.32em;font-weight:700}}
header p{{font-size:12px;letter-spacing:.18em;color:{STEEL};text-transform:uppercase}}
.grid{{display:grid;grid-template-columns:repeat(2,1fr);gap:28px}}
.card{{background:{PAPER};display:grid;grid-template-rows:auto auto auto}}
.hero{{height:250px;display:flex;align-items:center;justify-content:center;padding:28px 40px}}
.hero img{{max-height:120px;max-width:100%}}
.dark{{background:{INK};height:120px;display:flex;align-items:center;justify-content:space-between;padding:0 40px}}
.dark .lk{{height:62px}} .sizes{{display:flex;gap:18px;align-items:flex-end}}
.sizes img{{display:block}}
.meta{{padding:18px 40px 22px;display:flex;gap:18px;align-items:baseline;border-top:1px solid #DADDD6}}
.num{{font-size:12px;letter-spacing:.2em;color:{SIGNAL};font-weight:700}}
.name{{font-size:15px;font-weight:700;letter-spacing:.06em;min-width:120px}}
.why{{font-size:13px;color:#334155;line-height:1.45}}
footer{{margin-top:32px;display:flex;gap:10px;align-items:center;font-size:11px;letter-spacing:.14em;color:{STEEL}}}
.sw{{width:22px;height:22px;display:inline-block;margin-left:14px}}
"""


def card(num, name, why, light, dark, mark_rev):
    sizes = "".join(f'<img src="{mark_rev}" width="{s}" height="{s}">' for s in (48, 32, 16))
    return f"""<div class="card"><div class="hero"><img src="{light}"></div>
<div class="dark"><img class="lk" src="{dark}"><div class="sizes">{sizes}</div></div>
<div class="meta"><span class="num">{num}</span><span class="name">{name}</span>
<span class="why">{why}</span></div></div>"""


def main():
    cards = []
    for key, (name, why, _) in MARKS.items():
        cards.append(card(key[:2], name, why, f"{key}-lockup.svg",
                          f"{key}-lockup-reverse.svg", f"{key}-mark-reverse.svg"))
    cards.append(card("08", "Wordmark", "Custom-drawn letterforms, no stock font. Variant with a "
                      "shared TT bar; variant with a teal signal bar in the A.",
                      "08-wordmark-tt.svg", "08-wordmark-signal-reverse.svg",
                      "07-keyhole-mark-reverse.svg").replace(
                          '<div class="sizes">', '<div class="sizes" style="display:none">'))
    swatches = "".join(f'<span class="sw" style="background:{c};border:1px solid #cfd3cc"></span>{n} {c}'
                       for n, c in (("INK", INK), ("PAPER", PAPER), ("SIGNAL", SIGNAL), ("STEEL", STEEL)))
    html = f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<header><h1>VETTA &nbsp;/&nbsp; IDENTITY CONCEPTS</h1><p>Round 1 &middot; 8 directions &middot; Agent9</p></header>
<div class="grid">{''.join(cards)}</div>
<footer>PALETTE {swatches}</footer></body></html>"""
    (OUT / "board.html").write_text(html)
    print(OUT / "board.html")


if __name__ == "__main__":
    main()
