const puppeteerExtra = require("puppeteer-extra");
const dotenv = require("dotenv");
dotenv.config();
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteerExtra.use(StealthPlugin());
let browserInstance: any;
import { type GameData } from "./types";

class Scraper {
  public villageId: string | null;
  public gameData: GameData | null;

  constructor() {
    this.villageId = null;
    this.gameData = null;
  }

  async login() {
    if (!browserInstance) {
      browserInstance = await puppeteerExtra.launch({ headless: false });
    }
    const page = await browserInstance.newPage();

    const cookies = [
      {
        name: "pl_auth",
        value: process.env.AUTH_COOKIE,
        domain: ".plemiona.pl",
      },
    ];

    await page.setCookie(...cookies);

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
    );

    await page.goto("https://www.plemiona.pl/page/play/pl210", {
      waitUntil: "networkidle0",
    });

    this.villageId = await page.evaluate(() => {
      this.gameData = window?.game_data as GameData;
      return window.game_data.village.id;
    });

    if (!this.villageId) {
      throw new Error("Village ID is empty");
    }

    console.log("Logged successfully. Village ID:", this.villageId);

    await this.sendMessage("test", page);

    return;
  }

  async sendMessage(message, page) {
    if (!this.villageId) {
      throw new Error("Village ID nie jest ustawione.");
    }

    await page.goto(
      `https://pl210.plemiona.pl/game.php?village=${this.villageId}&screen=mail&mode=new`,
      { waitUntil: "networkidle0" }
    );

    const messageTo = await page.waitForSelector('input[name="to"]');
    await messageTo.type("jeden1102");

    const messageSubject = await page.waitForSelector('input[name="subject"]');
    await messageSubject.type("Tytul");

    const messageContent = await page.waitForSelector("textarea");
    await messageContent.type("Tresc wiadomosci");

    const sendButton = await page.waitForSelector('input[name="send"]');
    await sendButton.click();
  }
}

const scraper = new Scraper();
scraper.login().catch((err) => {
  console.error("Błąd podczas logowania:", err);
});
