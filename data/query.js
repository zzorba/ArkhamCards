export const BASIC_WEAKNESS_QUERY = '(type_code != "scenario" and subtype_code == "basicweakness" and code != "01000")';
export const STORY_CARDS_QUERY = '((deck_limit > 0) and (spoiler == true || (subtype_code != null && restrictions == null)))';
