import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import React, { useCallback, useContext, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import DeckQuantityComponent from './DeckQuantityComponent';
import { ChecklistSlots, DeckId } from '@actions/types';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { AppState, getDeckChecklist } from '@reducers';
import { useDispatch, useSelector } from 'react-redux';
import { find } from 'lodash';
import { setDeckChecklistCard } from '@components/deck/actions';
import { useDeckSlotCount } from '@components/deck/hooks';
import CardChecklistToggles from './CardChecklistToggles';

interface Props {
  deckId: DeckId;
  code: string;
  min: number | undefined;
  limit: number;
  mode?: 'side' | 'extra' | 'ignore' | 'checklist';
  editable?: boolean
}

const EMPTY_CHECKLIST: number[] = [];

function ChecklistButton({ deckId, code }: { deckId: DeckId; code: string }) {
  const [count] = useDeckSlotCount(deckId, code);
  const checklistSelector = useCallback((state: AppState) => getDeckChecklist(state, deckId), [deckId]);
  const checklist: ChecklistSlots = useSelector(checklistSelector);
  const dispatch = useDispatch();
  const toggleValue = useCallback((value: number, toggle: boolean) => {
    dispatch(setDeckChecklistCard(deckId, code, value, toggle));
  }, [dispatch, deckId, code]);

  return (
    <CardChecklistToggles
      code={code}
      values={checklist[code] ?? EMPTY_CHECKLIST}
      quantity={count}
      toggleValue={toggleValue}
    />
  );
}

export default function FloatingDeckQuantityComponent({ deckId, editable, code, limit, min, mode }: Props) {
  const { colors, shadow } = useContext(StyleContext);
  return (
    <View style={[styles.fab, shadow.large, { backgroundColor: colors.D20 }]}>
      { mode === 'checklist' && <ChecklistButton deckId={deckId} code={code} /> }
      <DeckQuantityComponent
        deckId={deckId}
        code={code}
        min={min}
        limit={limit}
        mode={mode !== 'checklist' ? mode : undefined}
        showZeroCount
        forceBig
        editable={mode !== 'checklist' && editable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    borderRadius: 40,
    height: 56,
    position: 'absolute',
    bottom: NOTCH_BOTTOM_PADDING + s + xs,
    paddingLeft: s,
    paddingRight: s,
    right: s + xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
