import React, { useCallback, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import Card from '@data/Card';
import { xs } from '@styles/space';
import RoundButton from '@components/core/RoundButton';
import DeckQuantityComponent from './DeckQuantityComponent';

interface Props {
  card: Card;
  count: number;
  onUpgradePress?: (card: Card) => void;
  deckId: number;
  limit: number;
}

export default function CardUpgradeButton({ onUpgradePress, card, count, deckId, limit }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const onPress = useCallback(() => onUpgradePress && onUpgradePress(card), [onUpgradePress, card]);
  return (
    <View style={styles.countWrapper}>
      { !!onUpgradePress && (
        <RoundButton onPress={onPress}>
          <View style={styles.icon}>
            <AppIcon
              size={28}
              color={colors.M}
              name="upgrade"
            />
          </View>
        </RoundButton>
      ) }
      <DeckQuantityComponent
        code={card.code}
        deckId={deckId}
        limit={limit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  countWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    marginLeft: xs,
    minWidth: 25,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  icon: {
    paddingLeft: 1,
    paddingBottom: 2,
  },
});