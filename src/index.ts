import { AuthService } from "./services/auth.service";
import { MessageService } from "./services/messages.service";
import { AttackService } from "./services/attacks.service";
import { CommandsService } from "./services/commands.service";

const runApp = async () => {
  const authService = new AuthService();
  await authService.login();
  const messageService = new MessageService(authService);
  await messageService.sendMessage("Test message", "Test title", "jeden1102");
  const attackService = new AttackService(authService);
  await attackService.describeAttacks();
  await messageService.sendMessage("Test message2", "Test title2", "jeden1102");

  const commandsService = new CommandsService(authService);
  await commandsService.sendTroops({
    type: "attack",
    fromVillage: {
      x: 502,
      y: 617,
    },
    toVillage: {
      x: 509,
      y: 616,
    },
    units: { axe: 100 },
  });

  await commandsService.sendTroops({
    type: "support",
    fromVillage: {
      x: 502,
      y: 617,
    },
    toVillage: {
      x: 509,
      y: 616,
    },
    units: { axe: 100 },
  });
};

runApp();
