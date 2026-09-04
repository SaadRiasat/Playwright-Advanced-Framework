/**
 * cart.spec.js
 * Covers:
 *  - Add one product → verify cart badge = 1 → open cart → verify product
 *  - Add multiple products → verify badge count
 *  - Remove product from cart → badge updates
 *  - Continue shopping navigation
 *  - Empty cart behavior
 *  - Checkout button presence
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';

// Helper: log in as standard_user and navigate to inventory
async function loginAsStandard(page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory\.html/);
  return new InventoryPage(page);
}

// =============================================================================
// SECTION 1 — Add to Cart
// =============================================================================
test.describe('Cart — Add to Cart', () => {
  test('Add one product — cart badge shows 1 @smoke', async ({ page }) => {
    const inventory = await loginAsStandard(page);

    await inventory.addProductByName('Sauce Labs Backpack');

    const badge = await inventory.verifyCartCount();
    await expect(badge).toHaveText('1');
  });

  test('Add multiple products — cart badge reflects correct count', async ({
    page,
  }) => {
    const inventory = await loginAsStandard(page);
    const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

    for (const product of products) {
      await inventory.addProductByName(product);
    }

    const badge = await inventory.verifyCartCount();
    await expect(badge).toHaveText(products.length.toString());
  });

  test('Add all 6 products — cart badge shows 6', async ({ page }) => {
    const inventory = await loginAsStandard(page);
    const products = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
    ];

    for (const product of products) {
      await inventory.addProductByName(product);
    }

    const badge = await inventory.verifyCartCount();
    await expect(badge).toHaveText('6');
  });
});

// =============================================================================
// SECTION 2 — Cart page validation
// =============================================================================
test.describe('Cart — Cart Page Validation', () => {
  test('Cart opens and correct product is displayed', async ({ page }) => {
    const inventory = await loginAsStandard(page);
    await inventory.addProductByName('Sauce Labs Backpack');
    await inventory.openCart();

    await expect(page).toHaveURL(/cart\.html/);

    const cart = new CartPage(page);
    const names = await cart.getCartItemNames();
    expect(names).toContain('Sauce Labs Backpack');
  });

  test('Cart shows correct price for added product', async ({ page }) => {
    const inventory = await loginAsStandard(page);
    await inventory.addProductByName('Sauce Labs Backpack');
    await inventory.openCart();

    const cart = new CartPage(page);
    const prices = await cart.getCartItemPrices();
    expect(prices).toContain('$29.99');
  });

  test('Cart item count in cart page matches items added', async ({ page }) => {
    const inventory = await loginAsStandard(page);
    const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
    for (const product of products) {
      await inventory.addProductByName(product);
    }
    await inventory.openCart();

    const cart = new CartPage(page);
    const count = await cart.getCartItemCount();
    expect(count).toBe(2);
  });

  test('Checkout button is visible in cart', async ({ page }) => {
    const inventory = await loginAsStandard(page);
    await inventory.addProductByName('Sauce Labs Backpack');
    await inventory.openCart();

    const cart = new CartPage(page);
    await expect(cart.checkoutBtn).toBeVisible();
  });
});

// =============================================================================
// SECTION 3 — Remove from cart
// =============================================================================
test.describe('Cart — Remove Item', () => {
  test('Remove item from cart — badge updates', async ({ page }) => {
    const inventory = await loginAsStandard(page);
    await inventory.addProductByName('Sauce Labs Backpack');
    await inventory.addProductByName('Sauce Labs Bike Light');
    await inventory.openCart();

    const cart = new CartPage(page);
    await cart.removeItemByName('Sauce Labs Backpack');

    // Cart badge should now show 1
    const badgeCount = await cart.getCartBadgeCount();
    expect(badgeCount).toBe(1);

    // Removed item should not appear in cart
    const names = await cart.getCartItemNames();
    expect(names).not.toContain('Sauce Labs Backpack');
    expect(names).toContain('Sauce Labs Bike Light');
  });

  test('Remove all items — cart badge disappears', async ({ page }) => {
    const inventory = await loginAsStandard(page);
    await inventory.addProductByName('Sauce Labs Backpack');
    await inventory.openCart();

    const cart = new CartPage(page);
    await cart.removeItemByName('Sauce Labs Backpack');

    // Badge should be gone when cart is empty
    await expect(cart.cartBadge).not.toBeVisible();
  });
});

// =============================================================================
// SECTION 4 — Continue Shopping
// =============================================================================
test.describe('Cart — Continue Shopping', () => {
  test('Continue Shopping button returns user to inventory', async ({
    page,
  }) => {
    const inventory = await loginAsStandard(page);
    await inventory.addProductByName('Sauce Labs Backpack');
    await inventory.openCart();

    await expect(page).toHaveURL(/cart\.html/);

    const cart = new CartPage(page);
    await cart.continueShopping();

    await expect(page).toHaveURL(/inventory\.html/);
  });
});
