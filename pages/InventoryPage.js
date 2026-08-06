export class InventoryPage {
  constructor(page) {
    this.page = page;

    this.addToCartBtn = page.locator('.inventory_item button').first();
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async addProductByName(name) {
  await this.page.locator('.inventory_item')
    .filter({ hasText: name })
    .locator('button')
    .click();
}

  async addProduct() {
    await this.addToCartBtn.click();
  }

  async openCart() {
    await this.cartIcon.click();
  }

  async verifyCartCount() {
    return this.cartBadge;
  }
}