// Render vetta-deck.html to PDF and one PNG per slide. Contact sheet: tools/contact-sheet.py
// Usage: node render.mjs <docs/deck dir>   (needs the playwright package resolvable)
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const deck = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const url = pathToFileURL(path.join(deck, "vetta-deck.html")).href;
const out = path.join(deck, "slides");
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: path.join(deck, "vetta-deck.pdf"), width: "1920px", height: "1080px", printBackground: true, preferCSSPageSize: true });

const slides = await page.$$("section.slide");
for (const [i, s] of slides.entries()) {
  await s.screenshot({ path: path.join(out, `slide-${String(i + 1).padStart(2, "0")}.png`) });
}

await browser.close();
console.log(`rendered ${slides.length} slides`);
