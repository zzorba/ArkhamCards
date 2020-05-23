import { filter, map } from 'lodash';

import { DeckMeta } from 'actions/types';
import Card from 'data/Card';
import { QueryClause } from 'data/types';


export function negativeQueryForInvestigator(investigator: Card, meta?: DeckMeta): QueryClause[] {
  const inverted = filter(investigator.deck_options, opt => !!opt.not);
  return inverted.length ?
    `${filter(map(inverted, option => option.toQuery(meta))).join(' AND')} AND ` :
    [];
}

/**
 * Turn the given realm card into a realm-query string.
 */
export function queryForInvestigator(investigator: Card, meta?: DeckMeta): QueryClause[] {
  const normal = filter(investigator.deck_options, opt => !opt.not);
  // We assume that there is always at least one normalClause.
  const invertedClause = negativeQueryForInvestigator(investigator, meta);
  const normalClause = filter(map(normal, option => option.toQuery(meta))).join(' OR');

  // Combine the two clauses with an AND to satisfy the logic here.
  const orParts = [
    `(${invertedClause}(${normalClause}))`,
    `(c.restrictions.investigator = '${investigator.code}')`,
    ...(investigator.alternate_of ? [`(c.restrictions.investigator = '${investigator.alternate_of}')`] : []),
  ];
  return [{
    q: `(${orParts.join(' OR ')})`,
  }];
}

export default {
  queryForInvestigator,
};
