/**
 * NavigationPage.js
 * Page Object Model for SauceDemo burger menu / navigation.
 * Available on any authenticated page.
 */
export class NavigationPage {
  constructor(page) {
    this.page = page;

    // --- Locators ---
    this.burgerMenuBtn  = page.locator('#react-burger-menu-btn');
    this.logoutLink     = page.locator('#logout_sidebar_link');
    this.resetLink      = page.locator('#reset_sidebar_link');
    this.allItemsLink   = page.locator('#inventory_sidebar_link');
    this.aboutLink      = page.locator('#about_sidebar_link');
    this.closeMenuBtn   = page.locator('#react-burger-cross-btn');
  }

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  /** Open the burger menu */
  async openMenu() {
    await this.burgerMenuBtn.click();
  }

  /** Close the burger menu */
  async closeMenu() {
    await this.closeMenuBtn.click();
  }

  /**
   * Log out of the application.
   * Opens the burger menu and clicks Logout.
   * After calling this, the user is on the login page.
   */
  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }

  /**
   * Reset the application state (clears cart, resets product state).
   * Useful for test teardown without navigating away.
   */
  async resetAppState() {
    await this.openMenu();
    await this.resetLink.click();
    await this.closeMenu();
  }

  /** Navigate to All Items (inventory) via the menu */
  async goToAllItems() {
    await this.openMenu();
    await this.allItemsLink.click();
  }
}
