/**
 * e2e-pom.spec.js
 * Full End-to-End flow using Page Object Model + Data-Driven Testing.
 *
 * Flow:
 *   Login → Sort Products → Add Products → Verify Cart →
 *   Open Cart → Checkout → Fill Details → Order Overview →
 *   Finish → Thank You Page → Logout
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { ThankYouPage } from '../pages/ThankYouPage.js';
import { NavigationPage } from '../pages/NavigationPage.js';
import { sampleOrderData } from '../utils/userData.js';

// ---------------------------------------------------------------------------
// Test data (Data-Driven)
// ---------------------------------------------------------------------------
const testData = [
  {
    testName: 'Standard User — Full E2E Purchase Flow @smoke',
    user: 'standard_user',
    password: 'secret_sauce',
    products: sampleOrderData.products,
    firstName: sampleOrderData.firstName,
    lastName: sampleOrderData.lastName,
    zipCode: sampleOrderData.zipCode,
  },
];

// =============================================================================
// E2E Suite
// =============================================================================
test.describe('E2E Flow with Multiple Products using POM', () => {
  for (const data of testData) {
    test(`[${data.user}] ${data.testName}`, async ({ page }) => {
      const login    = new LoginPage(page);
      const inventory = new InventoryPage(page);
      const cart     = new CartPage(page);
      const checkout = new CheckoutPage(page);
      const thankYou = new ThankYouPage(page);
      const nav      = new NavigationPage(page);

      // -------------------------------------------------------------------
      // STEP 1 — Login
      // -------------------------------------------------------------------
      await login.goto();
      await login.login(data.user, data.password);

      await expect(page).toHaveURL(/inventory\.html/, { timeout: 15000 });
      await expect(inventory.cartIcon).toBeVisible();
      await expect(inventory.productsTitle).toHaveText('Products');

      // -------------------------------------------------------------------
      // STEP 2 — Sort and verify product list
      // -------------------------------------------------------------------
      await inventory.sortByNameAZ();
      const names = await inventory.getProductNames();
      const sorted = [...names].sort((a, b) => a.localeCompare(b));
      expect(names).toEqual(sorted);

      // -------------------------------------------------------------------
      // STEP 3 — Add multiple products dynamically
      // -------------------------------------------------------------------
      for (const product of data.products) {
        await inventory.addProductByName(product);
      }

      // Cart badge must match total products added
      const cartBadge = await inventory.verifyCartCount();
      await expect(cartBadge).toHaveText(data.products.length.toString());

      // -------------------------------------------------------------------
      // STEP 4 — Open Cart and verify products
      // -------------------------------------------------------------------
      await inventory.openCart();
      await expect(page).toHaveURL(/cart\.html/);

      const cartNames = await cart.getCartItemNames();
      for (const product of data.products) {
        expect(cartNames).toContain(product);
      }

      // -------------------------------------------------------------------
      // STEP 5 — Proceed to Checkout
      // -------------------------------------------------------------------
      await cart.checkout();
      await expect(page).toHaveURL(/checkout-step-one\.html/);

      // -------------------------------------------------------------------
      // STEP 6 — Fill checkout details
      // -------------------------------------------------------------------
      await checkout.fillDetails(data.firstName, data.lastName, data.zipCode);
      await expect(page).toHaveURL(/checkout-step-two\.html/);

      // Verify products and totals on overview
      const overviewItems = await checkout.getOverviewItemNames();
      for (const product of data.products) {
        expect(overviewItems).toContain(product);
      }

      const total = await checkout.getTotal();
      expect(total).toContain('Total');

      // -------------------------------------------------------------------
      // STEP 7 — Place Order
      // -------------------------------------------------------------------
      await checkout.finish();

      // -------------------------------------------------------------------
      // STEP 8 — Thank You page
      // -------------------------------------------------------------------
      await expect(page).toHaveURL(/checkout-complete\.html/);
      await expect(thankYou.confirmationHeader).toHaveText(
        'Thank you for your order!'
      );
      await expect(thankYou.backHomeBtn).toBeVisible();

      // -------------------------------------------------------------------
      // STEP 9 — Logout
      // -------------------------------------------------------------------
      await nav.logout();
      await expect(page).toHaveURL('https://www.saucedemo.com/');
      await expect(login.loginBtn).toBeVisible();
    });
  }
});