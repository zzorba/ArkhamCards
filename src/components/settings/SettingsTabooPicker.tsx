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
  const onSetTabooSet = useCallback((tabooSetId: number, useCurrent: boolean, currentTabooSetId: number | undefined) => {
    dispatch(setTabooSet(tabooSetId, useCurrent, currentTabooSetId));
  }, [dispatch]);
  const tabooSetSelector: (state: AppState, tabooSetId?: number) => number | undefined = useMemo(makeTabooSetSelector, []);
  const tabooSetId = useSelector((state: AppState) => tabooSetSelector(state, undefined));
  const useCurrentTabooSet = useSelector((state: AppState) => state.settings.useCurrentTabooSet);
  const cardsLoading = useSelector((state: AppState) => state.cards.loading);
  return (
    <DeckTabooPickerButton
      tabooSetId={useCurrentTabooSet ? 100 : tabooSetId}
      setTabooSet={onSetTabooSet}
      disabled={cardsLoading}
      last={last}
      loading={cardsLoading}
      show
      includeCurrent
    />
  );
}
