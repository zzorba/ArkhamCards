import React, { useMemo } from 'react';

import { EditSlotsActions, useDeckEdits } from '@components/core/hooks';
import { useDispatch } from 'react-redux';
import { incDeckSlot, decDeckSlot, setDeckSlot } from '@components/deck/DeckDetailView/actions';
import CardQuantityComponent from './CardQuantityComponent';


interface DeckCardQuantityProps {
  deckId: number;
  code: string;
  limit: number;
  showZeroCount?: boolean;
  forceBig?: boolean;
}

export default function DeckQuantityComponent(props: DeckCardQuantityProps) {
  const { deckId, code, limit, showZeroCount, forceBig } = props;
  const deckEditCounts = useDeckEdits(deckId);
  const dispatch = useDispatch();
  const count = deckEditCounts?.slots[code];
  const countChanged: EditSlotsActions = useMemo(() => {
    return {
      setSlot: (code: string, count: number) => {
        dispatch(setDeckSlot(deckId, code, count));
      },
      incSlot: (code: string) => {
        dispatch(incDeckSlot(deckId, code, limit));
      },
      decSlot: (code: string) => {
        dispatch(decDeckSlot(deckId, code));
      },
    };
  }, [dispatch, deckId, limit]);
  return (
    <CardQuantityComponent
      code={code}
      limit={limit}
      countChanged={countChanged}
      count={count || 0}
      showZeroCount={showZeroCount}
      forceBig={forceBig}
    />
  );
}