import { test, expect } from "@playwright/test";

test("affiche le titre du site", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Joy & Union/i);
});
