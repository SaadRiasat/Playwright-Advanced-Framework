export class CartPage {
  constructor(page) {
    this.page = page;
    this.checkoutBtn = page.locator('#checkout');
  }

  async checkout() {
    await this.checkoutBtn.click();
  }
}