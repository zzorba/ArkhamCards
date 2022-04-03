import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setTabooSet } from './actions';
import { AppState, makeTabooSetSelector } from '@reducers';
import DeckTabooPickerButton from '@components/deck/controls/DeckTabooPickerButton';

interface Props {
  last?: boolean;
}

export default function SettingsTabooPicker({ last }: Props) {
  const dispatch = useDispatch();
  const onSetTabooSet = useCallback((tabooSetId: number) => {
    dispatch(setTabooSet(tabooSetId));
  }, [dispatch]);
  const tabooSetSelector: (state: AppState, tabooSetId?: number) => number | undefined = useMemo(makeTabooSetSelector, []);
  const tabooSetId = useSelector((state: AppState) => tabooSetSelector(state, undefined));
  const cardsLoading = useSelector((state: AppState) => state.cards.loading);
  return (
    <DeckTabooPickerButton
      tabooSetId={tabooSetId}
      setTabooSet={onSetTabooSet}
      disabled={cardsLoading}
      last={last}
      loading={cardsLoading}
      show
    />
  );
}
