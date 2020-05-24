import React from 'react';
import {
  Text,
} from 'react-native';

import CardListWrapper from 'components/card/CardListWrapper';
import Card from 'data/Card';

interface Props<T = undefined> {
  code: string;
  extraArg: T;
  children: (card: Card, extraArg: T) => React.ReactNode | null;
}

export default class SingleCardWrapper<T = undefined> extends React.Component<Props<T>> {
  _render = (cards: Card[]): React.ReactNode => {
    const { code, extraArg, children } = this.props;
    if (!cards.length) {
      return <Text>Unknown { code }</Text>;
    }
    return children(cards[0], extraArg);
  };

  render() {
    const { code } = this.props;
    return (
      <CardListWrapper
        cards={[code]}
        extraArg={undefined}
      >
        { this._render }
      </CardListWrapper>
    );
  }
}
