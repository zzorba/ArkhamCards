export const BASIC_WEAKNESS_QUERY = '(type_code != "scenario" and subtype_code == "basicweakness" and code != "01000")';
export const STORY_CARDS_QUERY = '(((deck_limit > 0) and (spoiler == true || (subtype_code != null && restrictions == null))) or code == "01000")';
export const MYTHOS_CARDS_QUERY = '(encounter_code != null || linked_card.encounter_code != null)';
export const PLAYER_CARDS_QUERY = '(deck_limit > 0)';
