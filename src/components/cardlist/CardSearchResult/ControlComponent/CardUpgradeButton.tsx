import React, { useCallback, useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import Card from '@data/types/Card';
import RoundButton from '@components/core/RoundButton';
import DeckQuantityComponent from './DeckQuantityComponent';
import { DeckId } from '@actions/types';

interface Props {
  card: Card;
  onUpgradePress?: (card: Card) => void;
  deckId: DeckId;
  limit: number;
}

export default function CardUpgradeButton({ onUpgradePress, card, deckId, limit }: Props) {
  const { colors } = useContext(StyleContext);
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
  icon: {
    paddingLeft: 1,
    paddingBottom: 2,
  },
});