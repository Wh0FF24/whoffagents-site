import { chromium } from "@playwright/test";
import path from "node:path";
import fs from "node:fs/promises";

const output = process.argv[2];
if (!output) throw new Error("Pass an output directory.");
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: width === 390 ? 1100 : 1000 },
      reducedMotion: "reduce",
    });
    for (const [route, name] of [
      ["agents", "agents"],
      ["products", "tools"],
      ["about", "studio"],
    ]) {
      await page.goto(`http://127.0.0.1:4173/${route}`);
      await page.locator('.dp-hero[data-scene="ready"]').waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(
          output,
          `${name}-page-${width === 390 ? "mobile" : "desktop"}.png`,
        ),
      });
      if (width === 1440) {
        await page
          .locator(
            route === "agents"
              ? "#agent-demo"
              : route === "products"
                ? "#catalog"
                : "#studio-story",
          )
          .scrollIntoViewIfNeeded();
        await page.screenshot({
          path: path.join(output, `${name}-page-detail.png`),
        });
      }
    }
    await page.close();
  }
} finally {
  await browser.close();
}
