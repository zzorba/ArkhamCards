import { useContext, useEffect, useMemo, useState } from 'react';
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

export default function useCardsFromQuery({ query, sort, tabooSetOverride }: Props): [Card[], boolean] {
  const tabooSetId = useTabooSetId(tabooSetOverride);
  const { db } = useContext(DatabaseContext);
  const [cards, setCards] = useState<Card[] | undefined>();
  useEffect(() => {
    if (!query) {
      setCards([]);
    } else {
      // setCards(undefined);
      db.getCards(query, tabooSetId, sort).then(cards => {
        setCards(filter(cards, card => !!card));
      });
    }
  }, [db, query, tabooSetId, sort]);
  const resultCards = useMemo(() => cards || [], [cards]);
  return [resultCards, cards === undefined];
}
