import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export class BrowserInstance {
  private static instance: BrowserInstance;
  public browser: any;
  public page: any;

  private constructor() {}

  static async getInstance() {
    if (!this.instance) {
      this.instance = new BrowserInstance();
      this.instance.browser = await puppeteer.launch({ headless: false });
      this.instance.page = await this.instance.browser.newPage();
    }
    return this.instance;
  }
}
