import { RANDOM_BASIC_WEAKNESS, ACE_OF_RODS_CODE } from 'constants';

export const BASIC_WEAKNESS_QUERY = `(type_code != "scenario" AND subtype_code == "basicweakness" AND code != "${RANDOM_BASIC_WEAKNESS}")`;
export const STORY_CARDS_QUERY = `(((deck_limit >= 0) AND (spoiler == true OR (subtype_code is not null && restrictions is null))) OR code == "${RANDOM_BASIC_WEAKNESS}" OR code == "${ACE_OF_RODS_CODE}")`;
export const MYTHOS_CARDS_QUERY = '(encounter_code is not null OR linked_card.encounter_code is not null)';
export const PLAYER_CARDS_QUERY = '(deck_limit >= 0)';
