import React, { useCallback, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { t } from 'ttag';

import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import Card from '@data/types/Card';
import RoundButton from '@components/core/RoundButton';
import DeckQuantityComponent from './DeckQuantityComponent';
import space from '@styles/space';

interface Props {
  card: Card;
  onUpgradePress?: (card: Card, mode: 'extra' | undefined) => void;
  limit: number;
  mode: 'side' | 'extra' | 'ignore' | undefined;
  editable: boolean;
}

export default function CardUpgradeButton({ onUpgradePress, editable, card, limit, mode }: Props) {
  const { colors } = useContext(StyleContext);
  const onPress = useCallback(() => onUpgradePress && onUpgradePress(card, mode === 'extra' ? 'extra' : undefined), [onUpgradePress, card, mode]);
  return (
    <View style={styles.countWrapper}>
      { (!mode || mode === 'extra') && !!onUpgradePress && (
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
        card={card}
        limit={limit}
        mode={mode}
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