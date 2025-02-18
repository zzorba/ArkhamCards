import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';

import { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import DeckQuantityComponent from './DeckQuantityComponent';
import CardChecklistToggles from './CardChecklistToggles';
import { useChecklistCount, useDeckSlotCount } from '@components/deck/DeckEditContext';
import Card from '@data/types/Card';
import { AttachableDefinition } from '@actions/types';

interface Props {
  card: Card;
  limit: number;
  mode?: 'side' | 'extra' | 'ignore' | 'checklist';
  editable?: boolean
  attachmentOverride?: AttachableDefinition;
}


const EMPTY_CHECKLIST: number[] = [];

function ChecklistButton({ code }: { code: string }) {
  const [count] = useDeckSlotCount(code);
  const { checklist, toggleValue } = useChecklistCount(code);
  return (
    <CardChecklistToggles
      code={code}
      values={checklist ?? EMPTY_CHECKLIST}
      quantity={count}
      toggleValue={toggleValue}
    />
  );
}

export default function FloatingDeckQuantityComponent({ editable, card, limit, mode, attachmentOverride }: Props) {
  const { colors, shadow } = useContext(StyleContext);
  return (
    <View style={[styles.fab, shadow.large, { backgroundColor: colors.D20 }]}>
      { mode === 'checklist' && <ChecklistButton code={card.code} /> }
      <DeckQuantityComponent
        card={card}
        limit={limit}
        mode={mode !== 'checklist' ? mode : undefined}
        showZeroCount
        forceBig
        editable={mode !== 'checklist' && editable}
        attachmentOverride={attachmentOverride}
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
