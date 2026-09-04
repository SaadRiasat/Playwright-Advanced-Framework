/**
 * multiUserTesting.spec.js
 * User-specific behavior testing across all 6 SauceDemo user types.
 *
 * Each test is explicitly named with the username so the HTML report
 * clearly identifies which user is under test.
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { NavigationPage } from '../pages/NavigationPage.js';
import { userProfiles, sampleOrderData } from '../utils/userData.js';

// ---------------------------------------------------------------------------
// Shared setup
// ---------------------------------------------------------------------------
test.describe('Multi-User Data-Driven Testing for SauceDemo', () => {
  let login, inventory, cart, checkout, nav;

  test.beforeEach(async ({ page }) => {
    login    = new LoginPage(page);
    inventory = new InventoryPage(page);
    cart     = new CartPage(page);
    checkout = new CheckoutPage(page);
    nav      = new NavigationPage(page);

    await login.goto();
  });

  // =========================================================================
  // 1. LOCKED_OUT_USER — Expected negative test
  // =========================================================================
  const lockedUser = userProfiles.find((u) => u.username === 'locked_out_user');

  test(`[${lockedUser.username}] Login must be rejected with correct error`, async ({
    page,
  }) => {
    await login.login(lockedUser.username, lockedUser.password);

    // Assert error banner is visible
    await expect(login.errorMessage).toBeVisible();
    // Assert exact error text
    await expect(login.errorMessage).toHaveText(lockedUser.expectedErrorMessage);
    // User must remain on login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // =========================================================================
  // 2. STANDARD_USER — Full E2E checkout + logout
  // =========================================================================
  const standardUser = userProfiles.find((u) => u.username === 'standard_user');

  test(`[${standardUser.username}] Full E2E Checkout Flow and Logout`, async ({
    page,
  }) => {
    await login.login(standardUser.username, standardUser.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventory.productsTitle).toHaveText('Products');

    // Add items
    for (const product of sampleOrderData.products) {
      await inventory.addProductByName(product);
    }
    const cartBadge = await inventory.verifyCartCount();
    await expect(cartBadge).toHaveText(
      sampleOrderData.products.length.toString()
    );

    // Cart and checkout
    await inventory.openCart();
    const cartNames = await cart.getCartItemNames();
    for (const product of sampleOrderData.products) {
      expect(cartNames).toContain(product);
    }

    await cart.checkout();
    await checkout.fillDetails(
      sampleOrderData.firstName,
      sampleOrderData.lastName,
      sampleOrderData.zipCode
    );
    await checkout.finish();

    // Verify order completion
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.locator('.complete-header')).toHaveText(
      'Thank you for your order!'
    );

    // Logout
    await nav.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(login.loginBtn).toBeVisible();
  });

  // =========================================================================
  // 3. PROBLEM_USER — Broken images + checkout anomaly (known defects)
  // =========================================================================
  const problemUser = userProfiles.find((u) => u.username === 'problem_user');

  test(`[${problemUser.username}] KNOWN DEFECT — Broken product images detected`, async ({
    page,
  }) => {
    await login.login(problemUser.username, problemUser.password);
    await expect(page).toHaveURL(/inventory\.html/);

    const imageSources = await inventory.getProductImageSources();
    // SauceDemo intentionally serves sl-404.jpg for problem_user
    const hasBrokenImage = imageSources.some((src) =>
      src.includes('sl-404')
    );
    // This assertion DOCUMENTS the known defect — it should be TRUE
    expect(hasBrokenImage).toBeTruthy();

    // Attach screenshot as evidence in the report
    await page.screenshot({ path: 'downloads/problem_user_defect.png' });
    await test.info().attach('problem_user — broken image evidence', {
      path: 'downloads/problem_user_defect.png',
      contentType: 'image/png',
    });
  });

  test(`[${problemUser.username}] KNOWN DEFECT — Cannot complete checkout (last name field broken)`, async ({
    page,
  }) => {
    await login.login(problemUser.username, problemUser.password);
    await expect(page).toHaveURL(/inventory\.html/);

    // Add a product
    await inventory.addProductByName('Sauce Labs Backpack');
    await inventory.openCart();
    await cart.checkout();

    // Try to fill checkout details
    await checkout.firstName.fill(sampleOrderData.firstName);
    // problem_user: last name field does NOT accept input
    await checkout.lastName.fill(sampleOrderData.lastName);
    await checkout.zip.fill(sampleOrderData.zipCode);
    await checkout.clickContinue();

    // problem_user cannot finish checkout — last name stays empty → error
    const currentUrl = page.url();
    const stuckOnStepOne = currentUrl.includes('checkout-step-one');
    // Document the known defect: problem_user fails to advance
    // If behavior changes, this test will alert the team
    test.info().annotations.push({
      type: 'Known Defect',
      description:
        'problem_user: last name field does not accept typed input, blocking checkout',
    });
    // The user should either be stuck on step-one or see an error
    // We assert at minimum that the Thank You page was NOT reached
    expect(currentUrl).not.toContain('checkout-complete');
  });

  // =========================================================================
  // 4. PERFORMANCE_GLITCH_USER — Login and navigation with timing check
  // =========================================================================
  const perfUser = userProfiles.find(
    (u) => u.username === 'performance_glitch_user'
  );

  test(`[${perfUser.username}] Login and Inventory load successfully (with glitch tolerance)`, async ({
    page,
  }) => {
    test.setTimeout(30000); // Wider timeout for performance glitch

    const startTime = Date.now();
    await login.login(perfUser.username, perfUser.password);

    // Wait up to 15s for inventory — performance_glitch_user intentionally lags
    await expect(page).toHaveURL(/inventory\.html/, { timeout: 15000 });
    const duration = Date.now() - startTime;

    // The login intentionally takes longer — document it
    console.log(
      `[${perfUser.username}] Login duration: ${duration}ms`
    );
    expect(duration).toBeGreaterThan(0);

    // Verify page loads correctly despite the glitch
    await expect(inventory.cartIcon).toBeVisible();
    await expect(inventory.productsTitle).toHaveText('Products');
  });

  test(`[${perfUser.username}] Full checkout completes successfully`, async ({
    page,
  }) => {
    test.setTimeout(60000);

    await login.login(perfUser.username, perfUser.password);
    await expect(page).toHaveURL(/inventory\.html/, { timeout: 15000 });

    await inventory.addProductByName('Sauce Labs Backpack');
    await inventory.openCart();
    await cart.checkout();
    await checkout.fillDetails(
      sampleOrderData.firstName,
      sampleOrderData.lastName,
      sampleOrderData.zipCode
    );
    await checkout.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/, {
      timeout: 15000,
    });
    await expect(page.locator('.complete-header')).toHaveText(
      'Thank you for your order!'
    );
  });

  // =========================================================================
  // 5. ERROR_USER — Checkout behavior anomaly (known defect)
  // =========================================================================
  const errorUser = userProfiles.find((u) => u.username === 'error_user');

  test(`[${errorUser.username}] KNOWN DEFECT — Cannot complete checkout`, async ({
    page,
  }) => {
    await login.login(errorUser.username, errorUser.password);
    await expect(page).toHaveURL(/inventory\.html/);

    await inventory.addProductByName('Sauce Labs Backpack');
    await inventory.openCart();
    await cart.checkout();
    await checkout.fillDetails(
      sampleOrderData.firstName,
      sampleOrderData.lastName,
      sampleOrderData.zipCode
    );
    await checkout.finish();

    const currentUrl = page.url();

    // Document the known defect: error_user fails to reach checkout-complete
    test.info().annotations.push({
      type: 'Known Defect',
      description:
        'error_user: SauceDemo intentionally prevents this user from completing checkout',
    });

    // Assert the known defect: user did NOT reach the completion page
    expect(currentUrl, 'error_user should NOT reach checkout-complete').not.toContain(
      'checkout-complete'
    );
  });

  // =========================================================================
  // 6. VISUAL_USER — UI and image inspection
  // =========================================================================
  const visualUser = userProfiles.find((u) => u.username === 'visual_user');

  test(`[${visualUser.username}] Visual inspection — cart icon and images present`, async ({
    page,
  }) => {
    await login.login(visualUser.username, visualUser.password);
    await expect(page).toHaveURL(/inventory\.html/);

    // Cart icon must be visible
    await expect(inventory.cartIcon).toBeVisible();

    // All image sources should be populated
    const imageSources = await inventory.getProductImageSources();
    expect(imageSources.length).toBeGreaterThan(0);
    for (const src of imageSources) {
      expect(src).toBeTruthy();
    }

    // Take screenshot as visual evidence
    await page.screenshot({ path: 'downloads/visual_user_evidence.png' });
    await test.info().attach('visual_user — inventory screenshot', {
      path: 'downloads/visual_user_evidence.png',
      contentType: 'image/png',
    });
  });

  test(`[${visualUser.username}] Full checkout completes successfully`, async ({
    page,
  }) => {
    await login.login(visualUser.username, visualUser.password);
    await expect(page).toHaveURL(/inventory\.html/);

    await inventory.addProductByName('Sauce Labs Backpack');
    await inventory.openCart();
    await cart.checkout();
    await checkout.fillDetails(
      sampleOrderData.firstName,
      sampleOrderData.lastName,
      sampleOrderData.zipCode
    );
    await checkout.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.locator('.complete-header')).toHaveText(
      'Thank you for your order!'
    );
  });
});
