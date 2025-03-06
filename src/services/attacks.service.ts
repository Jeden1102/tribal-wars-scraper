import { BrowserInstance } from "../utils/browser";
import { AuthService } from "./auth.service";

export class AttackService {
  private page: any;
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async describeAttacks() {
    if (!this.authService.villageId) {
      throw new Error("Village ID nie jest ustawione.");
    }

    if (this.authService?.gameData.player.incomings === "0") {
      return;
    }

    const browser = await BrowserInstance.getInstance();
    this.page = browser.page;

    await this.page.goto(
      `https://pl210.plemiona.pl/game.php?village=${this.authService.villageId}&screen=overview_villages&subtype=attacks&mode=incomings&group=0`,
      { waitUntil: "networkidle0" }
    );

    const selectAll = await this.page.waitForSelector(
      'label[for="select_all"]'
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
