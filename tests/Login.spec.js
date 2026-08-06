import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';

test('Locked User', async ({ page }) => {
  const login = new LoginPage(page);

  await login.goto();
  await login.login('locked_out_user', 'secret_sauce');

  await expect(page.locator('[data-test="error"]')).toBeVisible();
});