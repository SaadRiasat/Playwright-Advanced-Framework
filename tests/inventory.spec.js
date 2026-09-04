/**
 * inventory.spec.js
 * Covers:
 *  - Products page structure (title, items, prices, images, add-to-cart buttons)
 *  - Product sorting: A→Z, Z→A, Price Low→High, Price High→Low
 *  - Product image validation (standard_user vs problem_user vs visual_user)
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { NavigationPage } from '../pages/NavigationPage.js';

// Expected product names for assertion
const EXPECTED_PRODUCTS = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)',
];

// =============================================================================
// SECTION 1 — Inventory page structure (standard_user)
// =============================================================================
test.describe('Inventory — Page Structure (standard_user)', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('Products title is visible and correct', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await expect(inventory.productsTitle).toBeVisible();
    await expect(inventory.productsTitle).toHaveText('Products');
  });

  test('All 6 products are displayed', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const count = await inventory.getProductCount();
    expect(count).toBe(6);
  });

  test('Product names are all visible and correct', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const names = await inventory.getProductNames();
    expect(names).toHaveLength(6);
    for (const expected of EXPECTED_PRODUCTS) {
      expect(names).toContain(expected);
    }
  });

  test('Product prices are visible and numeric', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const prices = await inventory.getProductPrices();
    expect(prices).toHaveLength(6);
    for (const price of prices) {
      expect(price).toBeGreaterThan(0);
    }
  });

  test('Add to cart buttons are visible for every product', async ({
    page,
  }) => {
    const addToCartButtons = page.locator('.inventory_item button');
    const count = await addToCartButtons.count();
    expect(count).toBe(6);
    for (let i = 0; i < count; i++) {
      await expect(addToCartButtons.nth(i)).toBeVisible();
    }
  });

  test('Cart icon is visible', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await expect(inventory.cartIcon).toBeVisible();
  });

  test('Product images are loaded (non-empty src)', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const sources = await inventory.getProductImageSources();
    expect(sources).toHaveLength(6);
    for (const src of sources) {
      expect(src).toBeTruthy();
      expect(src.length).toBeGreaterThan(0);
    }
  });
});

// =============================================================================
// SECTION 2 — Product Sorting
// =============================================================================
test.describe('Inventory — Product Sorting (standard_user)', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('Sort by Name A → Z produces correctly sorted list', async ({
    page,
  }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortByNameAZ();

    const names = await inventory.getProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('Sort by Name Z → A produces reverse-sorted list', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortByNameZA();

    const names = await inventory.getProductNames();
    const reverseSorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(reverseSorted);
  });

  test('Sort by Price Low → High produces ascending price order', async ({
    page,
  }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortByPriceLowHigh();

    const prices = await inventory.getProductPrices();
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  test('Sort by Price High → Low produces descending price order', async ({
    page,
  }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortByPriceHighLow();

    const prices = await inventory.getProductPrices();
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
  });
});

// =============================================================================
// SECTION 3 — Image validation for special users
// =============================================================================
test.describe('Inventory — Product Images (user-specific)', () => {
  test('[standard_user] All product images are valid (no broken images)', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    const inventory = new InventoryPage(page);
    const sources = await inventory.getProductImageSources();

    for (const src of sources) {
      // Standard user should have proper product images, not the 404 placeholder
      expect(src).not.toContain('sl-404');
    }
  });

  test('[problem_user] KNOWN DEFECT — broken image (sl-404) is present', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('problem_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    const inventory = new InventoryPage(page);
    const sources = await inventory.getProductImageSources();

    // SauceDemo intentionally replaces images with sl-404.jpg for problem_user
    const hasBrokenImage = sources.some((src) => src.includes('sl-404'));
    expect(hasBrokenImage).toBeTruthy();

    // Attach screenshot as evidence
    await page.screenshot({ path: 'downloads/problem_user_images.png' });
    await test.info().attach('problem_user — broken images screenshot', {
      path: 'downloads/problem_user_images.png',
      contentType: 'image/png',
    });
  });

  test('[visual_user] KNOWN DEFECT — some images may be incorrect or misaligned', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('visual_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    const inventory = new InventoryPage(page);
    const sources = await inventory.getProductImageSources();

    // All images should have src values (no empty src)
    expect(sources.length).toBeGreaterThan(0);
    for (const src of sources) {
      expect(src).toBeTruthy();
    }

    // Take screenshot as visual evidence
    await page.screenshot({ path: 'downloads/visual_user_inventory.png' });
    await test.info().attach('visual_user — inventory screenshot', {
      path: 'downloads/visual_user_inventory.png',
      contentType: 'image/png',
    });
  });
});
