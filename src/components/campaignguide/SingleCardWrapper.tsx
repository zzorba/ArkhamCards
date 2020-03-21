import React from 'react';
import {
  Text,
} from 'react-native';

import CardQueryWrapper from './CardQueryWrapper';
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
      <CardQueryWrapper
        query={`(code == '${code}')`}
        render={this._render}
      />
    );
  }
}
