import { chromium } from "@playwright/test";
import path from "node:path";
const out = path.resolve("../../outputs");
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
await page.goto("http://127.0.0.1:4173/");
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1200);
await page.screenshot({ path: path.join(out, "redesign-desktop.png") });
const hideHeader = await page.addStyleTag({
  content: ".st-header{visibility:hidden!important}",
});
await page.locator("#work").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page
  .locator("#work")
  .screenshot({ path: path.join(out, "redesign-work.png") });
await page
  .locator("#agent-demo")
  .screenshot({ path: path.join(out, "redesign-agent-demo.png") });
await page
  .locator("#pricing")
  .screenshot({ path: path.join(out, "redesign-pricing.png") });
await hideHeader.evaluate((el) => el.remove());
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.screenshot({
  path: path.join(out, "redesign-desktop-full.png"),
  fullPage: true,
});
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(out, "redesign-mobile.png") });
await page.screenshot({
  path: path.join(out, "redesign-mobile-full.png"),
  fullPage: true,
});
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto("http://127.0.0.1:4173/products");
await page.screenshot({ path: path.join(out, "redesign-products.png") });
await browser.close();
