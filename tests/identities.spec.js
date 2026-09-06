import { test, expect } from "@playwright/test";
import { routeMeta } from "../src/data/routeMeta.js";

async function maxPixelDelta(page, first, second) {
  // Chrome can round a few antialiased pixels by one RGB level between
  // captures of a stopped WebGL canvas. Compare pixels, not PNG bytes.
  return page.evaluate(
    async (sources) => {
      const pixels = await Promise.all(
        sources.map(async (source) => {
          const image = new Image();
          image.src = `data:image/png;base64,${source}`;
          await image.decode();
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0);
          return context.getImageData(0, 0, image.width, image.height).data;
        }),
      );
      if (pixels[0].length !== pixels[1].length) return 255;
      let delta = 0;
      for (let i = 0; i < pixels[0].length; i++)
        delta = Math.max(delta, Math.abs(pixels[0][i] - pixels[1][i]));
      return delta;
    },
    [first.toString("base64"), second.toString("base64")],
  );
}

const identities = [
  ["/agents", "02 / Email"],
  ["/products", "03 / Kits"],
  ["/about", "Human direction"],
];
for (const [route, control] of identities) {
  test(`${route} has a stable reduced-motion sculpture with working choices`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    await expect(page.locator(".dp-hero")).toHaveAttribute(
      "data-scene",
      "ready",
    );
    const canvas = page.locator(".dp-canvas canvas");
    await expect
      .poll(() => page.locator(".dp-canvas").getAttribute("data-draw-calls"))
      .not.toBeNull();
    await page.evaluate(() => document.fonts.ready);
    // Let the font-driven ResizeObserver and the initial GPU frame settle.
    await page.waitForTimeout(500);
    const before = await canvas.screenshot();
    await page.waitForTimeout(250);
    const still = await canvas.screenshot();
    expect(await maxPixelDelta(page, before, still)).toBeLessThanOrEqual(1);
    await expect(
      page.getByRole("button", { name: "Pause sculpture" }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: control, exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("button", { name: control, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(before.equals(await canvas.screenshot())).toBe(false);
    if (route === "/products") {
      await expect(page.locator(".st-tool-card")).toHaveCount(1);
      await expect(page.locator(".st-tool-card")).toContainText("AI SaaS");
      await page.getByRole("button", { name: "Skills", exact: true }).click();
      await expect(
        page.getByRole("button", { name: "01 / Skills", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
    }
    if (route === "/agents")
      await expect(page.locator(".st-demo-messages")).toContainText(
        "estimate we discussed",
      );
    if (route === "/about")
      await expect(page.locator(".dp-caption")).toContainText(
        "Will sets the direction",
      );
  });
}

test("sculpture animation pauses, selection still works, and context loss preserves content", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/agents");
  await expect(page.locator(".dp-hero")).toHaveAttribute("data-scene", "ready");
  const canvas = page.locator(".dp-canvas canvas");
  const moving = await canvas.screenshot();
  await page.waitForTimeout(200);
  expect(moving.equals(await canvas.screenshot())).toBe(false);
  await page.getByRole("button", { name: "Pause sculpture" }).click();
  await canvas.scrollIntoViewIfNeeded();
  await expect(page.locator(".dp-canvas")).toHaveAttribute(
    "data-motion",
    "paused",
  );
  const paused = await canvas.screenshot();
  await page.waitForTimeout(200);
  expect(
    await maxPixelDelta(page, paused, await canvas.screenshot()),
  ).toBeLessThanOrEqual(1);
  await page
    .getByRole("button", { name: "03 / Repeat work", exact: true })
    .click();
  expect(paused.equals(await canvas.screenshot())).toBe(false);
  await canvas.evaluate((c) =>
    c.getContext("webgl2").getExtension("WEBGL_lose_context").loseContext(),
  );
  await expect(page.locator(".dp-hero")).toHaveAttribute(
    "data-scene",
    "fallback",
  );
  await expect(page.locator(".dp-fallback")).toBeVisible();
  await page
    .locator(".st-desktop-nav")
    .getByRole("link", { name: "Developer tools", exact: true })
    .click();
  await expect(page.locator(".dp-hero")).toHaveAttribute("data-scene", "ready");
  await expect(page.locator("canvas")).toHaveCount(1);
  await page
    .locator(".st-desktop-nav")
    .getByRole("link", { name: "The studio", exact: true })
    .click();
  await expect(page.locator(".dp-hero")).toHaveAttribute("data-scene", "ready");
  await expect(page.locator("canvas")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("all three identities remain usable without WebGL", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return /webgl/.test(type) ? null : original.call(this, type, ...args);
    };
  });
  for (const [route, control] of identities) {
    await page.goto(route);
    await expect(page.locator(".dp-hero")).toHaveAttribute(
      "data-scene",
      "fallback",
    );
    await expect(page.locator(".dp-fallback")).toBeVisible();
    await page.getByRole("button", { name: control, exact: true }).click();
    await expect(
      page.getByRole("button", { name: control, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".dp-cta")).toBeVisible();
  }
});

test("new hero content is prerendered without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const [route] of identities) {
    // Vite preview rewrites extensionless URLs to the SPA root; inspect the
    // actual per-route HTML artifact that the production host serves.
    await page.goto(`http://127.0.0.1:4174${route}/index.html`);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator(".dp-fallback")).toBeVisible();
    await expect(page.locator(".dp-cta")).toBeVisible();
  }
  await context.close();
});

test("supporting routes retain readable chapter frames at mobile and desktop widths", async ({
  page,
}) => {
  const core = ["/", "/web", "/agents", "/products", "/about"];
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of Object.keys(routeMeta).filter(
      (r) => !core.includes(r),
    )) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator(".dp-page-rail")).toBeVisible();
      await expect(page.locator("h1")).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}px`,
      ).toBe(true);
    }
  }
});
