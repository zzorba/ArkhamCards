import React, { useContext } from 'react';
import {
  Text,
} from 'react-native';
import { t } from 'ttag';

import Card from '@data/Card';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import useCardList from './useCardList';

interface Props<T=undefined> {
  code: string;
  type: 'player' | 'encounter';
  extraProps?: T;
  children: (card: Card, extraProps?: T) => React.ReactNode | null;
  loadingComponent?: React.ReactNode;
  placeholderComponent?: () => React.ReactNode;
}

export default function SingleCardWrapper<T=undefined>({ code, type, extraProps, children, loadingComponent, placeholderComponent }: Props<T>) {
  const { typography } = useContext(StyleContext);
  const [cards, loading] = useCardList([code], type);

  if (!cards || !cards.length || !cards[0]) {
    if (loading) {
      if (loadingComponent) {
        return (
          <>
            { loadingComponent }
          </>
        );
      }
      return null;
    }
    if (placeholderComponent) {
      return (
        <>
          { placeholderComponent() }
        </>
      );
    }
    return (
      <Text style={[typography.text, space.paddingM]}>
        { t`Missing card #${code}. Please try updating cards from ArkhamDB in settings.` }
      </Text>
    );
  }
  return (
    <>
      { children(cards[0], extraProps) }
    </>
  );
}
