/**
 * checkout.spec.js
 * Covers:
 *  - Negative: empty first name, last name, postal code, all empty
 *  - Positive: valid checkout data → order overview → price/tax/total verification
 *  - Order overview: verify product name, item total, tax, grand total
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { checkoutData } from '../utils/userData.js';

// ---------------------------------------------------------------------------
// Shared setup helper: login → add backpack → open cart → proceed to checkout
// ---------------------------------------------------------------------------
async function reachCheckoutStepOne(page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory\.html/);

  const inventory = new InventoryPage(page);
  await inventory.addProductByName('Sauce Labs Backpack');
  await inventory.openCart();

  await expect(page).toHaveURL(/cart\.html/);

  const cart = new CartPage(page);
  await cart.checkout();

  await expect(page).toHaveURL(/checkout-step-one\.html/);
  return new CheckoutPage(page);
}

// =============================================================================
// SECTION 1 — Negative Checkout Validation
// =============================================================================
test.describe('Checkout — Negative / Validation Tests', () => {
  test('Empty first name — shows error: First Name is required', async ({
    page,
  }) => {
    const checkout = await reachCheckoutStepOne(page);
    // Leave first name blank; fill others
    await checkout.lastName.fill(checkoutData.lastName);
    await checkout.zip.fill(checkoutData.zipCode);
    await checkout.clickContinue();

    await expect(checkout.errorMessage).toBeVisible();
    await expect(checkout.errorMessage).toHaveText(
      'Error: First Name is required'
    );
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('Empty last name — shows error: Last Name is required', async ({
    page,
  }) => {
    const checkout = await reachCheckoutStepOne(page);
    await checkout.firstName.fill(checkoutData.firstName);
    // Leave last name blank
    await checkout.zip.fill(checkoutData.zipCode);
    await checkout.clickContinue();

    await expect(checkout.errorMessage).toBeVisible();
    await expect(checkout.errorMessage).toHaveText(
      'Error: Last Name is required'
    );
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('Empty postal code — shows error: Postal Code is required', async ({
    page,
  }) => {
    const checkout = await reachCheckoutStepOne(page);
    await checkout.firstName.fill(checkoutData.firstName);
    await checkout.lastName.fill(checkoutData.lastName);
    // Leave postal code blank
    await checkout.clickContinue();

    await expect(checkout.errorMessage).toBeVisible();
    await expect(checkout.errorMessage).toHaveText(
      'Error: Postal Code is required'
    );
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('All fields empty — shows error: First Name is required', async ({
    page,
  }) => {
    const checkout = await reachCheckoutStepOne(page);
    await checkout.clickContinue(); // submit with nothing filled

    await expect(checkout.errorMessage).toBeVisible();
    await expect(checkout.errorMessage).toHaveText(
      'Error: First Name is required'
    );
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});

// =============================================================================
// SECTION 2 — Positive Checkout
// =============================================================================
test.describe('Checkout — Positive / Valid Data', () => {
  test('Valid checkout details — proceeds to order overview', async ({
    page,
  }) => {
    const checkout = await reachCheckoutStepOne(page);
    await checkout.fillDetails(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.zipCode
    );

    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  test('Order overview — shows correct product', async ({ page }) => {
    const checkout = await reachCheckoutStepOne(page);
    await checkout.fillDetails(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.zipCode
    );

    await expect(page).toHaveURL(/checkout-step-two\.html/);

    const itemNames = await checkout.getOverviewItemNames();
    expect(itemNames).toContain('Sauce Labs Backpack');
  });

  test('Order overview — item total, tax, and grand total are displayed', async ({
    page,
  }) => {
    const checkout = await reachCheckoutStepOne(page);
    await checkout.fillDetails(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.zipCode
    );

    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Item total for Sauce Labs Backpack is $29.99
    const itemTotal = await checkout.getItemTotal();
    expect(itemTotal).toContain('29.99');

    // Tax is shown
    const tax = await checkout.getTax();
    expect(tax).toContain('Tax');

    // Grand total contains the dollar sign
    const total = await checkout.getTotal();
    expect(total).toContain('Total');
    expect(total).toContain('$');
  });

  test('Finish order — reaches Thank You page', async ({ page }) => {
    const checkout = await reachCheckoutStepOne(page);
    await checkout.fillDetails(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.zipCode
    );
    await checkout.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.locator('.complete-header')).toHaveText(
      'Thank you for your order!'
    );
  });
});
