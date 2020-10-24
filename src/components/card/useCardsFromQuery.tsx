import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Brackets } from 'typeorm/browser';
import { filter } from 'lodash';

import Card from '@data/Card';
import { QuerySort } from '@data/types';
import { getTabooSet } from '@reducers';
import DatabaseContext from '@data/DatabaseContext';

interface Props {
  query?: Brackets;
  sort?: QuerySort[];
}

export default function useCardsFromQuery({ query, sort }: Props): [Card[], boolean] {
  const tabooSetId = useSelector(getTabooSet);
  const { db } = useContext(DatabaseContext);
  const [cards, setCards] = useState<Card[] | undefined>();
  useEffect(() => {
    if (!query) {
      setCards([]);
    } else {
      setCards(undefined);
      db.getCards(query, tabooSetId, sort).then(cards => {
        setCards(filter(cards, card => !!card))
      });
    }
  }, [db, query, tabooSetId, sort]);
  return [cards || [], cards === undefined];
}
