import { test, expect } from '@playwright/test';
import process from 'node:process';
import AxeBuilder from '@axe-core/playwright';
import { routeMeta } from '../src/data/routeMeta.js';

const engineeringRoutes = ['/', '/capabilities', '/research', '/research/persona-fleet', '/about', '/contact'];

test.beforeEach(async ({ page }) => {
  // Fail any external write closed, even if a preview guard regresses.
  await page.route('**/*', route => route.request().method() === 'POST' ? route.abort() : route.continue());
});

for (const width of [320, 390, 768, 1440]) {
  test(`engineering pages fit ${width}px and meet WCAG A/AA checks`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const route of engineeringRoutes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page).toHaveTitle(routeMeta[route].title);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
      const clippedHeadings = await page.locator('h1, h2, h3').evaluateAll(headings => headings.filter(heading => {
        const range = document.createRange();
        range.selectNodeContents(heading);
        return [...range.getClientRects()].some(rect => rect.right > innerWidth + 1 || rect.left < -1);
      }).map(heading => heading.textContent));
      expect(clippedHeadings, `Clipped heading text on ${route}`).toEqual([]);
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), route).toEqual([]);
    }
  });
}

test('new and relocated pages render useful HTML without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const route of [...engineeringRoutes, '/studio', '/studio/about']) {
    await page.goto(`http://127.0.0.1:${process.env.PLAYWRIGHT_PORT || '4174'}${route}`);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', routeMeta[route].title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', routeMeta[route].description);
    if (route === '/') await expect(page.locator('.ch-motion')).toHaveCount(0);
  }
  await context.close();
});

test('mobile menu reveals retained services and returns focus on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open menu' });
  await toggle.click();
  const menu = page.getByRole('navigation', { name: 'Mobile navigation' });
  await expect(menu.getByRole('link', { name: 'AI receptionist' })).toBeVisible();
  await menu.getByRole('link', { name: 'Research', exact: true }).press('Escape');
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await menu.getByRole('link', { name: 'The studio', exact: true }).click();
  await expect(page).toHaveURL(/\/studio$/);
  await expect(menu).toBeHidden();
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', routeMeta['/studio'].title);
});

const CORE_CHAPTERS = [
  ['The core 00', 'core'],
  ['Capabilities 01', 'capabilities'],
  ['How we work 02', 'method'],
  ['Research 03', 'research'],
  ['Company 04', 'company'],
  ['Contact 05', 'contact'],
];

test('the core stays one persistent scene while the chapters move it', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const layer = page.locator('.ch-layer');
  await expect(layer).toHaveAttribute('data-scene', /ready|fallback/, { timeout: 20000 });
  const rendered = (await layer.getAttribute('data-scene')) === 'ready';
  const canvas = rendered ? await page.locator('.ch-canvas canvas').elementHandle() : null;
  const rail = page.getByRole('navigation', { name: 'Homepage chapters' });
  // After the boot sequence the chapter rail and the motion control are shown.
  await expect(page.locator('.ch-rail')).toHaveCSS('opacity', '1', { timeout: 8000 });
  await expect(page.locator('.ch-motion')).toHaveCSS('opacity', '1', { timeout: 8000 });
  for (const [name, chapter] of [...CORE_CHAPTERS.slice(1), CORE_CHAPTERS[0]]) {
    await rail.getByRole('link', { name, exact: true }).click();
    await expect(layer).toHaveAttribute('data-chapter', chapter, { timeout: 8000 });
    await expect(rail.getByRole('link', { name, exact: true })).toHaveAttribute('aria-current', 'true');
    if (canvas) expect(await canvas.evaluate((element) => element.isConnected)).toBe(true);
  }
  await expect(page.locator('#capabilities [data-core-anchor]')).toHaveCount(4);
  await expect(page.locator('#company [data-core-anchor]')).toHaveCount(2);
  // Each company filament ends beside its own card, never inside another one.
  await rail.getByRole('link', { name: 'Company 04', exact: true }).click();
  await expect(layer).toHaveAttribute('data-chapter', 'company', { timeout: 8000 });
  const crossings = await page.locator('#company .ch-person').evaluateAll((cards) => {
    const rects = cards.map((card) => card.getBoundingClientRect());
    return rects.flatMap((rect, index) => {
      const point = { x: rect.right + 18, y: rect.top + rect.height / 2 };
      return rects.filter((other, j) => j !== index && point.x >= other.left && point.x <= other.right && point.y >= other.top && point.y <= other.bottom);
    }).length;
  });
  expect(crossings).toBe(0);
  const pause = page.getByRole('button', { name: 'Pause motion', exact: true });
  await pause.click();
  await expect(page.getByRole('button', { name: 'Resume motion', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(layer).toHaveClass(/is-paused/);
  await page.getByRole('button', { name: 'Resume motion', exact: true }).click();
  await expect(layer).not.toHaveClass(/is-paused/);
  // With motion on, the split headings must keep valid accessible names.
  // Let reversing reveals settle first; partial opacity is a transient state.
  await page.waitForTimeout(2200);
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(/Human intent\.\s*Intelligent action\./);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual([]);
});

test('every chapter is readable at each size and the core never pushes the page sideways', async ({ page }) => {
  for (const [width, height] of [[1440, 900], [1280, 720], [1024, 768], [1024, 1366], [768, 900], [390, 844], [320, 667]]) {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    for (const [, chapter] of CORE_CHAPTERS) {
      const section = page.locator(`#${chapter}`);
      await section.evaluate((element) => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY, behavior: 'instant' }));
      await expect(page.locator('.ch-layer')).toHaveAttribute('data-chapter', chapter);
      const heading = section.locator('h1, h2').first();
      await expect(heading).toBeVisible();
      const box = await heading.boundingBox();
      expect(box.x, `${chapter} at ${width}`).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, `${chapter} at ${width}`).toBeLessThanOrEqual(width + 1);
      expect(box.y, `${chapter} top at ${width}x${height}`).toBeGreaterThanOrEqual(0);
      expect(box.y + box.height, `${chapter} bottom at ${width}x${height}`).toBeLessThanOrEqual(height + 1);
      const hidden = await section.locator('.ch-reveal').evaluateAll((items) => items.filter((item) => Number(getComputedStyle(item).opacity) < 1).length);
      expect(hidden, `${chapter} at ${width}`).toBe(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}x${height}`).toBe(true);
    if ([1440, 390].includes(width)) await page.screenshot({ path: `test-results/core-home-${width}.png` });
  }
});

test('the core leaves with the last chapter instead of sitting behind its copy', async ({ page }) => {
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    for (const extra of [160, 420, 10000]) {
      await page.locator('#contact').evaluate((element, offset) => window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY + Math.max(0, element.offsetHeight - window.innerHeight) + offset,
        behavior: 'instant',
      }), extra);
      await expect.poll(() => page.evaluate(() => {
        const layer = getComputedStyle(document.querySelector('.ch-layer'));
        const links = document.querySelector('.ch-contact-links').getBoundingClientRect();
        const coreBottom = parseFloat(layer.getPropertyValue('--cy')) + parseFloat(layer.getPropertyValue('--cr'));
        return coreBottom < links.top || links.bottom < 0;
      }), `${width}px, ${extra}px past the contact chapter`).toBe(true);
    }
    // At the very end the core is gone: drawing stops.
    await expect(page.locator('.ch-layer')).toHaveAttribute('data-offstage', 'true');
  }
  // The contact copy starts below the core's instrument ring.
  for (const [width, height] of [[1440, 900], [1280, 720], [1024, 768]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.locator('#contact').evaluate((element) => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY, behavior: 'instant' }));
    await expect(page.locator('.ch-layer')).toHaveAttribute('data-chapter', 'contact');
    const gap = await page.evaluate(() => {
      const layer = getComputedStyle(document.querySelector('.ch-layer'));
      const ringBottom = parseFloat(layer.getPropertyValue('--cy')) + parseFloat(layer.getPropertyValue('--cr')) * 1.6;
      return document.querySelector('#contact .ch-kicker').getBoundingClientRect().top - ringBottom;
    });
    expect(gap, `${width}x${height}`).toBeGreaterThanOrEqual(10);
  }
  // No filament targets the contact copy (its path would cross the heading).
  await expect(page.locator('#contact [data-core-anchor]')).toHaveCount(0);
});

test('with motion on, the rail steps aside for the footer and returns at the top', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const rail = page.locator('.ch-rail');
  await expect(rail).toHaveCSS('opacity', '1', { timeout: 8000 });
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await expect(page.locator('.ch-layer')).toHaveAttribute('data-offstage', 'true', { timeout: 8000 });
  await expect(rail).toHaveCSS('visibility', 'hidden');
  await expect(page.locator('.ch-motion')).toHaveCSS('visibility', 'hidden');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(rail).toHaveCSS('visibility', 'visible', { timeout: 8000 });
  await expect(rail).toHaveCSS('opacity', '1');
});

test('a fast flick through the contact chapter never pulls the core ring over its copy', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.ch-rail')).toHaveCSS('opacity', '1', { timeout: 8000 });
  await page.locator('#company').evaluate((element) => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY, behavior: 'instant' }));
  await page.waitForTimeout(1500);
  // Sample every frame while flicking the wheel hard into the footer.
  const overlaps = page.evaluate(async () => {
    let bad = 0;
    const end = performance.now() + 3500;
    while (performance.now() < end) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const layer = getComputedStyle(document.querySelector('.ch-layer'));
      if (document.querySelector('.ch-layer').dataset.offstage === 'true') continue;
      const ring = parseFloat(layer.getPropertyValue('--cy')) + parseFloat(layer.getPropertyValue('--cr')) * 1.53;
      const kicker = document.querySelector('#contact .ch-kicker').getBoundingClientRect();
      if (kicker.bottom > 0 && kicker.top < innerHeight && ring > kicker.top) bad += 1;
    }
    return bad;
  });
  await page.mouse.move(720, 450);
  for (let step = 0; step < 18; step += 1) await page.mouse.wheel(0, 240);
  expect(await overlaps).toBe(0);
});

test('on tall screens the core leaves or stays whole, and the motion control is never under the footer', async ({ page }) => {
  // 1080 x 1920: the page ends before the contact chapter can come to rest.
  for (const [width, height, ending] of [[1920, 1080, 'leaves'], [1920, 1200, 'leaves'], [2560, 1440, 'leaves'], [1024, 1366, 'leaves'], [834, 1194, 'leaves'], [1080, 1920, 'stays']]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    const control = page.locator('.ch-motion');
    await expect(control).toHaveCSS('opacity', '1', { timeout: 8000 });
    // Part-way into the footer the control rides above it.
    await page.locator('#contact').evaluate((element) => {
      const rect = element.getBoundingClientRect();
      window.scrollTo({ top: rect.top + window.scrollY + rect.height - window.innerHeight * 0.65, behavior: 'instant' });
    });
    await expect.poll(() => page.evaluate(() => {
      const footer = document.querySelector('.wf-footer').getBoundingClientRect();
      const button = document.querySelector('.ch-motion');
      return getComputedStyle(button).visibility === 'hidden' || button.getBoundingClientRect().bottom <= footer.top;
    }), `${width}x${height}`).toBe(true);
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    if (ending === 'leaves') {
      // At the very end the core has gone and the controls with it.
      await expect(page.locator('.ch-layer')).toHaveAttribute('data-offstage', 'true', { timeout: 8000 });
      await expect(page.locator('.ch-rail')).toHaveCSS('visibility', 'hidden');
      await expect(control).toHaveCSS('visibility', 'hidden');
    } else {
      // The core stays at full strength in its band, clear of the contact copy
      // and the footer, and keeps its motion control.
      await page.waitForTimeout(1500);
      const end = await page.evaluate(() => {
        const layer = document.querySelector('.ch-layer');
        const style = getComputedStyle(layer);
        const band = parseFloat(style.getPropertyValue('--cy')) + parseFloat(style.getPropertyValue('--cr')) * 2;
        return {
          opacity: style.opacity,
          offstage: layer.dataset.offstage,
          clearance: document.querySelector('#contact .ch-kicker').getBoundingClientRect().top - band,
          control: document.querySelector('.wf-footer').getBoundingClientRect().top - document.querySelector('.ch-motion').getBoundingClientRect().bottom,
        };
      });
      expect(end.opacity, `${width}x${height}`).toBe('1');
      expect(end.offstage, `${width}x${height}`).toBe('false');
      expect(end.clearance, `${width}x${height}`).toBeGreaterThanOrEqual(0);
      expect(end.control, `${width}x${height}`).toBeGreaterThanOrEqual(0);
      await expect(control).toHaveCSS('visibility', 'visible');
    }
  }
});

test('the core is at full strength whenever the contact chapter comes to rest', async ({ page }) => {
  for (const [width, height] of [[1440, 900], [2560, 1440], [390, 844], [768, 1024], [834, 1194], [912, 1368], [1000, 1300], [1024, 1366]]) {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.locator('#contact').evaluate((element) => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY, behavior: 'instant' }));
    await expect(page.locator('.ch-layer')).toHaveAttribute('data-chapter', 'contact');
    expect(await page.evaluate(() => Math.abs(document.getElementById('contact').getBoundingClientRect().top)), `${width}x${height} reaches rest`).toBeLessThan(2);
    await expect.poll(() => page.evaluate(() => getComputedStyle(document.querySelector('.ch-layer')).opacity), `${width}x${height}`).toBe('1');
  }
});

test('stacked layouts keep every block in one centered column', async ({ page }) => {
  for (const [width, height] of [[1024, 1366], [768, 1024]]) {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const edges = await page.evaluate(() => [...document.querySelectorAll('.ch-chapter:not(.ch-intro) .ch-panel, .ch-loop-list, .ch-figure-note')].map((element) => {
      const rect = element.getBoundingClientRect();
      return { name: element.className, left: rect.left, right: document.documentElement.clientWidth - rect.right };
    }));
    expect(edges.length).toBeGreaterThanOrEqual(8);
    for (const edge of edges) {
      expect(Math.abs(edge.left - edge.right), `${edge.name} at ${width}x${height}`).toBeLessThan(2);
      expect(Math.abs(edge.left - edges[0].left), `${edge.name} at ${width}x${height}`).toBeLessThan(2);
    }
  }
});

test('the chapter rail and the intro link land exactly on each chapter', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.ch-rail')).toHaveCSS('opacity', '1', { timeout: 8000 });
  // The studio's 95px scroll padding must not apply to the homepage.
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop)).toBe('0px');
  for (const [number, id] of [['02', 'method'], ['04', 'company'], ['01', 'capabilities']]) {
    await page.locator('.ch-rail a', { hasText: number }).click();
    await expect.poll(() => page.locator(`#${id}`).evaluate((element) => Math.round(element.getBoundingClientRect().top)), { timeout: 5000 }).toBe(0);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(800);
  await page.locator('.ch-intro a[href="#capabilities"]').click();
  await expect.poll(() => page.locator('#capabilities').evaluate((element) => Math.round(element.getBoundingClientRect().top)), { timeout: 5000 }).toBe(0);
});

test('the loop labels are left out wherever their ring would reach the chapter copy', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width, height, expected] of [[1440, 900, 'on'], [1920, 1080, 'on'], [1280, 720, 'on'], [1100, 900, 'off'], [1200, 1050, 'off']]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.locator('.ch-layer'), `${width}x${height}`).toHaveAttribute('data-labels', expected);
    if (expected === 'off') await expect(page.locator('.ch-loop-labels')).toHaveCSS('visibility', 'hidden');
  }
});

test('the loop labels show only while the core rests in the method chapter', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const labels = page.locator('.ch-loop-labels');
  await page.locator('#method').evaluate((element) => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY, behavior: 'instant' }));
  await expect(page.locator('.ch-layer')).toHaveAttribute('data-chapter', 'method');
  await expect(labels).toHaveCSS('opacity', '1');
  // A fifth of the way toward the research chapter the core is on its way: the labels are gone.
  await page.evaluate(() => {
    const method = document.getElementById('method').getBoundingClientRect();
    const end = method.top + window.scrollY + method.height - window.innerHeight;
    const research = document.getElementById('research').getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: end + (research - end) * 0.2, behavior: 'instant' });
  });
  await expect(page.locator('.ch-layer')).toHaveAttribute('data-chapter', 'method');
  await expect(labels).toHaveCSS('opacity', '0');
});

test('portrait tablets stack the copy below the core', async ({ page }) => {
  for (const [width, height] of [[768, 1024], [1024, 1366]]) {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    for (const chapter of ['capabilities', 'method', 'research', 'company', 'contact']) {
      await page.locator(`#${chapter}`).evaluate((element) => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY, behavior: 'instant' }));
      await expect(page.locator('.ch-layer')).toHaveAttribute('data-chapter', chapter);
      const clearance = await page.evaluate((id) => {
        const layer = getComputedStyle(document.querySelector('.ch-layer'));
        const band = parseFloat(layer.getPropertyValue('--cy')) + parseFloat(layer.getPropertyValue('--cr')) * 2;
        return document.querySelector(`#${id} .ch-kicker`).getBoundingClientRect().top - band;
      }, chapter);
      expect(clearance, `${chapter} at ${width}x${height}`).toBeGreaterThanOrEqual(0);
    }
  }
});

test('the loop labels wait for the core, so they never cross copy on arrival', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');
  await expect(page.locator('.ch-rail')).toHaveCSS('opacity', '1', { timeout: 8000 });
  // Every director update from the start of a move: are any labels drawn over the chapter copy?
  const watch = () => page.evaluate(() => {
    const layer = document.querySelector('.ch-layer');
    const labels = document.querySelector('.ch-loop-labels');
    const copy = () => {
      const boxes = [];
      const walker = document.createTreeWalker(document.getElementById('method'), NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const parent = node.parentElement;
        if (!node.textContent.trim() || parent.closest('.ch-loop-list') || !parent.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const rect of range.getClientRects()) if (rect.width && rect.bottom > 0 && rect.top < window.innerHeight) boxes.push(rect);
      }
      return boxes;
    };
    window.__overlaps = 0;
    window.__watch = new MutationObserver(() => {
      if (Number(getComputedStyle(labels).opacity) < 0.05) return;
      const boxes = copy();
      const hit = [...labels.querySelectorAll('li')].some((item) => {
        const a = item.getBoundingClientRect();
        return boxes.some((b) => a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom);
      });
      if (hit) window.__overlaps += 1;
    });
    window.__watch.observe(layer, { attributes: true, attributeFilter: ['style'] });
  });
  const overlaps = () => page.evaluate(() => {
    window.__watch.disconnect();
    return window.__overlaps;
  });
  const fromResearch = async () => {
    await page.locator('#research').evaluate((element) => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY, behavior: 'instant' }));
    await page.waitForTimeout(2000);
    await watch();
  };
  await fromResearch();
  await page.locator('.ch-rail a[href="#method"]').click();
  await page.waitForTimeout(3000);
  expect(await overlaps(), 'rail arrival').toBe(0);
  await fromResearch();
  await page.mouse.move(640, 360);
  for (let step = 0; step < 12; step += 1) await page.mouse.wheel(0, -120);
  await page.waitForTimeout(3000);
  expect(await overlaps(), 'wheel arrival').toBe(0);
  // Once the core has arrived, the labels are there.
  await expect(page.locator('.ch-layer')).toHaveAttribute('data-chapter', 'method');
  await expect(page.locator('.ch-loop-labels')).toHaveCSS('opacity', '1');
});

test('PageDown into the contact chapter does not throw the core up and drop it back', async ({ page }) => {
  for (const [width, height] of [[1920, 1080], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.locator('.ch-motion')).toHaveCSS('opacity', '1', { timeout: 8000 });
    await page.locator('#company').evaluate((element) => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY, behavior: 'instant' }));
    await page.waitForTimeout(2000);
    await page.evaluate(() => {
      const layer = document.querySelector('.ch-layer');
      const kicker = document.querySelector('#contact .ch-kicker');
      window.__trace = [];
      window.__watch = new MutationObserver(() => window.__trace.push({
        y: window.scrollY,
        cy: parseFloat(layer.style.getPropertyValue('--cy')),
        cr: parseFloat(layer.style.getPropertyValue('--cr')),
        kicker: kicker.getBoundingClientRect().top,
        chapter: layer.dataset.chapter,
      }));
      window.__watch.observe(layer, { attributes: true, attributeFilter: ['style'] });
    });
    await page.mouse.move(width / 2, height / 2);
    await page.keyboard.press('PageDown');
    await page.waitForTimeout(2000);
    const trace = await page.evaluate(() => {
      window.__watch.disconnect();
      return window.__trace;
    });
    expect(trace.length, `${width}x${height}`).toBeGreaterThan(10);
    let drop = 0;
    let gap = Infinity;
    for (let index = 1; index < trace.length; index += 1) {
      const [a, b] = [trace[index - 1], trace[index]];
      // The page only moves down here, so the core moving down is a drop back.
      if (b.y >= a.y) drop = Math.max(drop, b.cy - a.cy);
      if (b.chapter === 'contact' && b.kicker > 0 && b.kicker < height) gap = Math.min(gap, b.kicker - (b.cy + b.cr * 1.6));
    }
    expect(drop, `${width}x${height}: largest one-frame drop`).toBeLessThan(20);
    expect(gap, `${width}x${height}: ring to contact kicker`).toBeGreaterThanOrEqual(0);
  }
});

test('after keyboard paging the core is not left gliding over the new heading', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');
  await expect(page.locator('.ch-motion')).toHaveCSS('opacity', '1', { timeout: 8000 });
  for (const [from, to] of [['method', 'research'], ['research', 'company']]) {
    // Start at the end of the previous chapter's range, one PageDown from the next.
    await page.locator(`#${from}`).evaluate((element) => {
      const rect = element.getBoundingClientRect();
      window.scrollTo({ top: rect.top + window.scrollY + Math.max(0, rect.height - window.innerHeight), behavior: 'instant' });
    });
    await page.waitForTimeout(2300);
    await page.evaluate(() => {
      const layer = document.querySelector('.ch-layer');
      const headings = [...document.querySelectorAll('[data-chapter-section] h2')];
      window.__rows = [];
      window.__watch = new MutationObserver(() => {
        const cx = parseFloat(layer.style.getPropertyValue('--cx'));
        const cy = parseFloat(layer.style.getPropertyValue('--cy'));
        const r = parseFloat(layer.style.getPropertyValue('--cr'));
        const over = headings.some((heading) => {
          const range = document.createRange();
          range.selectNodeContents(heading);
          return [...range.getClientRects()].some((box) => {
            if (!box.width || box.bottom < 0 || box.top > window.innerHeight) return false;
            const x = Math.max(box.left, Math.min(cx, box.right));
            const y = Math.max(box.top, Math.min(cy, box.bottom));
            return Math.hypot(x - cx, y - cy) < r * 0.9;
          });
        });
        window.__rows.push({ y: window.scrollY, over });
      });
      window.__watch.observe(layer, { attributes: true, attributeFilter: ['style'] });
    });
    await page.mouse.move(640, 360);
    await page.keyboard.press('PageDown');
    await page.waitForTimeout(2600);
    const rows = await page.evaluate(() => {
      window.__watch.disconnect();
      return window.__rows;
    });
    let lastMove = 0;
    for (let index = 1; index < rows.length; index += 1) if (Math.abs(rows[index].y - rows[index - 1].y) > 0.5) lastMove = index;
    expect(lastMove, `${from} to ${to}: the page moved`).toBeGreaterThan(0);
    expect(rows.slice(lastMove + 1).filter((row) => row.over).length, `${from} to ${to}: frames over a heading after the page stopped`).toBe(0);
  }
});

test('the core only fades while crossing the top edge, and the page ends with it gone or whole', async ({ page }) => {
  for (const [width, height] of [[1440, 900], [2560, 1440], [390, 844], [768, 1024], [834, 1194], [912, 1368], [1024, 1366], [1024, 1420], [768, 1700], [1080, 1600], [1080, 1920]]) {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    // Walk from the contact chapter's resting place to the page end.
    const walk = await page.evaluate(async () => {
      const layer = document.querySelector('.ch-layer');
      const top = document.getElementById('contact').getBoundingClientRect().top + window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const rows = [];
      for (let y = Math.min(top, max); ; y = Math.min(max, y + 16)) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const style = getComputedStyle(layer);
        rows.push({ opacity: Number(style.opacity), top: parseFloat(style.getPropertyValue('--cy')) - parseFloat(style.getPropertyValue('--cr')), offstage: layer.dataset.offstage });
        if (y >= max) break;
      }
      return rows;
    });
    const size = `${width}x${height}`;
    for (const row of walk) if (row.opacity < 0.99) expect(row.top, `${size}: dimmed while fully on screen`).toBeLessThan(0);
    const end = walk.at(-1);
    if (end.opacity > 0.5) {
      expect(end.opacity, `${size}: page end`).toBe(1);
      expect(end.top, `${size}: whole at the page end`).toBeGreaterThanOrEqual(0);
    } else {
      // Gone: below the 1% cut-off, hidden, and no longer drawn.
      expect(end.opacity, `${size}: page end`).toBeLessThan(0.01);
      expect(end.offstage, `${size}: page end`).toBe('true');
    }
  }
});

test('an instant jump lands the core in place instead of gliding it across copy', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.ch-rail')).toHaveCSS('opacity', '1', { timeout: 8000 });
  const top = (id) => page.locator(`#${id}`).evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
  // Every frame's core position from the jump on (read after the director writes it).
  const jump = (target) => page.evaluate(async (y) => {
    const layer = document.querySelector('.ch-layer');
    const frames = [];
    const observer = new MutationObserver(() => frames.push({ cx: parseFloat(layer.style.getPropertyValue('--cx')), cy: parseFloat(layer.style.getPropertyValue('--cy')) }));
    observer.observe(layer, { attributes: true, attributeFilter: ['style'] });
    window.scrollTo({ top: y, behavior: 'instant' });
    for (let frame = 0; frame < 3; frame += 1) await new Promise((resolve) => requestAnimationFrame(resolve));
    observer.disconnect();
    return { frames, width: layer.clientWidth };
  }, target);
  const research = await top('research');
  // A whole chapter, and less than half a screen, both land at the research position.
  for (const from of [await top('capabilities'), research - 900 * 0.45]) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), from);
    await page.waitForTimeout(1500);
    const { frames, width } = await jump(research);
    expect(frames.length).toBeGreaterThan(0);
    expect(Math.abs(frames[frames.length - 1].cx - width * 0.31), `from ${Math.round(from)}`).toBeLessThan(40);
  }
  // A jump into the contact chapter lands at its resting place on every frame,
  // not a fast flick's safety margin above it.
  const contact = await top('contact');
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), contact);
  await page.waitForTimeout(1500);
  const rest = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.ch-layer')).getPropertyValue('--cy')));
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), await top('company'));
  await page.waitForTimeout(1500);
  const { frames } = await jump(contact);
  expect(frames.length).toBeGreaterThan(0);
  for (const frame of frames) expect(Math.abs(frame.cy - rest)).toBeLessThan(12);
});

test('with classic scrollbars, first paint and the layout choice match the script', async ({ playwright, baseURL }) => {
  // The suite's browser hides scrollbars; this one shows them (15 px on Windows).
  const browser = await playwright.chromium.launch({
    headless: true,
    ignoreDefaultArgs: ['--hide-scrollbars'],
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : { channel: 'chrome' }),
  });
  const place = () => {
    const box = (selector) => {
      const rect = document.querySelector(selector).getBoundingClientRect();
      return [rect.left + rect.width / 2, rect.top + rect.height / 2, rect.width];
    };
    return { poster: box('.ch-poster'), hud: box('.ch-hud'), scrollbar: window.innerWidth - document.documentElement.clientWidth };
  };
  try {
    for (const [width, height] of [[1440, 900], [1024, 768], [1024, 1366], [1100, 1100], [1099, 1100], [390, 844]]) {
      const viewport = { width, height };
      const still = await browser.newContext({ baseURL, viewport, javaScriptEnabled: false, reducedMotion: 'reduce' });
      await still.route('**/*', (route) => (route.request().method() === 'POST' ? route.abort() : route.continue()));
      const plain = await still.newPage();
      await plain.goto('/');
      const before = await plain.evaluate(place);
      await still.close();
      const live = await browser.newContext({ baseURL, viewport, reducedMotion: 'reduce' });
      await live.route('**/*', (route) => (route.request().method() === 'POST' ? route.abort() : route.continue()));
      const page = await live.newPage();
      await page.goto('/');
      await expect(page.locator('.ch-layer')).toHaveClass(/is-directed/);
      const after = await page.evaluate(place);
      expect(before.scrollbar, `${width}x${height} shows a scrollbar`).toBeGreaterThan(0);
      for (const key of ['poster', 'hud']) {
        before[key].forEach((value, index) => expect(Math.abs(value - after[key][index]), `${key} at ${width}x${height}`).toBeLessThan(1));
      }
      // Script (core in the top band) and CSS (band layer raised) agree on the stacked layout.
      await page.locator('#capabilities').evaluate((element) => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY, behavior: 'instant' }));
      await expect(page.locator('.ch-layer')).toHaveAttribute('data-chapter', 'capabilities');
      const agree = await page.evaluate(() => {
        const layer = document.querySelector('.ch-layer');
        const style = getComputedStyle(layer);
        const script = Math.abs(parseFloat(style.getPropertyValue('--cy')) / layer.clientHeight - 0.2) < 0.02;
        return { script, css: style.zIndex === '3' };
      });
      expect(agree.script, `${width}x${height}`).toBe(agree.css);
      await live.close();
    }
  } finally {
    await browser.close();
  }
});

test('reduced motion skips the boot sequence and the motion control', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.ch-layer')).toHaveAttribute('data-scene', /ready|fallback/, { timeout: 20000 });
  await expect(page.locator('html')).not.toHaveClass(/core-boot/);
  await expect(page.getByRole('button', { name: /motion/i })).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Human intent\.\s*Intelligent action\./);
  expect(await page.locator('.ch-title').evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
});

test('without the 3D module the poster and instruments still carry the page', async ({ page }) => {
  await page.route('**/coreScene-*.js', (route) => route.abort());
  await page.goto('/');
  const layer = page.locator('.ch-layer');
  await expect(layer).toHaveAttribute('data-scene', 'fallback', { timeout: 20000 });
  const poster = page.locator('.ch-poster img');
  await expect(poster).toBeVisible();
  expect(await poster.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  await page.locator('#research').evaluate((element) => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY, behavior: 'instant' }));
  await expect(layer).toHaveAttribute('data-chapter', 'research');
  await expect(page.locator('#research').getByRole('link', { name: /Persona Fleet/ })).toBeVisible();
});

test('leaving the homepage disposes the scene and returning restores it', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.ch-layer')).toHaveAttribute('data-scene', /ready|fallback/, { timeout: 20000 });
  await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Research', exact: true }).click();
  await expect(page).toHaveURL(/\/research$/);
  await expect(page.locator('.ch-canvas canvas')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  await expect(page.locator('main h1')).toBeVisible();
  await page.getByRole('banner').getByRole('link', { name: 'Whoff Agents home' }).click();
  await expect(page.locator('.ch-layer')).toHaveAttribute('data-scene', /ready|fallback/, { timeout: 20000 });
  await expect(page.locator('.ch-title')).toBeVisible();
});

test('supporting pages carry the core and their figures, and every reveal completes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const [route, figure] of [['/capabilities', '.eng-practice-card'], ['/research', '.eng-radar'], ['/research/persona-fleet', '.eng-study-diagram'], ['/about', '.eng-loop']]) {
    await page.goto(route);
    await expect(page.locator('.eng-emblem'), route).toHaveAttribute('data-scene', /ready|fallback/, { timeout: 20000 });
    await expect(page.locator(figure).first(), route).toBeAttached();
    await page.waitForTimeout(1200);
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 260) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 110));
      }
    });
    await page.waitForTimeout(1600);
    const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-reveal], [data-reveal-group] > *')]
      .filter((element) => Number(getComputedStyle(element).opacity) < 0.99).length);
    expect(hidden, `${route}: reveals left hidden`).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBe(true);
  }
  await page.goto('/capabilities');
  for (const id of ['software', 'autonomy', 'integration', 'verification']) await expect(page.locator(`#${id}`)).toHaveCount(1);
  // After the reveal the cards sit exactly where the layout puts them, and
  // split headings keep a readable accessible name.
  await page.waitForTimeout(1200);
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 260) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 110));
    }
  });
  await page.waitForTimeout(1600);
  const offset = await page.evaluate(() => [...document.querySelectorAll('.eng-practice-card, .eng-service-card')]
    .filter((card) => !['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(getComputedStyle(card).transform)).length);
  expect(offset, 'cards left offset after the reveal').toBe(0);
  await expect(page.getByRole('heading', { name: 'Make the next step worth taking.', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'From a single tool to a connected system.', exact: true })).toBeVisible();
  await page.goto('/about');
  await expect(page.locator('.eng-loop ol li')).toHaveCount(7);
});

test('with reduced motion the supporting pages show the poster and complete figures', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/about');
  await expect(page.locator('.eng-emblem-poster')).toBeVisible();
  await page.waitForTimeout(800);
  await expect(page.locator('.eng-emblem canvas')).toHaveCount(0);
  await expect(page.locator('.eng-loop')).toHaveAttribute('data-step', '7');
  await page.goto('/capabilities');
  await expect(page.locator('.eng-track')).toHaveAttribute('data-step', '3');
});

test('moving between supporting pages keeps one core at a time', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/research');
  await expect(page.locator('.eng-emblem')).toHaveAttribute('data-scene', /ready|fallback/, { timeout: 20000 });
  await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Company', exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator('.eng-emblem')).toHaveAttribute('data-scene', /ready|fallback/, { timeout: 20000 });
  expect(await page.locator('canvas').count()).toBeLessThanOrEqual(1);
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
});

test('retained receptionist form keeps preview data local', async ({ page }) => {
  const posts = [];
  page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
  await page.goto('/receptionist');
  const form = page.locator('#lead-form form');
  await expect(form).toContainText('this form does not send an inquiry');
  await form.getByLabel('Business name', { exact: true }).fill('Preview test');
  await form.getByLabel('Your name', { exact: true }).fill('Local tester');
  await form.getByLabel('Phone', { exact: true }).fill('555 555 0123');
  await form.getByLabel('Email', { exact: true }).fill('test@example.com');
  await form.locator('textarea').fill('Local preview verification only.');
  await form.getByRole('button', { name: 'Send it to a person' }).click();
  await expect(page.getByRole('status')).toContainText('Preview complete. Nothing was sent.');
  expect(posts).toEqual([]);
});

test('public company facts and research maturity stay accurately qualified', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('main')).toContainText('Whoff Agents LLC');
  await expect(page.locator('main')).toContainText('CAGEPending');
  await expect(page.locator('main')).toContainText('Bill / CEO');
  await expect(page.locator('main')).not.toContainText('Senior Cyber Engineer');
  await expect(page.locator('main')).toContainText('Pursuing an M.S.');
  await page.goto('/research/persona-fleet');
  await expect(page.locator('main')).toContainText('In development');
  await expect(page.locator('main')).toContainText('protection effectiveness has not been established');
});

test('a trailing slash opens the page itself, with its own title and canonical', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const route of ['/capabilities', '/research/persona-fleet', '/studio/about', '/about']) {
    await page.goto(`${route}/`);
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page).toHaveTitle(routeMeta[route].title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://whoffagents.com${route}`);
  }
  expect(errors, 'errors while hydrating slash URLs').toEqual([]);
});

test('header and footer links open the next page at its top', async ({ page }) => {
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    await page.setViewportSize({ width, height });
    for (const [from, to] of [['/about', '/capabilities'], ['/capabilities', '/research'], ['/research/persona-fleet', '/about'], ['/web', '/']]) {
      await page.goto(from);
      await page.waitForTimeout(1500);
      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight * 0.45, behavior: 'instant' }));
      await page.waitForTimeout(600);
      const clicked = await page.evaluate((href) => {
        const link = [...document.querySelectorAll('header a, footer a')].find((a) => a.getAttribute('href') === href);
        link?.click();
        return Boolean(link);
      }, to);
      expect(clicked, `a header or footer link to ${to}`).toBe(true);
      await expect(page).toHaveURL(new RegExp(`${to === '/' ? '' : to}/?$`));
      await page.waitForTimeout(2500);
      expect(await page.evaluate(() => Math.round(window.scrollY)), `${from} -> ${to} at ${width}px`).toBeLessThanOrEqual(5);
    }
  }
});

test('the homepage settles without layout shift', async ({ page }) => {
  await page.addInitScript(() => {
    window.__shift = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__shift += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });
  for (const [width, height, limit] of [[1440, 900, 0.01], [1920, 1080, 0.01], [390, 844, 0.02]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.locator('.ch-layer')).toHaveClass(/is-directed/);
    await page.waitForTimeout(3000);
    expect(await page.evaluate(() => window.__shift), `layout shift at ${width}x${height}`).toBeLessThan(limit);
  }
});

test('a doubled leading slash still opens the page', async ({ page, baseURL }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${baseURL}//capabilities/`);
  await expect(page).toHaveURL(/:\d+\/capabilities$/);
  await expect(page).toHaveTitle(routeMeta['/capabilities'].title);
  expect(errors.filter((message) => /cannot be created|replaceState/i.test(message)), 'history errors').toEqual([]);
});

test('the instruments are redrawn for the new screen after a rotation', async ({ page }) => {
  const scale = () => page.evaluate(() => Number(/scale\(([\d.]+)\)/.exec(document.querySelector('.ch-hud').style.transform)?.[1]));
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/');
  await expect(page.locator('.ch-layer')).toHaveClass(/is-directed/);
  await page.waitForTimeout(1200);
  for (const [width, height] of [[390, 844], [844, 390]]) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(1800);
    expect(Math.abs((await scale()) - 1), `HUD drawn near its display size at ${width}x${height}`).toBeLessThan(0.1);
  }
});
