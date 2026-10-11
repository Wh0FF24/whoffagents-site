import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => route.request().method() === 'POST' ? route.abort() : route.continue());
});

test('exact vector assembly plays once, holds, and preserves the header across navigation', async ({ page }, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/capabilities');
  const logo = page.locator('.wf-header .hl-logo');
  const header = page.locator('.wf-header');
  await expect(logo).toHaveAttribute('data-playing', 'true');
  const initial = await logo.boundingBox();
  const headerBox = await header.boundingBox();
  const exact = await page.evaluate(async () => {
    const original = new DOMParser().parseFromString(await (await fetch('/brand/whoff-logo.svg')).text(), 'image/svg+xml');
    const paths = node => [...node.querySelectorAll('path')].map(p => [p.getAttribute('d'), p.getAttribute('fill')]);
    return JSON.stringify(paths(original)) === JSON.stringify(paths(document.querySelector('.hl-vectors')));
  });
  expect(exact).toBe(true);
  await page.screenshot({ path: info.outputPath('desktop-assembly.png') });
  await expect(page.locator('.hl-wordmark')).toHaveCSS('opacity', '1');
  await page.waitForTimeout(1800);
  await page.screenshot({ path: info.outputPath('desktop-hold.png') });
  await expect(logo).toHaveAttribute('data-playing', 'false', { timeout: 8000 });
  expect(await logo.boundingBox()).toEqual(initial);
  expect(await header.boundingBox()).toEqual(headerBox);
  await expect(logo.locator('img')).toHaveCSS('visibility', 'visible');
  await expect(logo.locator('svg')).toHaveCount(0);
  await expect(page.locator('.wf-footer .hl-logo')).toHaveCount(0);
  await page.screenshot({ path: info.outputPath('desktop-settled.png') });
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Research', exact: true }).click();
  await expect(logo).toHaveAttribute('data-playing', 'false');
  await expect(page.getByRole('link', { name: 'Whoff Agents home' }).first()).toHaveAccessibleName('Whoff Agents home');
  await page.reload();
  await expect(logo).toHaveAttribute('data-playing', 'true');
});

test('homepage waits for its header entrance and finishes once', async ({ page }, info) => {
  await page.goto('/');
  const logo = page.locator('.wf-header .hl-logo');
  await expect(logo).toHaveAttribute('data-playing', 'true', { timeout: 15000 });
  await expect(page.locator('.wf-header')).toHaveCSS('opacity', '1');
  await expect(logo).toHaveAttribute('data-playing', 'false', { timeout: 8000 });
  await page.screenshot({ path: info.outputPath('homepage-settled.png') });
});

test('reduced motion stays static and changing the preference stops motion without replay', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/capabilities');
  const logo = page.locator('.wf-header .hl-logo');
  await expect(logo).toHaveAttribute('data-playing', 'false');
  await expect(logo.locator('.hl-assembly')).toHaveCount(0);
  await expect(logo.locator('img')).toHaveCSS('visibility', 'visible');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(logo).toHaveAttribute('data-playing', 'false');
  await page.reload();
  await expect(logo).toHaveAttribute('data-playing', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(logo).toHaveAttribute('data-playing', 'false');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(logo).toHaveAttribute('data-playing', 'false');
});

test('static logo works without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/capabilities`);
    const img = page.locator('.wf-header .hl-logo img');
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('src', '/brand/whoff-logo.svg');
    expect(await img.evaluate(node => node.complete && node.naturalWidth > 0)).toBe(true);
    await expect(page.locator('.hl-assembly')).toHaveCount(0);
  } finally { await context.close(); }
});

for (const width of [320, 390, 768]) {
  test(`mobile header stays the same size and navigation remains accessible at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/capabilities');
    const logo = page.locator('.wf-header .hl-logo');
    await expect(logo).toHaveAttribute('data-playing', 'true');
    const initial = await logo.boundingBox();
    expect(initial.width).toBe(143);
    const menu = page.getByRole('button', { name: 'Open menu' });
    await menu.click();
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    await expect(logo).toHaveAttribute('data-playing', 'false', { timeout: 8000 });
    expect(await logo.boundingBox()).toEqual(initial);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const result = await new AxeBuilder({ page }).include('.wf-header').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`mobile-${width}-settled.png`) });
  });
}
