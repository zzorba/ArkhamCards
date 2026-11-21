// Shapes of the `fan_made_content` blob that arkham.build embeds in a deck's meta.

export interface ArkhamBuildDeckRequirements {
  size?: number;
  // ArkhamDB style: { [requiredCode]: { [requiredCode]: requiredCode, [alternateCode]: alternateCode } }
  card?: { [code: string]: { [code: string]: string } };
  random?: { target: string; value: string }[];
}

export interface ArkhamBuildRestrictions {
  investigator?: { [code: string]: string };
  faction?: string[];
  trait?: string[];
}

export interface ArkhamBuildFanMadeCard {
  id: string;
  code: string;
  name: string;
  real_name?: string;
  subname?: string;
  real_subname?: string;
  type_code: string;
  subtype_code?: string;
  faction_code: string;
  faction2_code?: string;
  faction3_code?: string;
  text?: string;
  real_text?: string;
  back_text?: string;
  real_back_text?: string;
  back_name?: string;
  real_back_name?: string;
  traits?: string;
  real_traits?: string;
  slot?: string;
  real_slot?: string;
  pack_code?: string;
  encounter_code?: string;
  encounter_position?: number;
  position?: number;
  quantity?: number;
  deck_limit?: number;
  cost?: number;
  xp?: number;
  health?: number;
  sanity?: number;
  health_per_investigator?: boolean;
  is_unique?: boolean;
  exceptional?: boolean;
  myriad?: boolean;
  permanent?: boolean;
  double_sided?: boolean;
  image_url?: string;
  thumbnail_url?: string;
  back_image_url?: string;
  back_thumbnail_url?: string;
  flavor?: string;
  real_flavor?: string;
  back_flavor?: string;
  real_back_flavor?: string;
  illustrator?: string;
  skill_willpower?: number;
  skill_intellect?: number;
  skill_combat?: number;
  skill_agility?: number;
  skill_wild?: number;
  deck_options?: Record<string, unknown>[];
  deck_requirements?: ArkhamBuildDeckRequirements;
  restrictions?: ArkhamBuildRestrictions;
  official?: boolean;
}

export interface ArkhamBuildFanMadePack {
  code: string;
  name: string;
  real_name?: string;
  cycle_code?: string;
  position?: number;
  icon_url?: string;
  official?: boolean;
}

export interface ArkhamBuildFanMadeCycle {
  code: string;
  name: string;
  real_name?: string;
  position?: number;
  official?: boolean;
}

export interface ArkhamBuildFanMadeEncounterSet {
  code: string;
  name: string;
  real_name?: string;
  pack_code?: string;
  icon_url?: string;
}

export interface ArkhamBuildFanMadeContent {
  cards: { [code: string]: ArkhamBuildFanMadeCard };
  packs?: { [code: string]: ArkhamBuildFanMadePack };
  cycles?: { [code: string]: ArkhamBuildFanMadeCycle };
  encounter_sets?: { [code: string]: ArkhamBuildFanMadeEncounterSet };
}
