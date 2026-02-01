import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@company.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });
});
