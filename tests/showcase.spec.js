import { test, expect } from "@playwright/test";

async function ready(page) {
  await page.goto("/?concept=cube");
  await page.keyboard.press("Shift");
  await page.keyboard.press("Shift");
  await expect(page.locator(".dx-experience")).toHaveAttribute(
    "data-scene",
    "ready",
  );
  await expect
    .poll(() => page.locator(".dx-object").getAttribute("data-draw-calls"))
    .not.toBeNull();
  await page.evaluate(() => document.fonts.ready);
}

test("real WebGL pixels change with project controls, and links match the visible face", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await ready(page);
  const canvas = page.locator(".dx-object canvas");
  expect(await canvas.evaluate((c) => Boolean(c.getContext("webgl2")))).toBe(
    true,
  );
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  const before = await canvas.screenshot();
  await page
    .getByRole("button", { name: "Next dimension", exact: true })
    .click();
  await expect
    .poll(async () =>
      Number(await page.locator(".dx-object").getAttribute("data-turn")),
    )
    .toBeGreaterThan(0.999);
  const after = await canvas.screenshot();
  expect(before.equals(after)).toBe(false);
  await expect(page.locator(".dx-project h2")).toHaveText("Island Airporter");
  await expect(page.locator(".dx-project > a")).toHaveAttribute(
    "href",
    "https://main.d1v4o3c4563ysj.amplifyapp.com",
  );
  await expect(page.locator(".dx-project")).toContainText("AWAITING APPROVAL");
  await page
    .getByRole("button", { name: "Tools for the builders", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".dx-project > a")).toHaveAttribute(
    "href",
    "/products",
  );
  await expect(page.locator("video")).toHaveCount(0);
});

test("scroll rotates the cube; pause persists through scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);
  await page.evaluate(() => {
    const r = document.querySelector(".dx-experience").getBoundingClientRect();
    window.scrollTo({
      top: scrollY + r.top - 80 + ((r.height - innerHeight + 80) * 2) / 3,
      behavior: "instant",
    });
  });
  await expect(page.locator(".dx-project h2")).toHaveText(
    "Agents with purpose",
  );
  await expect
    .poll(async () =>
      Number(await page.locator(".dx-object").getAttribute("data-turn")),
    )
    .toBeGreaterThan(1.99);
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  await page.evaluate(() => window.scrollBy({ top: 160, behavior: "instant" }));
  await expect(page.locator(".dx-project h2")).toHaveText(
    "Agents with purpose",
  );
  await expect(
    page.getByRole("button", { name: "Resume motion", exact: true }),
  ).toBeVisible();
});

test("reduced motion renders a stable still but keeps every dimension accessible", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await page.waitForTimeout(500);
  const canvas = page.locator(".dx-object canvas");
  const before = await canvas.screenshot();
  await page.waitForTimeout(250);
  const after = await canvas.screenshot();
  expect(before.equals(after)).toBe(true);
  await expect(
    page.getByRole("button", { name: "Pause motion", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Next dimension", exact: true })
    .click();
  await expect(page.locator(".dx-object")).toHaveAttribute(
    "data-turn",
    "1.000",
  );
  expect(before.equals(await canvas.screenshot())).toBe(false);
});

test("WebGL unavailable and context loss both leave usable project browsing", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return /webgl/.test(type) ? null : original.call(this, type, ...args);
    };
  });
  await page.goto("/?concept=cube");
  await page.keyboard.press("Shift");
  await expect(page.locator(".dx-experience")).toHaveAttribute(
    "data-scene",
    "fallback",
  );
  await expect(page.locator(".dx-fallback img")).toBeVisible();
  await page
    .getByRole("button", { name: "Next dimension", exact: true })
    .click();
  await expect(page.locator(".dx-fallback img")).toHaveAttribute(
    "src",
    "/work/island.webp",
  );
  await expect(page.locator(".dx-project > a")).toHaveAttribute(
    "href",
    "https://main.d1v4o3c4563ysj.amplifyapp.com",
  );
});

test("context loss and route changes cleanly replace the renderer", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await ready(page);
  await page
    .locator(".dx-object canvas")
    .evaluate((c) =>
      c.getContext("webgl2").getExtension("WEBGL_lose_context").loseContext(),
    );
  await expect(page.locator(".dx-experience")).toHaveAttribute(
    "data-scene",
    "fallback",
  );
  await page
    .locator(".st-desktop-nav")
    .getByRole("link", { name: "AI agents", exact: true })
    .click();
  await expect(page.locator(".dx-object canvas")).toHaveCount(0);
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Whoff Agents home", exact: true })
    .click();
  await page.keyboard.press("Shift");
  await expect(page.locator(".dx-experience")).toHaveAttribute(
    "data-scene",
    "ready",
  );
  await expect(page.locator(".dx-object canvas")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("mobile uses normal page flow and direct cube controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  expect(
    await page
      .locator(".dx-sticky")
      .evaluate((e) => getComputedStyle(e).position),
  ).toBe("relative");
  await page
    .getByRole("button", { name: "Next dimension", exact: true })
    .click();
  await expect(page.locator(".dx-project h2")).toHaveText("Island Airporter");
  await expect(page.locator(".dx-project > a")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("prerendered page has meaningful content without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${test.info().project.use.baseURL}/`);
  await page.keyboard.press("Shift");
  await expect(page.locator("h1")).toContainText("dimension.");
  await expect(page.locator(".dx-fallback img")).toBeVisible();
  await expect(page.locator(".dx-project > a")).toHaveAttribute(
    "href",
    "https://spindlecreek.com",
  );
  await context.close();
});

test("Three.js stays out of initial HTML and scripts; interaction loads the scene", async ({
  page,
}) => {
  const sceneChunk =
    /(?:RoomEnvironment|cubeScene|identityScene|layerScene)-[^/]+\.js/;
  for (const [route, selector] of [
    ["/?concept=cube", ".dx-experience"],
    ["/web", ".lp-experience"],
    ["/agents", ".dp-hero"],
    ["/products", ".dp-hero"],
  ]) {
    const scripts = [];
    const track = (request) => {
      if (request.resourceType() === "script") scripts.push(request.url());
    };
    page.on("request", track);
    const response = await page.goto(route);
    expect(await response.text()).not.toMatch(sceneChunk);
    await page.waitForLoadState("networkidle");
    expect(scripts.filter((url) => sceneChunk.test(url))).toEqual([]);
    await expect(page.locator(selector)).toHaveAttribute(
      "data-scene",
      "loading",
    );
    await expect(page.locator("h1")).toBeVisible();
    await page.keyboard.press("Shift");
    await expect(page.locator(selector)).toHaveAttribute("data-scene", "ready");
    expect(scripts.some((url) => sceneChunk.test(url))).toBe(true);
    page.off("request", track);
  }
});
