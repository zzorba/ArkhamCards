import React from 'react';
import { StyleSheet } from 'react-native';

import { Deck } from 'actions/types';
import Button from 'components/core/Button';
import Card from 'data/Card';

interface Props {
  icon: React.ReactNode;
  text: string;
  deck: Deck;
  investigator: Card;
  onPress: (deck: Deck, investigator: Card) => void;
}
export default class DeckRowButton extends React.Component<Props> {
  _onPress = () => {
    const {
      onPress,
      deck,
      investigator,
    } = this.props;
    onPress(deck, investigator);
  };

  render() {
    const {
      icon,
      text,
    } = this.props;
    return (
      <Button
        icon={icon}
        text={text}
        style={styles.button}
        size="small"
        align="left"
        color="white"
        onPress={this._onPress}
        grow
      />
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 0,
  },
});
