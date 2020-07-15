import React from 'react';
import {
  Text,
} from 'react-native';

import CardListWrapper from '@components/card/CardListWrapper';
import Card from '@data/Card';

interface Props {
  code: string;
  type: 'player' | 'encounter';
  children: (card: Card) => React.ReactNode | null;
}

export default class SingleCardWrapper extends React.Component<Props> {
  _render = (cards: Card[], loading: boolean): React.ReactNode => {
    const { code, children } = this.props;
    if (!cards.length) {
      if (loading) {
        return null;
      }
      return <Text>Unknown { code }</Text>;
    }
    return children(cards[0]);
  };

  render() {
    const { code, type } = this.props;
    return (
      <CardListWrapper
        codes={[code]}
        type={type}
      >
        { this._render }
      </CardListWrapper>
    );
  }
}
