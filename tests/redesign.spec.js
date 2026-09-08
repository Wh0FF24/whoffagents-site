import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { routeMeta } from "../src/data/routeMeta.js";

for (const width of [320, 390, 768, 1440]) {
  test(`core routes fit ${width}px and have no serious accessibility violations`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/web", "/agents", "/products", "/about"]) {
      await page.goto(route);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.keyboard.press("Shift");
      await expect(page.locator("[data-scene]")).toHaveAttribute("data-scene", /ready|fallback/);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      for (const img of await page.locator("img").all()) {
        await img.scrollIntoViewIfNeeded();
        await expect
          .poll(() => img.evaluate((el) => el.complete && el.naturalWidth > 0))
          .toBe(true);
      }
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
    }
  });
}
test("project keyboard tabs, transcript, care plans and FAQ work", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("tab", { name: /Spindle Creek/ }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: /Island Airporter/ }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("awaiting approval");
  await page.getByRole("button", { name: "Next step" }).click();
  await expect(page.locator(".st-demo-messages")).toContainText(
    "AI assistant for the shop",
  );
  await page
    .getByRole("button", { name: "Email", exact: true })
    .first()
    .click();
  await expect(page.locator(".st-demo-messages")).toContainText(
    "estimate we discussed",
  );
  await page.getByRole("button", { name: "Next step" }).click();
  await page.getByRole("button", { name: "Next step" }).click();
  await page.getByRole("button", { name: "Replay example" }).click();
  await expect(page.locator(".st-message")).toHaveCount(1);
  await page.getByRole("button", { name: /Care Full/ }).click();
  await expect(page.locator(".st-care-description")).toContainText(
    "unlimited content edits",
  );
  await page.getByRole("button", { name: "Who owns the website?" }).click();
  await expect(page.locator("#faq-answer-2")).toBeVisible();
});
test("preview inquiry is accessible and sends no request", async ({ page }) => {
  const posts = [];
  page.on("request", (r) => {
    if (r.method() === "POST") posts.push(r.url());
  });
  await page.goto("/agents#lead-form");
  const form = page.locator("form.iq-form");
  await expect(
    form.getByRole("radio", { name: "AI agent", exact: true }),
  ).toBeChecked();
  await form.getByLabel("Name", { exact: true }).fill("Preview tester");
  await form.getByLabel("Email", { exact: true }).fill("test@example.com");
  await form
    .getByLabel("What are you trying to get done?")
    .fill("Test the local inquiry preview.");
  await form.getByRole("button", { name: /Tell us about/ }).click();
  await expect(form.getByRole("status")).toHaveText(
    "Preview complete. Nothing was sent.",
  );
  await form.getByRole("button", { name: "Phone", exact: true }).click();
  await expect(form.locator("input[type=email]")).toHaveCount(0);
  await form.getByLabel("Phone", { exact: true }).fill("555 555 0123");
  await form.getByRole("button", { name: /Tell us about/ }).click();
  await expect(form.getByRole("status")).toHaveText(
    "Preview complete. Nothing was sent.",
  );
  expect(posts).toEqual([]);
});
test("mobile navigation and product search work", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Developer tools" })
    .click();
  await expect(page).toHaveURL(/\/products$/);
  await expect(
    page.getByRole("link", { name: "Subscribe free" }),
  ).toHaveAttribute("href", "https://whoffagents.beehiiv.com/subscribe");
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await page
    .getByRole("searchbox", { name: "Search tools" })
    .fill("zzzz no match");
  await expect(page.getByText("No tools match that search.")).toBeVisible();
  await page.getByRole("button", { name: "Show all tools" }).click();
  await page.getByRole("button", { name: "Starter kits", exact: true }).click();
  await expect(page.locator(".st-tool-card")).toHaveCount(1);
  await expect(page.locator(".st-tool-card")).toContainText("AI SaaS");
});
test("all existing routes, titles and download stay available without JS errors", async ({
  page,
  request,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const [route, meta] of Object.entries(routeMeta)) {
    await page.goto(route);
    await expect(page).toHaveTitle(meta.title);
    await expect(page.locator("#main-content")).not.toBeEmpty();
  }
  await page.goto("/free-skill");
  const download = page.locator("a[download]").first();
  if (await download.count())
    expect((await request.get(await download.getAttribute("href"))).ok()).toBe(
      true,
    );
  expect(errors).toEqual([]);
});
