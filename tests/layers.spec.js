import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("layered journey opens the stack and brings each project forward with the correct link", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/web?concept=layers");
  await expect(page.locator(".lp-experience")).toHaveAttribute(
    "data-scene",
    "ready",
  );
  const canvas = page.locator(".lp-canvas canvas");
  const initial = await canvas.screenshot();
  await page
    .getByRole("button", { name: "Open the work", exact: true })
    .click();
  await expect
    .poll(async () =>
      Number(await page.locator(".lp-canvas").getAttribute("data-progress")),
    )
    .toBeGreaterThan(0.995);
  expect(initial.equals(await canvas.screenshot())).toBe(false);
  await page.getByRole("button", { name: "Next layer", exact: true }).click();
  await expect
    .poll(async () =>
      Number(await page.locator(".lp-canvas").getAttribute("data-progress")),
    )
    .toBeGreaterThan(1.995);
  await expect(page.locator(".lp-caption h2")).toHaveText("Island Airporter");
  await expect(page.locator(".lp-caption a")).toHaveAttribute(
    "href",
    "https://main.d1v4o3c4563ysj.amplifyapp.com",
  );
  await expect(page.locator(".lp-caption small")).toContainText(
    "AWAITING APPROVAL",
  );
  await page.getByRole("link", { name: "Compare the cube" }).click();
  await expect(page.locator(".dx-experience")).toHaveAttribute(
    "data-scene",
    "ready",
  );
  await expect(page.locator(".lp-canvas")).toHaveCount(0);
});

test("scroll advances the panels and pause holds the selected journey", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/web?concept=layers");
  await expect(page.locator(".lp-experience")).toHaveAttribute(
    "data-scene",
    "ready",
  );
  await page.locator(".lp-experience").evaluate((e) => {
    const r = e.getBoundingClientRect();
    window.scrollTo({
      top: scrollY + r.top - 86 + (r.height - innerHeight + 86) * 0.75,
      behavior: "instant",
    });
  });
  await expect(page.locator(".lp-caption h2")).toHaveText(
    "Agents with purpose",
  );
  await expect
    .poll(async () =>
      Number(await page.locator(".lp-canvas").getAttribute("data-progress")),
    )
    .toBeGreaterThan(2.995);
  await page.getByRole("button", { name: "Pause journey" }).click();
  const held = await page.locator(".lp-canvas").getAttribute("data-progress");
  await page.evaluate(() => window.scrollBy({ top: 100, behavior: "instant" }));
  await page.waitForTimeout(200);
  expect(await page.locator(".lp-canvas").getAttribute("data-progress")).toBe(
    held,
  );
});

test("layer controls work with reduced motion and without WebGL", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?concept=layers");
  await expect(page.locator(".lp-experience")).toHaveAttribute(
    "data-scene",
    "ready",
  );
  expect(
    await page
      .locator(".lp-stage")
      .evaluate((e) => getComputedStyle(e).position),
  ).toBe("relative");
  await page
    .getByRole("group", { name: "Choose a portfolio layer" })
    .getByRole("button", { name: "Island Airporter" })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".lp-canvas")).toHaveAttribute(
    "data-progress",
    "2.000",
  );
  await page
    .locator(".lp-canvas canvas")
    .evaluate((c) =>
      c.getContext("webgl2").getExtension("WEBGL_lose_context").loseContext(),
    );
  await expect(page.locator(".lp-experience")).toHaveAttribute(
    "data-scene",
    "fallback",
  );
  await expect(page.locator(".lp-fallback")).toBeVisible();
  await page.getByRole("button", { name: "Next layer", exact: true }).click();
  await expect(page.locator(".lp-caption h2")).toHaveText(
    "Agents with purpose",
  );
  await expect(page.locator(".lp-fallback")).toHaveAttribute(
    "src",
    "/work/agent-surface.svg",
  );
});

test("prototype fits small and large screens and has accessible controls", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/web?concept=layers");
    await expect(page.locator(".lp-experience")).toHaveAttribute(
      "data-scene",
      "ready",
    );
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator("h1")).toHaveCount(1);
    const results = await new AxeBuilder({ page })
      .include(".lp-experience")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
});
