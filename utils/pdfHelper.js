/**
 * pdfHelper.js
 * Utility to parse PDF files using the pdf-parse library.
 * Uses createRequire so it works in an ES module project ("type": "module").
 */
import { createRequire } from 'module';
import fs from 'fs';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

/**
 * parsePdf(filePath)
 * Reads and parses a PDF file, returning the extracted text content.
 *
 * @param {string} filePath - Absolute or relative path to the PDF file
 * @returns {Promise<string>} - Extracted text from the PDF
 */
export async function parsePdf(filePath, retries = 3) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`PDF file not found: ${filePath}`);
  }
  for (let i = 0; i < retries; i++) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      if (dataBuffer.length === 0) {
        await new Promise((res) => setTimeout(res, 300));
        continue;
      }
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((res) => setTimeout(res, 500));
    }
  }
}