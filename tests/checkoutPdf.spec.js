import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { ThankYouPage } from '../pages/ThankYouPage.js';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

test('Validate PDF after checkout', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  const thankYou = new ThankYouPage(page);

  await login.goto();
  await login.login('standard_user', 'secret_sauce');

  await inventory.addProductByName('Sauce Labs Backpack');
  await inventory.openCart();

  await cart.checkout();
  await checkout.fillDetails('Saad', 'Riasat', '74800');
  await checkout.finish();

  const text = await thankYou.getText();
  await expect(text).toContain('Thank you');

  // --- DOWNLOAD AND VALIDATE PDF ---
  const pdfPath = await thankYou.downloadPdf();
  
  // Read and parse the PDF
  const dataBuffer = fs.readFileSync(pdfPath);
  const parse = pdfParse.default || pdfParse.PDFParse || pdfParse;
  const pdfData = await parse(dataBuffer);
  const pdfText = pdfData.text;

  // Assertions on the PDF text content
  expect(pdfText).toContain('Order Receipt');
  expect(pdfText).toContain('Saad Riasat');
  expect(pdfText).toContain('74800');
  expect(pdfText).toContain('Sauce Labs Backpack');
});