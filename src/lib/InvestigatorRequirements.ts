import { filter, flatMap, forEach, map } from 'lodash';
import { Brackets } from 'typeorm/browser';

import { DeckMeta } from 'actions/types';
import Card from 'data/Card';
import { combineQueries, combineQueriesOpt, where } from 'data/query';


export function negativeQueryForInvestigator(investigator: Card, meta?: DeckMeta): Brackets | undefined {
  const inverted = filter(investigator.deck_options, opt => !!opt.not);
  if (!inverted.length) {
    return undefined;
  }
  const subOptions: Brackets[] = flatMap(inverted, option => option.toQuery(meta) || []);
  return combineQueriesOpt(subOptions, 'and');
}

/**
 * Turn the given realm card into a realm-query string.
 */
export function queryForInvestigator(investigator: Card, meta?: DeckMeta): Brackets {
  const normal = filter(investigator.deck_options, opt => !opt.not);
  // We assume that there is always at least one normalClause.
  const invertedClause = negativeQueryForInvestigator(investigator, meta);
  const normalParts = flatMap(normal, option => option.toQuery(meta) || []);
  const mainClause = combineQueriesOpt([
    ...(invertedClause ? [invertedClause] : []),
    ...normalParts,
  ], 'and');

  return combineQueries(
    where(
      'c.restrictions.investigator IN (:...values)',
      {
        values: [
          investigator.code,
          ...(investigator.alternate_of_code ? [investigator.alternate_of_code] : []),
        ],
      }
    ),
    mainClause ? [mainClause] : [],
    'or'
  );
}


export default {
  negativeQueryForInvestigator,
  queryForInvestigator,
};
