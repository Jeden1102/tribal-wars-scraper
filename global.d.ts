import { type GameData } from "./types";

declare global {
  interface Window {
    game_data: GameData;
  }
}
