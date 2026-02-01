import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('should display dashboard page after login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@company.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
    // Dashboard should be visible after login
    await expect(page.locator('main')).toBeVisible();
  });
});
