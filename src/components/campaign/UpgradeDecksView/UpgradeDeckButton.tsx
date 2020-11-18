import React, { useCallback } from 'react';
import { Button } from 'react-native';
import { t } from 'ttag';

import { Deck } from '@actions/types';
import Card from '@data/Card';

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
    <Button
      title={t`Upgrade deck`}
      onPress={buttonOnPress}
    />
  );
}