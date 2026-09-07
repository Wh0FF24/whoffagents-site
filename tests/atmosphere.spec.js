import { test, expect } from "@playwright/test";

test("background field follows scrolling and freezes when reduced motion is requested", async ({
  page,
}) => {
  await page.goto("/about");
  const offset = () =>
    page.evaluate(() =>
      document.documentElement.style.getPropertyValue("--field-offset"),
    );
  await expect.poll(offset).toBe("0px");
  await page.evaluate(() =>
    window.scrollTo({ top: 1200, behavior: "instant" }),
  );
  await expect.poll(offset).not.toBe("0px");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(offset).toBe("0px");
  await page.evaluate(() =>
    window.scrollTo({ top: 1800, behavior: "instant" }),
  );
  await page.waitForTimeout(150);
  expect(await offset()).toBe("0px");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect.poll(offset).not.toBe("0px");
});

test("shared fields stay behind content on every page family without adding canvases", async ({
  page,
  request,
}) => {
  expect((await request.get("/art/contour-field.svg")).ok()).toBe(true);
  for (const [route, selector] of [
    ["/", "#services"],
    ["/web", "#work"],
    ["/agents", "#agent-demo"],
    ["/products", "#catalog"],
    ["/about", "#studio-story"],
    ["/privacy", ".dp-support-page"],
  ]) {
    await page.goto(route);
    const section = page.locator(selector);
    const layer = await section.evaluate((e) => {
      const css = getComputedStyle(e, "::after");
      return { z: css.zIndex, pointer: css.pointerEvents, mask: css.maskImage };
    });
    expect(layer.z).toBe("-1");
    expect(layer.pointer).toBe("none");
    expect(layer.mask).toContain("contour-field.svg");
    await expect(section.locator("canvas")).toHaveCount(0);
  }
});
