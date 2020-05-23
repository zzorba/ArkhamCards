import { RANDOM_BASIC_WEAKNESS, ACE_OF_RODS_CODE } from 'constants';
import { QueryClause } from 'data/types';

export const BASIC_WEAKNESS_QUERY: QueryClause = { q: `(c.type_code != "scenario" AND c.subtype_code == "basicweakness" AND c.code != "${RANDOM_BASIC_WEAKNESS}")` };
export const STORY_CARDS_QUERY: QueryClause = { q: `(((c.deck_limit >= 0) AND (c.spoiler == true OR (c.subtype_code is not null && c.restrictions is null))) OR c.code == "${RANDOM_BASIC_WEAKNESS}" OR c.code == "${ACE_OF_RODS_CODE}")` };
export const MYTHOS_CARDS_QUERY: QueryClause = { q: '(c.encounter_code is not null OR linked_card.encounter_code is not null)' };
export const PLAYER_CARDS_QUERY: QueryClause = { q: '(c.deck_limit >= 0)' };

export function tabooSetQuery(tabooSetId?: number) {
  return `(c.taboo_set_id is null OR c.taboo_set_id = ${tabooSetId || 0})`;
}
