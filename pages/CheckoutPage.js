/**
 * CheckoutPage.js
 * Page Object Model for SauceDemo checkout pages.
 * Step One URL : https://www.saucedemo.com/checkout-step-one.html
 * Step Two URL : https://www.saucedemo.com/checkout-step-two.html
 */
export class CheckoutPage {
  constructor(page) {
    this.page = page;

    // --- Step One locators ---
    this.firstName   = page.locator('#first-name');
    this.lastName    = page.locator('#last-name');
    this.zip         = page.locator('#postal-code');
    this.continueBtn = page.locator('#continue');
    this.cancelBtn   = page.locator('#cancel');
    this.errorMessage = page.locator('[data-test="error"]');

    // --- Step Two (Overview) locators ---
    this.finishBtn        = page.locator('#finish');
    this.overviewItems    = page.locator('.cart_item');
    this.itemTotal        = page.locator('.summary_subtotal_label');
    this.taxLabel         = page.locator('.summary_tax_label');
    this.totalLabel       = page.locator('.summary_total_label');
    this.overviewItemNames  = page.locator('.inventory_item_name');
    this.overviewItemPrices = page.locator('.inventory_item_price');
  }

  // ---------------------------------------------------------------------------
  // Step One Actions
  // ---------------------------------------------------------------------------

  /**
   * Fill all checkout fields and click Continue.
   * @param {string} fname - First name
   * @param {string} lname - Last name
   * @param {string} zip   - Postal code
   */
  async fillDetails(fname, lname, zip) {
    await this.firstName.fill(fname);
    await this.lastName.fill(lname);
    await this.zip.fill(zip);
    await this.continueBtn.click();
  }

  /** Click Continue without filling any fields (for negative tests) */
  async clickContinue() {
    await this.continueBtn.click();
  }

  /** Click Cancel */
  async cancel() {
    await this.cancelBtn.click();
  }

  // ---------------------------------------------------------------------------
  // Step Two Actions
  // ---------------------------------------------------------------------------

  /** Click Finish to place the order */
  async finish() {
    await this.finishBtn.click();
  }

  // ---------------------------------------------------------------------------
  // Getters
  // ---------------------------------------------------------------------------

  /** Returns the error banner text content */
  async getError() {
    return await this.errorMessage.textContent();
  }

  /** Returns item total text (e.g. "Item total: $29.99") */
  async getItemTotal() {
    return await this.itemTotal.textContent();
  }

  /** Returns tax label text (e.g. "Tax: $2.40") */
  async getTax() {
    return await this.taxLabel.textContent();
  }

  /** Returns total label text (e.g. "Total: $32.39") */
  async getTotal() {
    return await this.totalLabel.textContent();
  }

  /** Returns array of item names in the overview */
  async getOverviewItemNames() {
    return await this.overviewItemNames.allTextContents();
  }
}