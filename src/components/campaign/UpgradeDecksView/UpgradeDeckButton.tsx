import React from 'react';
import { Button } from 'react-native';
import { t } from 'ttag';

import { Deck } from 'actions/types';
import Card from '@data/Card';

interface Props {
  deck: Deck;
  investigator: Card;
  onPress: (deck: Deck, investigator: Card) => void;
}

export default class UpgradeDeckButton extends React.Component<Props> {
  _onPress = () => {
    const { deck, investigator, onPress } = this.props;
    onPress(deck, investigator);
  };

  render() {
    return (
      <Button
        title={t`Upgrade deck`}
        onPress={this._onPress}
      />
    );
  }
}