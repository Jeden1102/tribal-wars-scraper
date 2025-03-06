import { BrowserInstance } from "../utils/browser";
import { AuthService } from "./auth.service";

export class MessageService {
  private page: any;
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async sendMessage(message: string, title: string, to: string) {
    if (!this.authService.villageId) {
      throw new Error("Village ID nie jest ustawione.");
    }

    const browser = await BrowserInstance.getInstance();
    this.page = browser.page;

    await this.page.goto(
      `https://pl210.plemiona.pl/game.php?village=${this.authService.villageId}&screen=mail&mode=new`,
      { waitUntil: "networkidle0" }
    );

    await this.page.type('input[name="to"]', to);
    await this.page.type('input[name="subject"]', title);
    await this.page.type("textarea", message);

    const sendButton = await this.page.waitForSelector('input[name="send"]');
    await Promise.all([this.page.waitForNavigation(), sendButton.click()]);

    console.log("Wiadomość wysłana!");
  }
}
