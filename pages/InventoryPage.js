/**
 * InventoryPage.js
 * Page Object Model for the SauceDemo inventory/products page.
 * URL: https://www.saucedemo.com/inventory.html
 */
export class InventoryPage {
  constructor(page) {
    this.page = page;

    // --- Locators ---
    this.productsTitle  = page.locator('.title');
    this.cartIcon       = page.locator('.shopping_cart_link');
    this.cartBadge      = page.locator('.shopping_cart_badge');
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown   = page.locator('[data-test="product-sort-container"]');

    // First item add-to-cart button (kept for backwards compatibility)
    this.addToCartBtn = page.locator('.inventory_item button').first();
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // Sorting
  // ---------------------------------------------------------------------------

  /** Sort by Name (A → Z) */
  async sortByNameAZ() {
    await this.sortDropdown.selectOption('az');
  }

  /** Sort by Name (Z → A) */
  async sortByNameZA() {
    await this.sortDropdown.selectOption('za');
  }

  /** Sort by Price (low → high) */
  async sortByPriceLowHigh() {
    await this.sortDropdown.selectOption('lohi');
  }

  /** Sort by Price (high → low) */
  async sortByPriceHighLow() {
    await this.sortDropdown.selectOption('hilo');
  }

  // ---------------------------------------------------------------------------
  // Product data getters
  // ---------------------------------------------------------------------------

  /** Returns an array of product name strings in current display order */
  async getProductNames() {
    return await this.page
      .locator('.inventory_item_name')
      .allTextContents();
  }

  /**
   * Returns an array of product prices as floats in current display order.
   * Example: [7.99, 9.99, 15.99, …]
   */
  async getProductPrices() {
    const rawPrices = await this.page
      .locator('.inventory_item_price')
      .allTextContents();
    // Strip the leading '$' and parse as float
    return rawPrices.map((p) => parseFloat(p.replace('$', '')));
  }

  /**
   * Returns an array of product image src attribute values.
   * Used to detect broken/replaced images (problem_user, visual_user).
   */
  async getProductImageSources() {
    const images = this.page.locator('.inventory_item_img img');
    const count = await images.count();
    const sources = [];
    for (let i = 0; i < count; i++) {
      const src = await images.nth(i).getAttribute('src');
      sources.push(src);
    }
    return sources;
  }

  /** Returns the number of inventory items on the page */
  async getProductCount() {
    return await this.inventoryItems.count();
  }

  // ---------------------------------------------------------------------------
  // Cart actions
  // ---------------------------------------------------------------------------

  /**
   * Add a product to the cart by its exact display name.
   * Finds the inventory item card that contains the given name,
   * then clicks its "Add to cart" button.
   */
  async addProductByName(name) {
    await this.inventoryItems
      .filter({ hasText: name })
      .locator('button')
      .click();
  }

  /**
   * Remove a product from the inventory card by its display name.
   * Clicks the "Remove" button on the matching item card.
   */
  async removeProductByName(name) {
    await this.inventoryItems
      .filter({ hasText: name })
      .locator('button')
      .click();
  }

  /** Click the first Add to Cart button (backwards-compatible helper) */
  async addProduct() {
    await this.addToCartBtn.click();
  }

  // ---------------------------------------------------------------------------
  // Cart icon / badge
  // ---------------------------------------------------------------------------

  /** Open the cart page */
  async openCart() {
    await this.cartIcon.click();
  }

  /**
   * Returns the cart badge locator.
   * Use with expect(...).toHaveText() for assertions.
   */
  async verifyCartCount() {
    return this.cartBadge;
  }

  /** Returns the cart item count as an integer (0 if badge not visible) */
  async getCartCount() {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    const text = await this.cartBadge.textContent();
    return parseInt(text, 10);
  }

  // ---------------------------------------------------------------------------
  // Item prices (backwards-compatible)
  // ---------------------------------------------------------------------------
  async getItemPrices() {
    return await this.page
      .locator('.inventory_item_price')
      .allTextContents();
  }
}