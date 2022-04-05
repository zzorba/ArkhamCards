import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { map } from 'lodash';

import Card, { CardsMap } from '@data/types/Card';
import space, { s, m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { CARD_RATIO } from '@styles/sizes';
import { showCard } from '@components/nav/helper';
import CardImage, { TouchableCardImage } from '@components/card/CardImage';

export interface GridItem {
  key: string;
  code: string;
}
interface Props<ItemT extends GridItem> {
  componentId?: string;
  items: ItemT[];
  cards: CardsMap | undefined;
  controlHeight: number;
  controlForCard: (item: ItemT, card: Card) => React.ReactNode;
  maxCardsPerRow?: number
}


export default function CardGridComponent<ItemT extends GridItem>({
  componentId,
  items,
  cards,
  controlForCard,
  controlHeight,
  maxCardsPerRow = 10,
}: Props<ItemT>) {
  const { colors, width } = useContext(StyleContext);
  const cardWidth = useMemo(() => {
    let cardsPerRow = maxCardsPerRow;
    let cardWidth = (width - s) / cardsPerRow - s;
    while (cardsPerRow > 2) {
      if (cardWidth > 110) {
        break;
      }
      cardsPerRow--;
      cardWidth = (width - s) / cardsPerRow - s;
    }
    return cardWidth;
  }, [width, maxCardsPerRow]);
  const onCardPress = useCallback((card: Card) => {
    componentId && showCard(componentId, card.code, card, colors, true);
  }, [componentId, colors]);

  const renderCardItem = useCallback((item: ItemT) => {
    const card = cards && cards[item.code];
    if (!card) {
      return null;
    }
    return (
      <View key={item.key} style={{
        flexDirection: 'column',
        alignItems: 'center',
        width: cardWidth + s,
        height: CARD_RATIO * cardWidth + m + controlHeight,
        paddingRight: s,
        paddingBottom: m,
      }}>
        { controlForCard(item, card) }
        <View style={space.paddingTopXs}>
          { componentId ? (
            <TouchableCardImage
              onPress={onCardPress}
              card={card}
              width={cardWidth}
              superCompact
            />
          ) : (
            <CardImage
              card={card}
              width={cardWidth}
              superCompact
            />
          ) }
        </View>
      </View>
    );
  }, [cards, cardWidth, controlForCard, controlHeight, componentId, onCardPress]);

  return (
    <ScrollView contentContainerStyle={[styles.gridView, { width }, space.paddingTopS]}>
      { map(items, (item) => renderCardItem(item)) }
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  gridView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    paddingLeft: s,
  },
});