# Playwright Debug Mode Guide

Debugging is a critical skill for any SDET. Playwright offers multiple excellent ways to debug tests.

## 1. Using Playwright Inspector (Debug Mode)
You can run your tests in debug mode which opens the Playwright Inspector. This allows you to step through your test line-by-line, explore locators, and view network requests.

Run this command in your terminal:
```bash
npx playwright test --debug
```

## 2. Using UI Mode (Highly Recommended)
UI Mode provides a time-travel experience where you can see a DOM snapshot for every action, view network traces, console logs, and run specific tests visually.

Run this command:
```bash
npx playwright test --ui
```

## 3. Using VS Code Extension
For a professional workflow:
1. Install the **Playwright Test for VSCode** extension.
2. In the testing sidebar, you can click the "Debug Test" icon next to any of your tests.
3. You can set standard VS Code breakpoints (red dots) in your `.spec.js` files, and the test execution will pause exactly there.

## Tip: The `page.pause()` method
If you want to forcefully stop execution at a specific point in code to inspect the browser state, insert this line anywhere in your test:
```javascript
await page.pause();
```
When running with `--headed` or `--debug`, the browser will stay open until you click "Resume".
