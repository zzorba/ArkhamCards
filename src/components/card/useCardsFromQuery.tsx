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
}

interface CardState {
  cards: Card[];
  loading: boolean;
}

export default function useCardsFromQuery({ query, sort, tabooSetOverride }: Props): [Card[], boolean] {
  const tabooSetId = useTabooSetId(tabooSetOverride);
  const { db } = useContext(DatabaseContext);
  const [{ cards, loading }, updateCards] = useReducer((state: CardState, cards: Card[]) => {
    return {
      cards,
      loading: false,
    };
  }, {
    cards: [],
    loading: true,
  });
  useEffect(() => {
    let canceled = false;
    if (query) {
      // setCards(undefined);
      db.getCards(query, tabooSetId, sort).then(cards => {
        if (!canceled) {
          updateCards(filter(cards, card => !!card));
        }
      });
      return () => {
        canceled = true;
      };
    }
  }, [db, query, tabooSetId, sort]);
  return [cards, loading];
}
