import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { EditSlotsActions } from '@components/core/hooks';
import { incDeckSlot, decDeckSlot, setDeckSlot } from '@components/deck/actions';
import CardQuantityComponent from './CardQuantityComponent';
import { useDeckSlotCount } from '@components/deck/hooks';
import { InteractionManager } from 'react-native';
import { DeckId } from '@actions/types';


interface DeckCardQuantityProps {
  deckId: DeckId;
  code: string;
  limit: number;
  side?: boolean;
  showZeroCount?: boolean;
  forceBig?: boolean;
  useGestureHandler?: boolean;
}

function DeckQuantityComponent(props: DeckCardQuantityProps) {
  const { deckId, code, limit, showZeroCount, forceBig, useGestureHandler, side } = props;
  const count = useDeckSlotCount(deckId, code, side);
  const dispatch = useDispatch();
  const countChanged: EditSlotsActions = useMemo(() => {
    return {
      setSlot: (code: string, count: number) => {
        InteractionManager.runAfterInteractions(() => dispatch(setDeckSlot(deckId, code, count, side)));
      },
      incSlot: (code: string) => {
        InteractionManager.runAfterInteractions(() => dispatch(incDeckSlot(deckId, code, limit, side)));
      },
      decSlot: (code: string) => {
        InteractionManager.runAfterInteractions(() => dispatch(decDeckSlot(deckId, code, side)));
      },
    };
  }, [dispatch, deckId, limit, side]);
  return (
    <CardQuantityComponent
      code={code}
      limit={limit}
      countChanged={countChanged}
      count={count || 0}
      showZeroCount={showZeroCount}
      forceBig={forceBig}
      useGestureHandler={useGestureHandler}
    />
  );
}

export default React.memo(DeckQuantityComponent);
