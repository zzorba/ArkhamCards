import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import React, { useCallback, useContext, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import DeckQuantityComponent from './DeckQuantityComponent';
import { DeckId } from '@actions/types';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { AppState, getDeckChecklist } from '@reducers';
import { useDispatch, useSelector } from 'react-redux';
import { find } from 'lodash';
import { setDeckChecklistCard } from '@components/deck/actions';

interface Props {
  deckId: DeckId;
  code: string;
  min: number | undefined;
  limit: number;
  mode?: 'side' | 'extra' | 'ignore' | 'checklist';
  editable?: boolean
}

function ChecklistButton({ deckId, code }: { deckId: DeckId; code: string }) {
  const checklistSelector = useCallback((state: AppState) => getDeckChecklist(state, deckId), [deckId]);
  const checklist = useSelector(checklistSelector);
  const checked = useMemo(() => !!find(checklist, x => x === code), [checklist, code]);
  const dispatch = useDispatch();
  const toggleValue = useCallback((value: boolean) => {
    dispatch(setDeckChecklistCard(deckId, code, value));
  }, [dispatch, deckId, code]);

  return (
    <ArkhamSwitch
      color="light"
      value={checked}
      onValueChange={toggleValue}
      animateTouchOnly
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
