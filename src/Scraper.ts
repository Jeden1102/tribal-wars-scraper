const puppeteerExtra = require("puppeteer-extra");
const dotenv = require("dotenv");
dotenv.config();
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteerExtra.use(StealthPlugin());
import { type GameData } from "./types";

export class Scraper {
  public villageId: string | null;
  public gameData: GameData | null;
  public browserInstance: any;
  public page: any;

  constructor() {
    this.villageId = null;
    this.gameData = null;
    this.browserInstance = null;
    this.page = null;
  }

  async login() {
    if (!this.browserInstance) {
      this.browserInstance = await puppeteerExtra.launch({ headless: false });
    }
    this.page = await this.browserInstance.newPage();

    const cookies = [
      {
        name: "pl_auth",
        value: process.env.AUTH_COOKIE,
        domain: ".plemiona.pl",
      },
    ];

    await this.page.setCookie(...cookies);

    await this.page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
    );

    await this.page.goto("https://www.plemiona.pl/page/play/pl210", {
      waitUntil: "networkidle0",
    });

    this.villageId = await this.page.evaluate(() => {
      return window.game_data.village.id;
    });

    this.gameData = await this.page.evaluate(() => {
      return window.game_data;
    });

    if (!this.villageId) {
      throw new Error("Village ID is empty");
    }

    console.log("Logged successfully. Village ID:", this.villageId);
  }

  async sendMessage({
    message,
    title,
    to,
  }: {
    message: string;
    title: string;
    to: string;
  }) {
    if (!this.villageId) {
      throw new Error("Village ID nie jest ustawione.");
    }

    await this.page.goto(
      `https://pl210.plemiona.pl/game.php?village=${this.villageId}&screen=mail&mode=new`,
      { waitUntil: "networkidle0" }
    );

    const messageTo = await this.page.waitForSelector('input[name="to"]');
    await messageTo.type(to);

    const messageSubject = await this.page.waitForSelector(
      'input[name="subject"]'
    );
    await messageSubject.type(title);

    const messageContent = await this.page.waitForSelector("textarea");
    await messageContent.type(message);

    const sendButton = await this.page.waitForSelector('input[name="send"]');

    await Promise.all([
      this.page.waitForNavigation({ waitUntil: "networkidle0" }),
      sendButton.click(),
    ]);

    console.log("Wiadomość wysłana!");
  }

  async describeAttacks() {
    console.log(this.gameData?.player);
    if (this.gameData?.player.incomings === "0") {
      return;
    }

    if (!this.villageId) {
      throw new Error("Village ID nie jest ustawione.");
    }

    await this.page.goto(
      `https://pl210.plemiona.pl/game.php?village=${this.villageId}&screen=overview_villages&subtype=attacks&mode=incomings&group=0`,
      { waitUntil: "networkidle0" }
    );

    const selectAll = await this.page.waitForSelector(
      'label[for="select_all"]',
      { timeout: 5000 }
    );

    if (!selectAll) return;

    await selectAll.click();

    const describeBtn = await this.page.waitForSelector('input[name="label"]', {
      timeout: 5000,
    });

    await Promise.all([
      this.page.waitForNavigation({ waitUntil: "networkidle0" }),
      describeBtn.click(),
    ]);

    console.log("Ataki opisane!");
  }
}
