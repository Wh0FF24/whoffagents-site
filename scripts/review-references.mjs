import { chromium } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
for (const [name, url] of [
  ["forge", "https://utahforgegym-preview.netlify.app"],
  ["circles", "https://breakincircles-preview.netlify.app"],
]) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `../${name}-reference-hero.png` });
  console.log(
    JSON.stringify({
      name,
      url,
      headings: await page.locator("h1,h2").allTextContents(),
      videos: await page
        .locator("video")
        .evaluateAll((vs) =>
          vs.map((v) => ({
            src: v.currentSrc,
            playing: !v.paused,
            muted: v.muted,
            controls: v.controls,
          })),
        ),
      buttons: await page.locator("button").allTextContents(),
    }),
  );
  await page.evaluate(() => window.scrollTo(0, 1100));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `../${name}-reference-middle.png` });
  await page.evaluate(() => window.scrollTo(0, 2500));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `../${name}-reference-lower.png` });
}
await browser.close();
