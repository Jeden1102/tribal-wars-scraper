type Player = {
  id: number;
  name: string;
  ally: string;
  ally_level: string;
  ally_member_count: string;
  sitter: string;
  sleep_start: string;
  sitter_type: string;
  sleep_end: string;
  sleep_last: string;
  email_valid: string;
  villages: string;
  incomings: string;
  supports: string;
  knight_location: string;
  knight_unit: string;
  rank: number;
  points: string;
  date_started: string;
  is_guest: string;
  confirmation_skipping_hash: string;
  quest_progress: string;
  points_formatted: string;
  rank_formatted: string;
  pp: string;
  new_ally_application: string;
  new_ally_invite: string;
  new_buddy_request: string;
  new_daily_bonus: string;
  new_forum_post: string;
  new_post_notification: number;
  new_igm: string;
  new_items: string;
  new_report: string;
  new_quest: string;
};

type Quest = {
  use_questlines: boolean;
};

type Feature = {
  possible: boolean;
  active: boolean;
};

type Features = {
  Premium: Feature;
  AccountManager: Feature;
  FarmAssistent: Feature;
};

type VillageBuildings = {
  main: string;
  barracks: string;
  stable: string;
  garage: string;
  snob: string;
  smith: string;
  place: string;
  statue: string;
  market: string;
  wood: string;
  stone: string;
  iron: string;
  farm: string;
  storage: string;
  wall: string;
};

type Village = {
  id: number;
  name: string;
  display_name: string;
  wood: number;
  wood_prod: number;
  wood_float: number;
  stone: number;
  stone_prod: number;
  stone_float: number;
  iron: number;
  iron_prod: number;
  iron_float: number;
  pop: number;
  pop_max: number;
  x: number;
  y: number;
  trader_away: number;
  storage_max: number;
  bonus_id: null;
  bonus: null;
  buildings: VillageBuildings;
  player_id: number;
  modifications: number;
  points: number;
  last_res_tick: number;
  coord: string;
  is_farm_upgradable: boolean;
};

type Nav = {
  parent: number;
};

export type GameData = {
  player: Player;
  quest: Quest;
  features: Features;
  village: Village;
  nav: Nav;
  link_base: string;
  link_base_pure: string;
  csrf: string;
  world: string;
  market: string;
  RTL: boolean;
  version: string;
  majorVersion: string;
  screen: string;
  mode: string;
  device: string;
  pregame: boolean;
  units: string[];
  locale: string;
  group_id: string;
  time_generated: number;
};
