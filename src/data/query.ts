import { RANDOM_BASIC_WEAKNESS, ACE_OF_RODS_CODE } from 'constants';

export const BASIC_WEAKNESS_QUERY = `(c.type_code != "scenario" AND c.subtype_code == "basicweakness" AND c.code != "${RANDOM_BASIC_WEAKNESS}")`;
export const STORY_CARDS_QUERY = `(((c.deck_limit >= 0) AND (c.spoiler == true OR (c.subtype_code is not null && c.restrictions is null))) OR c.code == "${RANDOM_BASIC_WEAKNESS}" OR c.code == "${ACE_OF_RODS_CODE}")`;
export const MYTHOS_CARDS_QUERY = '(c.encounter_code is not null OR linked_card.encounter_code is not null)';
export const PLAYER_CARDS_QUERY = '(c.deck_limit >= 0)';
