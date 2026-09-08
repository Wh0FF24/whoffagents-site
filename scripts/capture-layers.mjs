import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
const output = process.argv[2];
if (!output) throw new Error("Pass an output directory.");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.goto("http://127.0.0.1:4173/web?concept=layers");
  await page.locator(".lp-experience[data-scene=ready]").waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(output, "layers-intro.png") });
  for (const [name, label, step] of [
    ["spindle", "Spindle Creek", 1],
    ["island", "Island Airporter", 2],
  ]) {
    await page
      .getByRole("group", { name: "Choose a portfolio layer" })
      .getByRole("button", { name: label, exact: true })
      .click();
    await expect
      .poll(async () =>
        Number(await page.locator(".lp-canvas").getAttribute("data-progress")),
      )
      .toBeGreaterThan(step - 0.005);
    await page.screenshot({ path: path.join(output, `layers-${name}.png`) });
  }
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto("http://127.0.0.1:4173/web?concept=layers");
  await page.locator(".lp-experience[data-scene=ready]").waitFor();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(output, "layers-mobile.png") });
} finally {
  await browser.close();
}
