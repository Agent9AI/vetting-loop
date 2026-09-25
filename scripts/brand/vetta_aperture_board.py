#!/usr/bin/env python3
"""Compose the Aperture colorway and Mzalendo boards (HTML) for PNG export."""
from vetta_aperture import COLORWAYS, MZ, OUT, contrast

INK, STEEL, RULE = "#0B1220", "#64748B", "#DADDD6"

CSS = f"""
*{{box-sizing:border-box;margin:0;padding:0}}
body{{background:#E9EBE7;font-family:'Liberation Sans',Arial,sans-serif;color:{INK};padding:56px;width:1600px;min-height:0}}
header{{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:30px;
  border-bottom:2px solid {INK};padding-bottom:18px}}
h1{{font-size:15px;letter-spacing:.32em;font-weight:700}}
header p,h2 small{{font-size:12px;letter-spacing:.18em;color:{STEEL};text-transform:uppercase}}
h2{{font-size:13px;letter-spacing:.24em;font-weight:700;margin:34px 0 16px;display:flex;
  justify-content:space-between;align-items:baseline}}
h2 small{{font-weight:400;letter-spacing:.1em;text-transform:none;font-size:12px}}
.grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}}
.grid.two{{grid-template-columns:repeat(2,1fr)}} .wide{{grid-column:span 2}}
.card{{background:#fff;display:flex;flex-direction:column}}
.hero{{height:190px;display:flex;align-items:center;justify-content:center;padding:24px 34px}}
.hero img{{max-height:92px;max-width:100%}}
.two .hero{{height:220px}} .two .hero img{{max-height:104px}}
.dark{{height:96px;display:flex;align-items:center;justify-content:space-between;padding:0 28px}}
.dark .lk{{height:50px;max-width:62%}} .sizes{{display:flex;gap:14px;align-items:flex-end}}
.two .dark{{height:110px}} .two .dark .lk{{height:60px;max-width:80%}}
.meta{{padding:14px 22px 18px;border-top:1px solid {RULE};flex:1}}
.top{{display:flex;gap:12px;align-items:baseline;margin-bottom:6px}}
.num{{font-size:11px;letter-spacing:.2em;color:#BE3144;font-weight:700}}
.name{{font-size:15px;font-weight:700;letter-spacing:.04em}}
.src{{margin-left:auto;font-size:10.5px;color:{STEEL};letter-spacing:.04em}}
.why{{font-size:12.5px;color:#334155;line-height:1.45;min-height:36px}}
.sw{{display:flex;gap:10px;margin-top:10px;flex-wrap:wrap;align-items:center;font-size:10px;
  color:{STEEL};letter-spacing:.06em}}
.sw i{{width:14px;height:14px;display:inline-block;border:1px solid #cfd3cc;vertical-align:-3px;margin-right:4px}}
.cr{{margin-left:auto}}
"""


def page(title, sub, body):
    return (f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head>'
            f'<body><header><h1>{title}</h1><p>{sub}</p></header>{body}</body></html>')


def card(num, name, src, why, light, dark, mark_rev, dark_bg, swatches, cr=""):
    sizes = "".join(f'<img src="{mark_rev}" width="{s}" height="{s}">' for s in (48, 32, 16))
    sw = "".join(f'<span><i style="background:{c}"></i>{c}</span>' for c in swatches)
    return (f'<div class="card"><div class="hero" style="background:{light[0]}">'
            f'<img src="{light[1]}"></div>'
            f'<div class="dark" style="background:{dark_bg}"><img class="lk" src="{dark}">'
            f'<div class="sizes">{sizes if mark_rev else ""}</div></div>'
            f'<div class="meta"><div class="top"><span class="num">{num}</span>'
            f'<span class="name">{name}</span><span class="src">{src}</span></div>'
            f'<div class="why">{why}</div><div class="sw">{sw}<span class="cr">{cr}</span>'
            f'</div></div></div>')


def colorway_cards(group):
    out = []
    for key, name, grp, src, why, light, dark in COLORWAYS:
        if grp != group:
            continue
        slug = f"{key}-{name.lower().replace(' & ', '-').replace(' ', '-')}"
        swatches = list(dict.fromkeys(light[:4] + dark[:4]))
        cr = (f"Wordmark contrast {contrast(light[4], light[0]):.1f}:1 / "
              f"{contrast(dark[4], dark[0]):.1f}:1")
        out.append(card(key.upper(), name, src, why,
                        (light[0], f"{slug}-lockup.svg"), f"{slug}-lockup-reverse.svg",
                        f"{slug}-mark-reverse.svg", dark[0], swatches, cr))
    return "".join(out)


def main():
    body = (f'<h2>RED &amp; BLACK <small>Requested by Caroline · six directions, '
            f'light and dark, favicon check at 48 / 32 / 16 px</small></h2>'
            f'<div class="grid">{colorway_cards("red")}</div>'
            f'<h2>DESIGNER PICKS <small>Top-ranked Color Hunt palettes, filtered for a '
            f'non-partisan civic brand</small></h2>'
            f'<div class="grid">{colorway_cards("picks")}</div>')
    (OUT / "board-colorways.html").write_text(
        page("VETTA &nbsp;/&nbsp; APERTURE COLORWAYS", "Round 2 &middot; 12 colorways &middot; Agent9", body))

    files = {"m1": ("m1-mzalendo-flag-lockup.svg", "m1-mzalendo-flag-lockup-reverse.svg",
                    "m1-mzalendo-flag-mark-reverse.svg"),
             "m2": ("m2-mzalendo-badge.svg", "m2-mzalendo-badge-reverse.svg", ""),
             "m3": ("m3-mzalendo-cobrand.svg", "m3-mzalendo-cobrand-reverse.svg", "")}
    cards = []
    for key, name, why in MZ:
        light, dark, mark = files[key]
        c = card(key.upper(), name, "Mzalendo brand colours", why, ("#FFFFFF", light),
                 dark, mark, "#111111", ["#BD141A", "#0D8140", "#111111", "#FFFFFF"])
        cards.append(c.replace('class="card"', 'class="card wide"') if key == "m3" else c)
    (OUT / "board-mzalendo.html").write_text(page(
        "VETTA &nbsp;/&nbsp; MZALENDO BONUS", "Future integration &middot; 3 versions &middot; Agent9",
        f'<div class="grid two">{"".join(cards)}</div>'))
    print(OUT)


if __name__ == "__main__":
    main()
