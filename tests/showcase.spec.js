import { test, expect } from "@playwright/test";

test("project films play, pause persistently, and switch to the selected concept", async ({
  page,
}) => {
  await page.goto("/");
  const film = page.locator(".sr-film-video");
  await film.scrollIntoViewIfNeeded();
  await expect.poll(() => film.evaluate((v) => !v.paused)).toBe(true);
  await page.getByRole("button", { name: "Pause project film" }).click();
  await page.locator("#lead-form").scrollIntoViewIfNeeded();
  await film.scrollIntoViewIfNeeded();
  await expect.poll(() => film.evaluate((v) => v.paused)).toBe(true);
  await page.getByRole("button", { name: "02 The Forge Gym" }).click();
  await expect(film).toHaveAttribute("src", "/work/forge-motion.webm");
  await expect(page.locator(".sr-project-story")).toContainText("You can feel");
  await page.getByRole("button", { name: "Play project film" }).click();
  await expect
    .poll(() => film.evaluate((v) => !v.paused && v.currentTime > 0))
    .toBe(true);
  await expect(page.locator(".sr-project-story a")).toHaveAttribute(
    "href",
    "https://utahforgegym-preview.netlify.app",
  );
});

test("reduced motion starts on a still and only plays on explicit request", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const ambient = page.locator(".sr-ambient video");
  await expect(ambient).toHaveJSProperty("paused", true);
  await page.getByRole("button", { name: "Play background film" }).click();
  await expect
    .poll(() => ambient.evaluate((v) => !v.paused && v.currentTime > 0))
    .toBe(true);
  await page.getByRole("button", { name: "Pause background film" }).click();
  await expect(ambient).toHaveJSProperty("paused", true);
  const film = page.locator(".sr-film-video");
  await film.scrollIntoViewIfNeeded();
  await expect(film).toHaveJSProperty("paused", true);
  await expect(
    page.getByRole("button", { name: "Play project film" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Play project film" }).click();
  await expect
    .poll(() => film.evaluate((v) => !v.paused && v.currentTime > 0))
    .toBe(true);
  await page.getByRole("button", { name: "Pause project film" }).click();
  await expect(film).toHaveJSProperty("paused", true);
});
