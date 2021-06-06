import React, { useCallback } from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import { Deck } from '@actions/types';
import Card from '@data/types/Card';
import DeckButton from '@components/deck/controls/DeckButton';
import space from '@styles/space';

interface Props {
  deck: Deck;
  investigator: Card;
  onPress: (deck: Deck, investigator: Card) => void;
}

export default function UpgradeDeckButton({ deck, investigator, onPress }: Props) {
  const buttonOnPress = useCallback(() => {
    onPress(deck, investigator);
  }, [deck, investigator, onPress]);

  return (
    <View style={[space.paddingTopS, space.paddingBottomS, space.paddingRightM]}>
      <DeckButton
        thin
        icon="upgrade"
        color="gold"
        title={t`Upgrade deck`}
        onPress={buttonOnPress}
      />
    </View>
  );
}