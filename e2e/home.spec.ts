import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("has correct page title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Juniper Ridge/i);
  });

  test("main navigation links are visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /about/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /contact/i }).first()).toBeVisible();
  });

  test("hero section renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("section").first()).toBeVisible();
  });

  test("/about page loads", async ({ page }) => {
    await page.goto("/about");
    await expect(page).toHaveTitle(/about/i);
  });

  test("/contact page loads", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveTitle(/contact/i);
  });

  test("/blog page loads", async ({ page }) => {
    await page.goto("/blog");
    await expect(page).toHaveTitle(/blog/i);
  });
});

test.describe("Admin auth", () => {
  test("unauthenticated visit to /admin redirects to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("login page renders email and password fields", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator('[id="email"]')).toBeVisible();
    await expect(page.locator('[id="password"]')).toBeVisible();
  });
});
