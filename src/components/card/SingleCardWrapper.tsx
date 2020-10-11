import React from 'react';
import {
  Text,
} from 'react-native';
import { t } from 'ttag';

import CardListWrapper from '@components/card/CardListWrapper';
import Card from '@data/Card';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import space from '@styles/space';

interface Props<T=undefined> {
  code: string;
  type: 'player' | 'encounter';
  extraProps?: T;
  children: (card: Card, extraProps?: T) => React.ReactNode | null;
  loadingComponent?: React.ReactNode;
}

export default class SingleCardWrapper<T=undefined> extends React.Component<Props<T>> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _render = (cards: Card[], loading: boolean): React.ReactNode => {
    const { code, children, loadingComponent, extraProps } = this.props;
    const { typography } = this.context;
    if (!cards || !cards.length || !cards[0]) {
      if (loading) {
        return loadingComponent || null;
      }
      return (
        <Text style={[typography.text, space.paddingM]}>
          { t`Missing card #${code}. Please try updating cards from ArkhamDB in settings.` }
        </Text>
      );
    }
    return children(cards[0], extraProps);
  };

  render() {
    const { code, type, extraProps } = this.props;
    return (
      <CardListWrapper
        codes={[code]}
        type={type}
        extraProps={extraProps}
      >
        { this._render }
      </CardListWrapper>
    );
  }
}
