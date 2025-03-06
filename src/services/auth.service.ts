const dotenv = require("dotenv");
import { BrowserInstance } from "../utils/browser";

dotenv.config();

export class AuthService {
  private page: any;
  public villageId: string | null = null;
  public gameData: any = null;
  constructor() {}
  async login() {
    const browser = await BrowserInstance.getInstance();
    this.page = browser.page;
    await this.page.setCookie({
      name: "pl_auth",
      value: process.env.AUTH_COOKIE as string,
      domain: ".plemiona.pl",
    });
    await this.page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
    );
    await this.page.goto("https://www.plemiona.pl/page/play/pl210", {
      waitUntil: "networkidle0",
    });
    this.villageId = await this.page.evaluate(
      () => window.game_data.village.id
    );
    this.gameData = await this.page.evaluate(() => window.game_data);
    if (!this.villageId) throw new Error("Village ID is empty");
    console.log("Logged successfully. Village ID:", this.villageId);
  }
}
