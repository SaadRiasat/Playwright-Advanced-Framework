/**
 * LoginPage.js
 * Page Object Model for the SauceDemo login page.
 * URL: https://www.saucedemo.com/
 */
import { test } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;

    // --- Locators ---
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginBtn = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');

    // Backwards-compatible aliases
    this.username = this.usernameInput;
    this.password = this.passwordInput;
    this.loginButton = this.loginBtn;
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  async goto() {
    await this.page.goto('/');
  }

  async gotoLoginPage() {
    await this.goto();
  }

  // ---------------------------------------------------------------------------
  // Screenshot helper for Allure / HTML report
  // ---------------------------------------------------------------------------
  async attachScreenshot(name) {
    await test.info().attach(name, {
      body: await this.page.screenshot(),
      contentType: 'image/png',
    });
  }

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  /** Fill username field */
  async enterUsername(user) {
    await this.usernameInput.fill(user);
  }

  /** Fill password field */
  async enterPassword(pass) {
    await this.passwordInput.fill(pass);
  }

  /** Click the Login button */
  async clickLogin() {
    await this.loginBtn.click();
  }

  /**
   * Complete login in one call.
   * Fills username, password, then clicks Login.
   */
  async login(user, pass) {
    await this.enterUsername(user);
    await this.enterPassword(pass);
    await this.clickLogin();
  }

  // ---------------------------------------------------------------------------
  // Assertions / Getters
  // ---------------------------------------------------------------------------

  /** Returns the text content of the error banner */
  async getError() {
    return await this.errorMessage.textContent();
  }
}

export default LoginPage;
