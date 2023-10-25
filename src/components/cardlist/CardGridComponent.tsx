import React, { useCallback, useContext, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { ComplexAnimationBuilder, SharedValue, useAnimatedReaction, useSharedValue, withTiming } from 'react-native-reanimated';
import { map } from 'lodash';

import Card, { CardsMap } from '@data/types/Card';
import space, { isTablet, s, m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { CARD_RATIO } from '@styles/sizes';
import { showCard } from '@components/nav/helper';
import CardImage, { TouchableCardImage } from '@components/card/CardImage';

export interface DraftHistory {
  cycle: number;
  code?: string;
}

export interface GridItem {
  key: string;
  code: string;
  enterAnimation?: ComplexAnimationBuilder;
  exitAnimation?: ComplexAnimationBuilder;
  fadeOut?: boolean;
  draftCycle?: number;
}
interface Props<ItemT extends GridItem> {
  componentId?: string;
  items: ItemT[];
  cards: CardsMap | undefined;
  controlHeight: number;
  controlPosition?: 'above' | 'below';
  controlForCard: (item: ItemT, card: Card, cardWidth: number) => React.ReactNode;
  maxCardsPerRow?: number
  draftHistory?: SharedValue<DraftHistory>;
}

function CardGridItem<ItemT extends GridItem>({
  item,
  card,
  cardWidth,
  control,
  controlHeight,
  controlPosition,
  onCardPress,
  draftHistory,
}: {
  item: ItemT;
  card: Card;
  cardWidth: number;
  control: React.ReactNode;
  controlHeight: number;
  controlPosition: 'above' | 'below';
  onCardPress?: (card: Card) => void;
  draftHistory?: SharedValue<DraftHistory>;
}) {
  const opacity = useSharedValue(1);
  useAnimatedReaction(() => {
    // console.log(`${JSON.stringify(item)} has history ${JSON.stringify(draftHistory?.value)}`);
    if (!item.draftCycle || !draftHistory || draftHistory.value.cycle < item.draftCycle) {
      return false;
    }
    return !draftHistory.value.code || draftHistory.value.code !== item.code;
  }, (result, previous) => {
    // console.log(`${item.code} - ${previous} -> ${result}`);
    if (result !== previous) {
      opacity.value = result ? withTiming(0, { duration: 250 }) : withTiming(1, { duration: 100 });
    }
  }, [item.draftCycle, item.code, draftHistory]);
  return (
    <Animated.View
      entering={item.enterAnimation}
      exiting={item.exitAnimation}
      style={[{
        flexDirection: 'column',
        alignItems: 'center',
        width: cardWidth + s,
        height: CARD_RATIO * cardWidth + m + controlHeight,
        paddingRight: s,
        paddingBottom: m,
      }, { opacity }]}
    >
      { controlPosition === 'above' && control }
      <View style={space.paddingVerticalXs}>
        { onCardPress ? (
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
      { controlPosition === 'below' && control }
    </Animated.View>
  );
}

export default function CardGridComponent<ItemT extends GridItem>({
  componentId,
  items,
  cards,
  controlForCard,
  controlHeight,
  controlPosition = 'above',
  maxCardsPerRow = 8,
  draftHistory,
}: Props<ItemT>) {
  const { backgroundStyle, colors, width, height } = useContext(StyleContext);
  const cardWidth = useMemo(() => {
    let cardsPerRow = maxCardsPerRow;
    let cardWidth = (width - s) / cardsPerRow - s;
    while (cardsPerRow > 2) {
      if (cardWidth > (isTablet ? 200 : 110)) {
        break;
      }
      cardsPerRow--;
      cardWidth = (width - s) / cardsPerRow - s;
    }
    return cardWidth;
  }, [width, maxCardsPerRow]);

  const onCardPress = useCallback((card: Card) => {
    componentId && showCard(componentId, card.code, card, colors, { showSpoilers: true });
  }, [componentId, colors]);

  const renderCardItem = useCallback((item: ItemT) => {
    const card = cards && cards[item.code];
    if (!card) {
      return null;
    }
    const control = controlForCard(item, card, cardWidth);
    return (
      <CardGridItem
        key={item.key}
        card={card}
        cardWidth={cardWidth}
        draftHistory={draftHistory}
        item={item}
        control={control}
        controlHeight={controlHeight}
        controlPosition={controlPosition}
        onCardPress={componentId ? onCardPress : undefined}
      />
    );
  }, [cards, cardWidth, controlForCard, controlPosition, draftHistory, controlHeight, componentId, onCardPress]);
  return (
    <ScrollView style={[backgroundStyle, { flex: 1 }]} contentContainerStyle={[styles.gridView, { width, minHeight: height * 0.75 }, space.paddingTopS]}>
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