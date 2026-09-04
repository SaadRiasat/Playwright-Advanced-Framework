/**
 * ThankYouPage.js
 * Page Object Model for the SauceDemo order completion page.
 * URL: https://www.saucedemo.com/checkout-complete.html
 */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export class ThankYouPage {
  constructor(page) {
    this.page = page;

    // --- Locators ---
    this.confirmationHeader = page.locator('.complete-header');
    this.confirmationText   = page.locator('.complete-text');
    this.backHomeBtn        = page.locator('#back-to-products');
    this.generatePdfBtn     = page.getByRole('button', {
      name: /generate pdf order/i,
    });
    this.ponyExpressImage   = page.locator('.pony_express');
  }

  // ---------------------------------------------------------------------------
  // Getters
  // ---------------------------------------------------------------------------

  /** Returns the text of the completion header (e.g. "Thank you for your order!") */
  async getText() {
    return await this.confirmationHeader.textContent();
  }

  /** Returns the sub-text below the header */
  async getCompleteText() {
    return await this.confirmationText.textContent();
  }

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  /** Click Back Home / Back to Products */
  async goBackHome() {
    await this.backHomeBtn.click();
  }

  /**
   * Download the PDF order receipt.
   *
   * Waits for the browser download event, saves the file to the
   * project-level downloads/ directory (absolute path for CI safety),
   * and returns the absolute file path.
   *
   * @returns {Promise<string>} - Absolute path to the saved PDF file
   */
  async downloadPdf() {
    // Resolve an absolute path from the project root
    const downloadsDir = path.resolve(__dirname, '..', 'downloads');

    const downloadPromise = this.page.waitForEvent('download');
    await this.generatePdfBtn.click();
    const download = await downloadPromise;

    const filePath = path.join(downloadsDir, download.suggestedFilename());
    await download.saveAs(filePath);
    return filePath;
  }
}