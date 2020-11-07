import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { Deck } from '@actions/types';
import Button from '@components/core/Button';
import Card from '@data/Card';

interface Props {
  icon: React.ReactNode;
  text: string;
  deck: Deck;
  investigator: Card;
  onPress: (deck: Deck, investigator: Card) => void;
}
export default function DeckRowButton({ icon, text, deck, investigator, onPress }: Props) {
  const onButtonPress = useCallback(() => {
    onPress(deck, investigator);
  }, [onPress, deck, investigator]);

  return (
    <Button
      icon={icon}
      text={text}
      style={styles.button}
      size="small"
      align="left"
      color="white"
      onPress={onButtonPress}
      grow
    />
  );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 0,
  },
});
