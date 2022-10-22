import React, { useCallback, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { t } from 'ttag';

import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import Card from '@data/types/Card';
import RoundButton from '@components/core/RoundButton';
import DeckQuantityComponent from './DeckQuantityComponent';
import { DeckId } from '@actions/types';
import space from '@styles/space';

interface Props {
  card: Card;
  onUpgradePress?: (card: Card) => void;
  deckId: DeckId;
  limit: number;
  side?: boolean;
  editable: boolean;
}

export default function CardUpgradeButton({ onUpgradePress, editable, card, deckId, limit, side }: Props) {
  const { colors } = useContext(StyleContext);
  const onPress = useCallback(() => onUpgradePress && onUpgradePress(card), [onUpgradePress, card])
  return (
    <View style={styles.countWrapper}>
      { !side && !!onUpgradePress && (
        <View style={space.marginRightS}>
          <RoundButton onPress={onPress} accessibilityLabel={t`Show upgrades`}>
            <View style={styles.icon}>
              <AppIcon
                size={28}
                color={colors.M}
                name="upgrade"
              />
            </View>
          </RoundButton>
        </View>
      ) }
      <DeckQuantityComponent
        code={card.code}
        deckId={deckId}
        limit={limit}
        side={side}
        editable={editable}
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