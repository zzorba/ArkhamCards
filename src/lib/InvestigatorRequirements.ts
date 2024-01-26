import { flatMap, map } from 'lodash';
import { Brackets } from 'typeorm/browser';

import { DeckMeta } from '@actions/types';
import Card from '@data/types/Card';
import { DeckOptionQueryBuilder } from '@data/types/DeckOption';
import { combineQueries, combineQueriesOpt, where } from '@data/sqlite/query';
import { FilterState } from './filters';

interface DeckOptionsContext {
  isUpgrade?: boolean;
  hideSplash?: boolean;
  extraDeck?: boolean;
  side?: boolean;
}

export function negativeQueryForInvestigator(investigator: Card, meta?: DeckMeta, isUpgrade?: boolean, isExtraDeck?: boolean, isSideDeck?: boolean): Brackets | undefined {
  const inverted = flatMap(
    isExtraDeck ? investigator.side_deck_options : investigator.deck_options,
    (option, index) => {
      if (!option.not) {
        return [];
      }
      return new DeckOptionQueryBuilder(option, index).toQuery(meta, isUpgrade || isSideDeck) || [];
    });
  if (!inverted.length) {
    return undefined;
  }
  return combineQueriesOpt(inverted, 'and');
}

/**
 * Turn the given realm card into a realm-query string.
 */
export function queryForInvestigator(
  investigator: Card,
  meta?: DeckMeta,
  filters?: FilterState,
  context?: DeckOptionsContext
): Brackets {
  const invertedClause = negativeQueryForInvestigator(investigator, meta, context?.isUpgrade, context?.extraDeck, context?.side);
  const deck_options = context?.extraDeck ? investigator.side_deck_options : investigator.deck_options;
  // We assume that there is always at least one normalClause.
  const normalQuery = combineQueriesOpt(
    flatMap(deck_options, (option, index) => {
      if (option.not) {
        return [];
      }
      if (option.limit && context?.hideSplash) {
        return [];
      }
      if (option.level && filters?.levelEnabled) {
        if (option.level.max < filters.level[0]) {
          return [];
        }
        if (option.level.min > filters.level[1]) {
          return [];
        }
      }
      return new DeckOptionQueryBuilder(option, index).toQuery(meta, context?.isUpgrade || context?.side) || [];
    }),
    'or'
  );
  const mainClause = combineQueriesOpt([
    ...(invertedClause ? [invertedClause] : []),
    ...(normalQuery ? [normalQuery] : []),
  ], 'and');
  return combineQueries(
    context?.extraDeck ?
      where(
        'c.code IN (:...values)',
        {
          values: flatMap(investigator.side_deck_requirements?.card ?? [], card => [
            ...(card.code ? [card.code] : []),
            ...(card.alternates ?? []),
          ]),
        }
      ) : where(
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
