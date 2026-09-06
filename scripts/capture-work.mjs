import { chromium } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1100 },
  deviceScaleFactor: 1,
});
for (const [name, url] of [
  ["spindle", "https://spindlecreek.com"],
  ["island", "https://main.d1v4o3c4563ysj.amplifyapp.com"],
]) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(7000);
  await page.screenshot({ path: `../${name}-desktop.png` });
}
await browser.close();
