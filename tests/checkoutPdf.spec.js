/**
 * checkoutPdf.spec.js
 * Complete E2E test including PDF download and content validation.
 *
 * Flow:
 *   Login → Add Product → Cart → Checkout → Fill Details →
 *   Finish → Thank You Page → Download PDF → Parse PDF → Validate Content →
 *   Attach PDF to Report
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { ThankYouPage } from '../pages/ThankYouPage.js';
import { NavigationPage } from '../pages/NavigationPage.js';
import { parsePdf } from '../utils/pdfHelper.js';
import { checkoutData } from '../utils/userData.js';

test.describe('PDF Generation and Validation', () => {
  test('[standard_user] Download and validate PDF order receipt @smoke', async ({
    page,
  }) => {
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
    await login.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    // -------------------------------------------------------------------
    // STEP 2 — Add product
    // -------------------------------------------------------------------
    await inventory.addProductByName('Sauce Labs Backpack');

    // -------------------------------------------------------------------
    // STEP 3 — Cart → Checkout
    // -------------------------------------------------------------------
    await inventory.openCart();
    await expect(page).toHaveURL(/cart\.html/);
    await cart.checkout();

    // -------------------------------------------------------------------
    // STEP 4 — Fill checkout details
    // -------------------------------------------------------------------
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await checkout.fillDetails(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.zipCode
    );
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // -------------------------------------------------------------------
    // STEP 5 — Finish order
    // -------------------------------------------------------------------
    await checkout.finish();

    // -------------------------------------------------------------------
    // STEP 6 — Verify Thank You page
    // -------------------------------------------------------------------
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(thankYou.confirmationHeader).toHaveText(
      'Thank you for your order!'
    );
    await expect(thankYou.generatePdfBtn).toBeVisible();
    await expect(thankYou.generatePdfBtn).toBeEnabled();

    // -------------------------------------------------------------------
    // STEP 7 — Download PDF
    // -------------------------------------------------------------------
    const pdfPath = await thankYou.downloadPdf();
    console.log(`PDF downloaded to: ${pdfPath}`);

    // -------------------------------------------------------------------
    // STEP 8 — Parse and validate PDF content
    // -------------------------------------------------------------------
    const pdfText = await parsePdf(pdfPath);
    console.log('PDF text excerpt:', pdfText.substring(0, 500));

    // Brand / header
    expect(pdfText).toContain('Swag Labs');
    expect(pdfText).toContain('Order Receipt');

    // Customer information
    expect(pdfText).toContain(checkoutData.firstName);
    expect(pdfText).toContain(checkoutData.lastName);
    expect(pdfText).toContain(checkoutData.zipCode);

    // Product
    expect(pdfText).toContain('Sauce Labs Backpack');

    // Pricing — verified against real PDFs from downloads/
    expect(pdfText).toContain('$29.99');   // item price
    expect(pdfText).toContain('$32.39');   // grand total (29.99 + 2.40 tax)
    expect(pdfText).toContain('Thank you for your order!');

    // -------------------------------------------------------------------
    // STEP 9 — Attach PDF to Playwright HTML report
    // -------------------------------------------------------------------
    await test.info().attach('Order PDF Receipt', {
      path: pdfPath,
      contentType: 'application/pdf',
    });

    // -------------------------------------------------------------------
    // STEP 10 — Logout
    // -------------------------------------------------------------------
    await nav.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(login.loginBtn).toBeVisible();
  });
});