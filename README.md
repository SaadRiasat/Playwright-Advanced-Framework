# Playwright Advanced E2E Automation Framework 🚀

This repository contains a professional, robust test automation framework built with **Playwright** and **JavaScript**. It is designed to handle complex, real-world E2E (End-to-End) e-commerce scenarios using industry best practices.

## 🌟 Key Features Implemented

- **Page Object Model (POM):** Clean separation of test logic and page interactions for high maintainability.
- **Data-Driven Testing (DDT):** Test data is decoupled using arrays, allowing tests to iterate dynamically over multiple users and product combinations.
- **Advanced PDF Validation:** Automates the interception of browser downloads and programmatically parses/validates the contents of raw PDF receipts using `pdf-parse`.
- **Dynamic Multi-Product Flows:** Capable of handling real-world scenarios where multiple items are added to a cart dynamically based on test data.
- **Robust Assertions:** Implementation of strict UI visibility checks, dynamic array-length assertions for cart counters, and strict URL endpoint verifications.
- **Professional Hook Structure:** Setup and teardown states are abstracted into `test.beforeEach()` hooks.
- **Automated Reporting:** Generates rich, interactive HTML reports automatically after test execution.

## 🛠️ Technology Stack
- **Automation Tool:** Playwright
- **Language:** JavaScript (ES6+)
- **PDF Parser:** `pdf-parse`

## 🚀 How to Run

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run All Tests (Headless):**
   ```bash
   npx playwright test
   ```

3. **Run Tests with UI Mode (Time-Travel Debugging):**
   ```bash
   npx playwright test --ui
   ```

4. **View HTML Report:**
   ```bash
   npx playwright show-report
   ```
