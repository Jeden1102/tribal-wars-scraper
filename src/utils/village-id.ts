import axios from "axios";

export class VillageIdService {
  private static MAP_URL = "https://pl210.plemiona.pl/map/village.txt";

  static async getVillageId(x: number, y: number): Promise<number | null> {
    try {
      const response = await axios.get(this.MAP_URL);
      const villages = response.data.split("\n");

      for (const line of villages) {
        const [id, , vx, vy] = line.split(",").map((v) => v.trim());
        if (parseInt(vx) === x && parseInt(vy) === y) {
          return parseInt(id);
        }
      }
    } catch (error) {
      console.error("Error fetching village data:", error);
    }
    return null;
  }
}
