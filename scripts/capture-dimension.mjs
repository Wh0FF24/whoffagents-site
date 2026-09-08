import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
const output = process.argv[2];
if (!output)
  throw new Error(
    "Pass an output directory: node scripts/capture-dimension.mjs <directory>",
  );
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
async function ready() {
  await page.goto("http://127.0.0.1:4173/");
  await page.locator('.dx-experience[data-scene="ready"]').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
}
await ready();
await page.screenshot({ path: path.join(output, "dimension-desktop.png") });
await page.getByRole("button", { name: "Next dimension", exact: true }).click();
await page.waitForTimeout(1300);
await page.screenshot({ path: path.join(output, "dimension-island.png") });
await page
  .getByRole("button", { name: "Agents with purpose", exact: true })
  .click();
await page.waitForTimeout(1300);
await page.screenshot({ path: path.join(output, "dimension-agents.png") });
await page.setViewportSize({ width: 390, height: 1100 });
await ready();
await page.screenshot({ path: path.join(output, "dimension-mobile.png") });
await page.setViewportSize({ width: 1280, height: 720 });
await ready();
await page.screenshot({
  path: path.join(output, "dimension-short-desktop.png"),
});
console.log(
  JSON.stringify({
    errors,
    scene: await page.locator(".dx-experience").getAttribute("data-scene"),
    renderer: await page
      .locator(".dx-object")
      .evaluate((e) => ({ ...e.dataset })),
  }),
);
await browser.close();
