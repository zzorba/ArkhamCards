import { forEach } from 'lodash';
import { Brackets } from 'typeorm/browser';

import { RANDOM_BASIC_WEAKNESS, ACE_OF_RODS_CODE } from '@app_constants';
import { QueryParams } from '@data/sqlite/types';


export function where(query: string, params?: QueryParams): Brackets {
  return new Brackets(qb => qb.where(query, params));
}

export const ON_YOUR_OWN_RESTRICTION = new Brackets(
  qb => qb.where(`c.slots_normalized is not null AND c.slots_normalized LIKE :slot`, { slot: '%#ally#%' }),
  { negate: true }
);

export const BASIC_QUERY = where('c.browse_visible != 0 and c.browse_visible < 8');
export const BASIC_WITH_DUPLICATES_QUERY = where('c.browse_visible != 0 and c.browse_visible != 8');
export const SCENARIO_CARDS_QUERY = where('c.type_code = "scenario"');
export const BASIC_WEAKNESS_QUERY = where(
  `c.type_code != "scenario" AND c.subtype_code = "basicweakness" AND c.code != "${RANDOM_BASIC_WEAKNESS}"`
);
export const STORY_CARDS_QUERY = where(
  `((c.deck_limit >= 0) AND (c.mythos_card = true OR (c.subtype_code is not null AND c.has_restrictions = false))) OR c.code = "${RANDOM_BASIC_WEAKNESS}" OR c.code = "${ACE_OF_RODS_CODE}"`
);
export const MYTHOS_CARDS_QUERY = where('c.browse_visible in (2,3)');
export const BROWSE_CARDS_QUERY = where('c.browse_visible in (1,3)');
export const PLAYER_CARDS_QUERY = where(`c.browse_visible in (1,3,4,17,19,20)`);
export const SYNC_CARDS_QUERY = where(`c.browse_visible in (1,3,4,9,11,12,17,19,20,25,27,28)`);
export const BROWSE_CARDS_WITH_DUPLICATES_QUERY = where('c.browse_visible in (1,3,4,5,7,9,11,12)');
export const INVESTIGATOR_CARDS_QUERY = where('c.type_code = "investigator"');
export function tabooSetQuery(tabooSetId?: number) {
  return `(c.taboo_set_id is null OR c.taboo_set_id = ${tabooSetId || 0})`;
}

export function combineQueriesOpt(
  brackets: Brackets[],
  operation: 'or' | 'and',
  negate?: boolean
): Brackets | undefined {
  if (brackets.length) {
    const [firstQuery, ...restQueries] = brackets;
    return combineQueries(firstQuery, restQueries, operation, negate);
  }
  return undefined;
}

export function combineQueries(
  firstQuery: Brackets,
  otherQueries: Brackets[],
  operation: 'or' | 'and',
  negate?: boolean
) {
  return new Brackets(qb => {
    qb = qb.where(firstQuery);
    forEach(otherQueries, query => {
      switch (operation) {
        case 'or':
          qb = qb.orWhere(query);
          break;
        case 'and':
          qb = qb.andWhere(query);
          break;
      }
    });
    return qb;
  }, { negate });
}