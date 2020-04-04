import React from 'react';
import {
  Text,
} from 'react-native';

import CardListWrapper from './CardListWrapper';
import Card from 'data/Card';

interface Props {
  code: string;
  render: (card: Card) => React.ReactNode;
}

export default class SingleCardWrapper extends React.Component<Props> {
  _render = (cards: Card[]) => {
    const { render, code } = this.props;
    if (!cards.length) {
      return <Text>Unknown { code }</Text>;
    }
    return render(cards[0]);
  };

  render() {
    const { code } = this.props;
    return (
      <CardListWrapper
        cards={[code]}
        render={this._render}
        extraArg={undefined}
      />
    );
  }
}
