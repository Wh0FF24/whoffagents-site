import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
const output = process.argv[2];
if (!output) throw new Error("Pass an output directory.");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  for (const [route, selector, name] of [
    ["/", "#services", "home-services"],
    ["/web", "#work", "web-work"],
    ["/web", "#pricing", "web-pricing"],
    ["/agents", "#lead-form", "contact"],
    ["/about", "#studio-story", "studio-story"],
    ["/blog", ".dp-support-page", "blog"],
  ]) {
    await page.goto(`http://127.0.0.1:4173${route}`);
    await page.evaluate(() => document.fonts.ready);
    await page
      .locator(selector)
      .evaluate((e) =>
        window.scrollTo({
          top: scrollY + e.getBoundingClientRect().top - 110,
          behavior: "instant",
        }),
      );
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(output, `${name}.png`) });
  }
} finally {
  await browser.close();
}
