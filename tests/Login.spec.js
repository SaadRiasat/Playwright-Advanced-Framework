/**
 * Login.spec.js
 * Covers:
 *  - Dynamic login test for all 6 SauceDemo users (loop-driven)
 *  - locked_out_user → EXPECTED NEGATIVE TEST (PASS when error appears)
 *  - Invalid credential scenarios (wrong username, wrong password, empty fields)
 *  - Includes test.step() and Allure screenshot attachments
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import {
  userProfiles,
  invalidLoginScenarios,
} from '../utils/userData.js';

// =============================================================================
// SECTION 1 — All SauceDemo users (dynamic loop)
// =============================================================================
test.describe('Login — All SauceDemo Users', () => {
  for (const user of userProfiles) {
    test(`[${user.username}] Login test${user.username === 'standard_user' ? ' @smoke' : ''}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      await test.step('Open SauceDemo login page', async () => {
        await loginPage.goto();
        await loginPage.attachScreenshot(`01 - [${user.username}] Login page opened`);
      });

      await test.step(`Enter credentials for ${user.username} and submit`, async () => {
        await loginPage.login(user.username, user.password);
        await loginPage.attachScreenshot(`02 - [${user.username}] Submitted credentials`);
      });

      if (!user.shouldLogin) {
        await test.step('Verify locked out error message and URL', async () => {
          await expect(loginPage.errorMessage).toBeVisible();
          await expect(loginPage.errorMessage).toHaveText(
            user.expectedErrorMessage
          );
          await expect(page).toHaveURL('https://www.saucedemo.com/');
          await loginPage.attachScreenshot(`03 - [${user.username}] Error message displayed`);
        });
      } else {
        await test.step('Verify successful navigation to inventory page', async () => {
          await expect(page).toHaveURL(/inventory\.html/, {
            timeout: 15000,
          });
          const inventoryTitle = page.locator('.title');
          await expect(inventoryTitle).toBeVisible();
          await expect(inventoryTitle).toHaveText('Products');
          await loginPage.attachScreenshot(`03 - [${user.username}] Products inventory displayed`);
        });
      }
    });
  }
});

// =============================================================================
// SECTION 2 — Invalid credential scenarios
// =============================================================================
test.describe('Login — Invalid Credentials', () => {
  for (const scenario of invalidLoginScenarios) {
    test(`[${scenario.label}] — should show error message`, async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      await test.step('Open SauceDemo login page', async () => {
        await loginPage.goto();
      });

      await test.step(`Enter credentials for ${scenario.label}`, async () => {
        await loginPage.login(scenario.username, scenario.password);
      });

      await test.step('Verify error banner is displayed with correct text', async () => {
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(scenario.expectedError);
        await expect(page).toHaveURL('https://www.saucedemo.com/');
        await loginPage.attachScreenshot(`Error - [${scenario.label}]`);
      });
    });
  }
});