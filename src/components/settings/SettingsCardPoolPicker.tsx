import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DeckCardPoolButton from '@components/deck/controls/DeckCardPoolButton';
import { AppState, makeCardPoolSelector } from '@reducers';
import { setCardPoolMode, setCardPoolPacks, setCardPoolPacksCallback } from './actions';
import { CardPoolMode } from '@actions/types';

export default function SettingsCardPoolPicker({ first, last }: { first?: boolean; last?: boolean }) {
  const dispatch = useDispatch();
  const onSetCardPool = useCallback((cardPool: CardPoolMode) => {
    dispatch(setCardPoolMode(cardPool));
  }, [dispatch]);
  const onSetCardPacks = useCallback((packs: string[] | ((current: string[]) => string[])) => {
    if (typeof packs === 'function') {
      dispatch(setCardPoolPacksCallback(packs));
    } else {
      dispatch(setCardPoolPacks(packs));
    }
  }, [dispatch]);
  const cardPoolSelector = useMemo(makeCardPoolSelector, []);
  const { cardPoolMode, cardPoolPacks } = useSelector((state: AppState) => cardPoolSelector(state));

  return (
    <DeckCardPoolButton
      first={first}
      last={last}
      cardPool={cardPoolMode}
      setCardPool={onSetCardPool}
      selectedPacks={cardPoolPacks}
      setSelectedPacks={onSetCardPacks}
    />
  );
}