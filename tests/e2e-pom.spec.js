import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';

// --- DATA-DRIVEN TESTING (DDT) ---
const testData = [
  {
    testName: 'Standard User Checkout Flow',
    user: 'standard_user',
    password: 'secret_sauce',
    products: ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'],
    firstName: 'Test',
    lastName: 'User',
    zipCode: '12345'
  }
];

test.describe('E2E Flow with Multiple Products using POM', () => {
  let login, inventory, cart, checkout;

  // --- HOOKS ---
  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    inventory = new InventoryPage(page);
    cart = new CartPage(page);
    checkout = new CheckoutPage(page);
    
    await login.goto();
  });

  for (const data of testData) {
    test(`E2E flow for ${data.testName}`, async ({ page }) => {
      // 1. Login
      await login.login(data.user, data.password);
      
      // REAL ASSERTION COVERAGE
      await expect(page).toHaveURL(/inventory/, { timeout: 10000 });
      await expect(inventory.cartIcon).toBeVisible();

      // 2. MULTIPLE PRODUCT FLOW
      for (const product of data.products) {
        await inventory.addProductByName(product);
      }
      
      // Real Assertion: Verify cart count matches total products added
      const cartCount = await inventory.verifyCartCount();
      await expect(cartCount).toHaveText(data.products.length.toString());

      // 3. Checkout Flow
      await inventory.openCart();
      await expect(page).toHaveURL(/cart/);

      await cart.checkout();
      await expect(page).toHaveURL(/checkout-step-one/);

      await checkout.fillDetails(data.firstName, data.lastName, data.zipCode);
      await checkout.finish();

      // Real Assertion: Verify successful checkout
      await expect(page).toHaveURL(/checkout-complete/);
      await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    });
  }
});