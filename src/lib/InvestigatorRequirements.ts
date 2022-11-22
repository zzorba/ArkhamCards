import { flatMap } from 'lodash';
import { Brackets } from 'typeorm/browser';

import { DeckMeta } from '@actions/types';
import Card from '@data/types/Card';
import { DeckOptionQueryBuilder } from '@data/types/DeckOption';
import { combineQueries, combineQueriesOpt, where } from '@data/sqlite/query';


export function negativeQueryForInvestigator(investigator: Card, meta?: DeckMeta): Brackets | undefined {
  const inverted = flatMap(
    investigator.deck_options,
    (option, index) => {
      if (!option.not) {
        return [];
      }
      return new DeckOptionQueryBuilder(option, index).toQuery(meta) || [];
    });
  if (!inverted.length) {
    return undefined;
  }
  return combineQueriesOpt(inverted, 'and');
}

/**
 * Turn the given realm card into a realm-query string.
 */
export function queryForInvestigator(investigator: Card, meta?: DeckMeta): Brackets {
  const invertedClause = negativeQueryForInvestigator(investigator, meta);
  // We assume that there is always at least one normalClause.
  const normalQuery = combineQueriesOpt(
    flatMap(investigator.deck_options, (option, index) => {
      if (option.not) {
        return [];
      }
      return new DeckOptionQueryBuilder(option, index).toQuery(meta) || [];
    }),
    'or'
  );
  const mainClause = combineQueriesOpt([
    ...(invertedClause ? [invertedClause] : []),
    ...(normalQuery ? [normalQuery] : []),
  ], 'and');

  return combineQueries(
    where(
      'c.restrictions_investigator IN (:...values) OR c.alternate_required_code IN (:...values)',
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
