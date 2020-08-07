import React from 'react';
import {
  Text,
} from 'react-native';
import { t } from 'ttag';

import CardListWrapper from '@components/card/CardListWrapper';
import Card from '@data/Card';
import typography from '@styles/typography';

interface Props {
  code: string;
  type: 'player' | 'encounter';
  children: (card: Card) => React.ReactNode | null;
  loadingComponent?: React.ReactNode;
}

export default class SingleCardWrapper extends React.Component<Props> {
  _render = (cards: Card[], loading: boolean): React.ReactNode => {
    const { code, children, loadingComponent } = this.props;
    if (!cards.length) {
      if (loading) {
        return loadingComponent || null;
      }
      return (
        <Text style={typography.text}>
          { t`Missing card #${code}. Please try updating cards from ArkhamDB in settings.` }
        </Text>
      );
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
