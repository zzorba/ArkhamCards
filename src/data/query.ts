import { RANDOM_BASIC_WEAKNESS, ACE_OF_RODS } from '../constants';

export const BASIC_WEAKNESS_QUERY = `(type_code != "scenario" and subtype_code == "basicweakness" and code != "${RANDOM_BASIC_WEAKNESS}")`;
export const STORY_CARDS_QUERY = `(((deck_limit >= 0) and (spoiler == true || (subtype_code != null && restrictions == null))) or code == "${RANDOM_BASIC_WEAKNESS}" or code == "${ACE_OF_RODS}")`;
export const MYTHOS_CARDS_QUERY = '(encounter_code != null || linked_card.encounter_code != null)';
export const PLAYER_CARDS_QUERY = '(deck_limit >= 0)';
