import { useContext, useEffect, useReducer } from 'react';
import { Brackets } from 'typeorm/browser';
import { filter } from 'lodash';

import Card from '@data/types/Card';
import { QuerySort } from '@data/sqlite/types';
import DatabaseContext from '@data/sqlite/DatabaseContext';
import { useTabooSetId } from '@components/core/hooks';

interface Props {
  query?: Brackets;
  sort?: QuerySort[];
  tabooSetOverride?: number;
  guaranteeResults?: boolean;
}

interface CardState {
  cards: Card[];
  loadedQuery?: Brackets;
  loading: boolean;
}

interface Action {
  cards: Card[];
  query: Brackets;
}

export default function useCardsFromQuery({ query, sort, tabooSetOverride, guaranteeResults }: Props): [Card[], boolean] {
  const tabooSetId = useTabooSetId(tabooSetOverride);
  const { db } = useContext(DatabaseContext);
  const [{ cards, loadedQuery, loading }, updateCards] = useReducer(
    (state: CardState, action: Action): CardState => {
      return {
        cards: action.cards,
        loadedQuery: action.query,
        loading: false,
      };
    }, {
      cards: [],
      loading: true,
    }
  );
  useEffect(() => {
    let canceled = false;
    const theQuery = query;
    if (theQuery) {
      // setCards(undefined);
      db.getCards(theQuery, tabooSetId, sort).then(cards => {
        if (!canceled) {
          updateCards({ query: theQuery, cards: filter(cards, card => !!card) });
        }
      });
      return () => {
        canceled = true;
      };
    }
  }, [db, query, tabooSetId, sort]);
  return [cards, loading || !!(guaranteeResults && loadedQuery !== query)];
}
