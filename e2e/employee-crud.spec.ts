import { test, expect } from '@playwright/test';

test.describe('Employee Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@company.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('/');
  });

  test('should navigate to employees page', async ({ page }) => {
    await page.goto('/employees');
    await page.waitForLoadState('networkidle');
    // Check if employees page loads
    await expect(page).toHaveURL(/\/employees/);
  });
});
