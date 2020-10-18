import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  StyleSheet,
  Platform,
  View,
  useWindowDimensions,
  InteractionManager,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { t } from 'ttag';
import { find, flatMap, initial, map, slice } from 'lodash';
import Swiper from 'react-native-swiper';

import { FOOTER_HEIGHT } from '@components/DeckNavFooter/constants';
import CardDetailComponent from './CardDetailView/CardDetailComponent';
import { rightButtonsForCard } from './CardDetailView';
import { CardFaqProps } from './CardFaqView';
import { getTabooSet, AppState, getPacksInCollection, getPackSpoilers } from '@reducers';
import CardQuantityComponent from '../cardlist/CardSearchResult/CardQuantityComponent';
import { InvestigatorCardsProps } from '../cardlist/InvestigatorCardsView';
import { NavigationProps } from '@components/nav/types';
import { Slots } from '@actions/types';
import Card, { CardsMap, PartialCard } from '@data/Card';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useSlots, useToggles, useComponentDidAppear, useNavigationButtonPressed, useCards } from '@components/core/hooks';
import DatabaseContext from '@data/DatabaseContext';
import { where } from '@data/query';
import Carousel from 'react-native-snap-carousel';

export interface CardDetailSwipeProps {
  cardCodes: string[];
  initialCards?: Card[];
  initialIndex: number;
  whiteNav: boolean;
  showAllSpoilers?: boolean;
  tabooSetId?: number;
  deckCardCounts?: Slots;
  onDeckCountChange?: (code: string, count: number) => void;
  renderFooter?: (slots?: Slots, controls?: React.ReactNode) => React.ReactNode;
}

type Props = NavigationProps &
  CardDetailSwipeProps;

const options = (passProps: CardDetailSwipeProps) => {
  return {
    topBar: {
      backButton: {
        title: t`Back`,
        color: passProps.whiteNav ? 'white' : COLORS.M,
      },
    },
  };
};

function SingleCard({
  cards,
  code,
  componentId,
  itemIndex,
  showCardSpoiler,
  tabooSetId,
  toggleShowSpoilers,
  showInvestigatorCards,
  width,
}: {
  code: string;
  componentId: string;
  itemIndex: number;
  cards: CardsMap;
  showCardSpoiler: (card: Card) => boolean;
  tabooSetId?: number;
  toggleShowSpoilers: (code: string) => void;
  showInvestigatorCards: (code: string) => void;
  width: number;
}) {
  const { backgroundStyle, colors } = useContext(StyleContext);
  const card = cards[code];
  if (!card) {
    return <View style={[styles.wrapper, backgroundStyle]} />;
  }
  return (
    <ScrollView
      key={itemIndex}
      overScrollMode="never"
      bounces={false}
      contentContainerStyle={backgroundStyle}
    >
      <CardDetailComponent
        key={itemIndex}
        componentId={componentId}
        card={card}
        showSpoilers={showCardSpoiler(card)}
        tabooSetId={tabooSetId}
        toggleShowSpoilers={toggleShowSpoilers}
        showInvestigatorCards={showInvestigatorCards}
        width={width}
      />
    </ScrollView>
  );
}

function DbCardDetailSwipeView(props: Props) {
  const { componentId, cardCodes, initialCards, showAllSpoilers, onDeckCountChange, tabooSetId: tabooSetOverride, renderFooter, initialIndex } = props;
  const { backgroundStyle, colors } = useContext(StyleContext);
  const { db } = useContext(DatabaseContext);
  const { width, height } = useWindowDimensions();
  const tabooSetId = useSelector((state: AppState) => getTabooSet(state, tabooSetOverride));
  const hasSecondCore = useSelector((state: AppState) => getPacksInCollection(state).core || false);
  const showSpoilers = useSelector((state: AppState) => getPackSpoilers(state));
  const [spoilers, updateSpoiler] = useToggles({});
  const [deckCardCounts, updateDeckCardCounts] = useSlots(props.deckCardCounts || {});
  const [index, setIndex] = useState(initialIndex);
  const [cards, updateCards] = useCards('code', initialCards);
  const currentCode: string = cardCodes[index];
  const currentCard = cards[currentCode];
  const onIndexChanged = useCallback((newIndex: number) => {
    console.log(`Index changed to ${newIndex}`);
    if (index !== newIndex) {
      InteractionManager.runAfterInteractions(() => {
        setIndex(newIndex);
      });
    }
  }, [setIndex]);

  useEffect(() => {
    const nearbyCards = slice(cardCodes, Math.max(index - 10, 0), Math.max(index + 10, cardCodes.length - 1));
    if (find(nearbyCards, code => !cards[code])) {
      console.log(console.log(`Found missing cards, fetching`));
      db.getCards(where(`c.code IN (:...codes)`, { codes: nearbyCards }), tabooSetId)
      .then(newCards => {
        updateCards({ type: 'cards', cards: newCards });
      }, console.log);
    }
  }, [index, cardCodes, db, cards]);

  useEffect(() => {
    if (currentCard) {
      console.log(`Merging options for ${currentCard.code}`);
      const buttonColor = props.whiteNav ? 'white' : COLORS.M;
      const rightButtons = rightButtonsForCard(currentCard, buttonColor);
      Navigation.mergeOptions(componentId, {
        topBar: {
          rightButtons,
          backButton: {
            title: t`Back`,
            color: buttonColor,
          },
        },
      });
    }
  }, [currentCard])

  const showInvestigatorCards = useCallback((code: string) => {
    Navigation.push<InvestigatorCardsProps>(componentId, {
      component: {
        name: 'Browse.InvestigatorCards',
        passProps: {
          investigatorCode: code,
        },
        options: {
          topBar: {
            title: {
              text: t`Allowed Cards`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, []);

  useComponentDidAppear(() => {
    Navigation.mergeOptions(componentId, options(props));
  }, componentId);
  useNavigationButtonPressed(({ buttonId }) => {
    if (currentCard) {
      if (buttonId === 'share') {
        Linking.openURL(`https://arkhamdb.com/card/${card.code}#reviews-header`);
      } else if (buttonId === 'deck') {
        showInvestigatorCards(currentCard.code);
      } else if (buttonId === 'faq') {
        Navigation.push<CardFaqProps>(componentId, {
          component: {
            name: 'Card.Faq',
            passProps: {
              id: currentCard.code,
            },
            options: {
              topBar: {
                title: {
                  text: currentCard.name,
                },
                subtitle: {
                  text: t`FAQ`,
                },
              },
            },
          },
        });
      } else if (buttonId === 'back') {
        Navigation.pop(componentId);
      }
    }
  }, componentId, [currentCard]);

  const toggleShowSpoilers = useCallback((code: string) => {
    updateSpoiler({ type: 'toggle', key: code });
  }, [updateSpoiler]);

  const showCardSpoiler = useCallback((card?: Card) => {
    if (!card) {
      return false;
    }
    return !!(showAllSpoilers || showSpoilers[card.pack_code] || spoilers[card.code]);
  }, [showSpoilers, spoilers]);

  const countChanged = useCallback((count: number) => {
    if (onDeckCountChange) {
      onDeckCountChange(currentCode, count);
    }
    updateDeckCardCounts({ type: 'set-slot', code: currentCode, value: count });
  }, [deckCardCounts]);
  const deckCountControls = useMemo(() => {
    if (!onDeckCountChange || !deckCardCounts || !currentCard) {
      return null;
    }
    const deck_limit: number = Math.min(
      currentCard.pack_code === 'core' ?
        ((currentCard.quantity || 0) * (hasSecondCore ? 2 : 1)) :
        (currentCard.deck_limit || 0),
        currentCard.deck_limit || 0
    );
    return (
      <View style={{ height: FOOTER_HEIGHT, position: 'relative' }}>
        <CardQuantityComponent
          key={currentCard.id}
          count={deckCardCounts[currentCard.code] || 0}
          countChanged={countChanged}
          limit={deck_limit}
          showZeroCount
          forceBig
        />
      </View>
    );
  }, [countChanged, deckCardCounts, currentCard, hasSecondCore, onDeckCountChange]);

  const inRange = useCallback((itemIndex: number) => {
    return itemIndex >= index - 5 && itemIndex <= index + 5;
  }, [index]);
  const renderCard = useCallback((
    { item: card, index: itemIndex, dataIndex }: { item?: Card | undefined; index: number; dataIndex: number }): React.ReactNode => {
    if (!card) {
      return (
        <View style={[styles.wrapper, backgroundStyle, { width, height, justifyContent: 'center' }]}>
          <ActivityIndicator color={colors.lightText} size="small" animating />
        </View>
      );
    }
    return (
      <ScrollView
        key={itemIndex}
        overScrollMode="never"
        bounces={false}
        contentContainerStyle={backgroundStyle}
      >
        <CardDetailComponent
          key={itemIndex}
          componentId={componentId}
          card={card}
          showSpoilers={showCardSpoiler(card)}
          tabooSetId={tabooSetId}
          toggleShowSpoilers={toggleShowSpoilers}
          showInvestigatorCards={showInvestigatorCards}
          width={width}
        />
      </ScrollView>
    );
  }, [showCardSpoiler, backgroundStyle, tabooSetId, componentId, width, toggleShowSpoilers, showInvestigatorCards, cards, inRange]);
  const data: (Card | undefined)[] = useMemo(() => {
    return map(cardCodes, code => cards[code]);
  }, [cardCodes, cards])
  return (
    <View
      style={[styles.wrapper, backgroundStyle, { width, height }]}
    >
      <Carousel
        vertical={false}
        data={data}
        firstItem={initialIndex}
        renderItem={renderCard}
        sliderWidth={width}
        itemWidth={width}
        useExperimentalSnap
        onSnapToItem={onIndexChanged}
      />
    </View>
  );
  /*
  return (
    <View
      style={[styles.wrapper, backgroundStyle]}
    >
      <Swiper
        index={initialIndex}
        width={width}
        style={backgroundStyle}
        containerStyle={[backgroundStyle, { flex: 1, flexDirection: 'column' }]}
        loadMinimal
        loadMinimalSize={1}
        loadMinimalLoader={<View style={[styles.wrapper, backgroundStyle, { width, height }]} />}
        showsPagination={false}
        onIndexChanged={onIndexChanged}
        loop={false}
      >
        { map(cardCodes, (code, index) => renderCard(code, index)) }
      </Swiper>
      { !!renderFooter && renderFooter(deckCardCounts, deckCountControls) }
      { Platform.OS === 'ios' && <View style={[styles.gutter, { height }]} /> }
    </View>
  );*/
}

DbCardDetailSwipeView.options = options;

export default DbCardDetailSwipeView;


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  gutter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 10,
  },
});
