import { BrowserInstance } from "../utils/browser";
import { AuthService } from "./auth.service";
import { VillageIdService } from "../utils/village-id";

type TroopMovement = {
  type: "attack" | "support";
  fromVillage: { x: number; y: number };
  toVillage: { x: number; y: number };
  units?: Record<string, number>;
};

export class CommandsService {
  private page: any;
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async sendTroops({ type, fromVillage, toVillage, units }: TroopMovement) {
    if (!this.authService.villageId) {
      throw new Error("Village ID nie jest ustawione.");
    }

    const browser = await BrowserInstance.getInstance();
    this.page = browser.page;

    const fromVillageId = await VillageIdService.getVillageId(
      fromVillage.x,
      fromVillage.y
    );
    const toVillageId = await VillageIdService.getVillageId(
      toVillage.x,
      toVillage.y
    );

    if (!fromVillageId || !toVillageId) {
      throw new Error("Nie znaleziono ID wioski dla podanych koordynatów.");
    }

    const unitParams = units
      ? Object.entries(units)
          .map(([unit, count]) => `${unit}=${count}`)
          .join("&")
      : "";

    const url = `https://pl210.plemiona.pl/game.php?village=${fromVillageId}&screen=place&target=${toVillageId}&${unitParams}`;

    await this.page.goto(url, { waitUntil: "networkidle0" });

    const sendAttackBtn = await this.page.waitForSelector("#target_attack");
    const sendSupportBtn = await this.page.waitForSelector("#target_support");

    if (!sendAttackBtn && !sendSupportBtn) {
      throw new Error("Nie znaleziono przycisków wysyłania wojsk.");
    }

    console.log("Przeszedłem na stronę wysyłania wojsk.");

    if (type === "attack") {
      await Promise.all([this.page.waitForNavigation(), sendAttackBtn.click()]);
    } else if (type === "support") {
      await Promise.all([
        this.page.waitForNavigation(),
        sendSupportBtn.click(),
      ]);
    }

    const confirm = await this.page.waitForSelector("#troop_confirm_submit");
    await Promise.all([this.page.waitForNavigation(), confirm.click()]);
  }
}
