/**
 * CartPage.js
 * Page Object Model for the SauceDemo cart page.
 * URL: https://www.saucedemo.com/cart.html
 */
export class CartPage {
  constructor(page) {
    this.page = page;

    // --- Locators ---
    this.checkoutBtn       = page.locator('#checkout');
    this.continueShoppingBtn = page.locator('#continue-shopping');
    this.cartItems         = page.locator('.cart_item');
    this.cartItemNames     = page.locator('.inventory_item_name');
    this.cartItemPrices    = page.locator('.inventory_item_price');
    this.cartItemQuantities = page.locator('.cart_quantity');
    this.cartBadge         = page.locator('.shopping_cart_badge');
  }

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  /** Proceed to checkout */
  async checkout() {
    await this.checkoutBtn.click();
  }

  /** Navigate back to the inventory page */
  async continueShopping() {
    await this.continueShoppingBtn.click();
  }

  /**
   * Remove an item from the cart by its display name.
   * Finds the cart row that contains the name and clicks its Remove button.
   */
  async removeItemByName(name) {
    await this.cartItems
      .filter({ hasText: name })
      .locator('button')
      .click();
  }

  // ---------------------------------------------------------------------------
  // Getters
  // ---------------------------------------------------------------------------

  /** Returns an array of cart item name strings */
  async getCartItemNames() {
    return await this.cartItemNames.allTextContents();
  }

  /** Returns an array of cart item price strings (e.g. ["$29.99", "$9.99"]) */
  async getCartItemPrices() {
    return await this.cartItemPrices.allTextContents();
  }

  /** Returns the number of line items in the cart */
  async getCartItemCount() {
    return await this.cartItems.count();
  }

  /**
   * Returns the cart badge count as an integer.
   * Returns 0 when the badge is not visible (empty cart).
   */
  async getCartBadgeCount() {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    const text = await this.cartBadge.textContent();
    return parseInt(text, 10);
  }
}