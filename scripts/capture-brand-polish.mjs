import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome'});const page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.goto('http://127.0.0.1:4173/');await page.waitForTimeout(700);await page.keyboard.press('Shift');await page.locator('.py-hero[data-scene="ready"]').waitFor();await page.screenshot({path:'C:/Users/WillW/Documents/Codex/2026-09-06/go-x20/outputs/brand-home-desktop.png'});
await page.getByRole('button',{name:'Open the pyramid'}).click();await page.screenshot({path:'C:/Users/WillW/Documents/Codex/2026-09-06/go-x20/outputs/brand-home-open.png'});
await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:4173/');await page.waitForTimeout(700);await page.keyboard.press('Shift');await page.locator('.py-hero[data-scene="ready"]').waitFor();await page.screenshot({path:'C:/Users/WillW/Documents/Codex/2026-09-06/go-x20/outputs/brand-home-mobile.png',fullPage:false});await browser.close();
