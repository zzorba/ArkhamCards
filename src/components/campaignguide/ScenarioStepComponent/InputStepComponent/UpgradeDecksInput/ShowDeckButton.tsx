import React, { useCallback, useContext } from 'react';
import { Button } from 'react-native';
import { t } from 'ttag';

import { showDeckModal } from '@components/nav/helper';
import Card from '@data/Card';
import StyleContext from '@styles/StyleContext';
import { useDeck } from '@components/core/hooks';

interface Props {
  componentId: string;
  deckId: number;
  investigator: Card;
}

export default function ShowDeckButton({ componentId, deckId, investigator }: Props) {
  const { colors } = useContext(StyleContext);
  const [deck] = useDeck(deckId, {});
  const onPress = useCallback(() => {
    if (deck) {
      showDeckModal(
        componentId,
        deck,
        colors,
        investigator,
        undefined,
        true
      );
    }
  }, [componentId, investigator, deck, colors]);

  if (!deck) {
    return null;
  }
  return (
    <Button
      title={t`View deck upgrade`}
      onPress={onPress}
    />
  );
}
