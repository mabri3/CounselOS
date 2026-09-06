import { chromium } from "/Users/bharris/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import fs from "node:fs/promises";

// Read-only capture utility. A capture does not claim a completed user journey.
const out = new URL("./", import.meta.url);
const route = process.argv[2] || "/matters/MAT-20260905-0a2378";
const label = process.argv[3] || "integrated-harbor";
if (!/^[a-z0-9-]+$/.test(label)) throw new Error("Use a plain evidence label.");
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const width of [1440, 1024, 768, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1024 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(String(error)));
    await page.goto(`http://localhost:3117${route}`, { waitUntil: "domcontentloaded" });
    await page.locator(".composer textarea").waitFor({ timeout: 60000 });
    await page.waitForTimeout(5000);
    const dimensions = await page.evaluate(() => ({
      viewport: innerWidth,
      document: document.documentElement.scrollWidth,
      reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    }));
    await page.screenshot({ path: new URL(`${label}-${width}.png`, out).pathname, fullPage: true });
    results.push({ width, url: page.url(), dimensions, errors, text: await page.locator("body").innerText() });
    await context.close();
  }
} finally {
  await browser.close();
  await fs.writeFile(new URL(`${label}-captures.json`, out), JSON.stringify(results, null, 2));
}
