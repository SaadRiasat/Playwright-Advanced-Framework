export class ThankYouPage {
  constructor(page) {
    this.page = page;
    this.confirmationText = page.locator('.complete-header');
    this.generatePdfBtn = page.getByRole('button', { name: 'Generate PDF order' });
  }

  async getText() {
    return await this.confirmationText.textContent();
  }

  async downloadPdf() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.generatePdfBtn.click();
    const download = await downloadPromise;
    const filePath = './downloads/' + download.suggestedFilename();
    await download.saveAs(filePath);
    return filePath;
  }
}