import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
const browser = await chromium.launch({ channel: "chrome", headless: true });
for (const [name, url] of [
  ["forge", "https://utahforgegym-preview.netlify.app"],
  ["circles", "https://breakincircles-preview.netlify.app"],
]) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: "../reel-capture", size: { width: 1440, height: 900 } },
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: `public/work/${name}-poster.jpg`,
    type: "jpeg",
    quality: 90,
  });
  await page.waitForTimeout(4500);
  await page.evaluate(() => window.scrollTo({ top: 1050, behavior: "smooth" }));
  await page.waitForTimeout(3500);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await page.waitForTimeout(1500);
  const video = page.video();
  await ctx.close();
  const raw = `../reel-capture/${name}-raw.webm`;
  await video.saveAs(raw);
  execFileSync("ffmpeg", [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-ss",
    "2.4",
    "-i",
    raw,
    "-t",
    "11",
    "-c:v",
    "libvpx-vp9",
    "-crf",
    "36",
    "-b:v",
    "0",
    "-an",
    `public/work/${name}-motion.webm`,
  ]);
  console.log(name, (await fs.stat(`public/work/${name}-motion.webm`)).size);
}
await browser.close();
