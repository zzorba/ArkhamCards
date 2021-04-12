import React, { useCallback, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { map } from 'lodash';

import Card from '@data/types/Card';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import ArkhamSwitch from '@components/core/ArkhamSwitch';

interface Props {
  index: number;
  disabled: boolean;
  cards: Card[];
  value: boolean;
  onValueChange: (index: number, value: boolean) => void;
  last?: boolean;
  onPress: (card: Card) => void;
}

export default function RequiredCardSwitch({ index, disabled, cards, value, onValueChange, onPress, last }: Props) {
  const { borderStyle } = useContext(StyleContext);

  const handleOnValueChange = useCallback((value: boolean) => {
    onValueChange(index, value);
  }, [onValueChange, index]);

  return (
    <View style={[styles.row, space.paddingTopS, space.paddingBottomS, borderStyle, !last ? styles.border : undefined]}>
      <View style={styles.flex}>
        { map(cards, card => <CardSearchResult noBorder key={card.code} onPress={onPress} card={card} />) }
      </View>
      <ArkhamSwitch value={value} onValueChange={handleOnValueChange} disabled={disabled} large />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  flex: {
    flex: 1,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
