import React from 'react';
import {
  Text,
} from 'react-native';

import CardListWrapper from './CardListWrapper';
import Card from 'data/Card';

interface Props<T> {
  code: string;
  render: (card: Card, extraArg: T) => React.ReactNode;
  extraArg: T;
}

export default class SingleCardWrapper<T = undefined> extends React.Component<Props<T>> {
  _render = (cards: Card[]) => {
    const { render, code, extraArg } = this.props;
    if (!cards.length) {
      return <Text>Unknown { code }</Text>;
    }
    return render(cards[0], extraArg);
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
