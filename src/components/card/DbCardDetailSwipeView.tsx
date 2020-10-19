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
import { find, filter, flatMap, initial, map, slice } from 'lodash';
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
  const currentCode = useMemo(() => cardCodes[index], [cardCodes, index]);
  const currentCard = useMemo(() => cards[currentCode], [cards, currentCode]);
  useEffect(() => {
    const nearbyCards = slice(cardCodes, Math.max(index - 10, 0), Math.min(index + 10, cardCodes.length - 1));
    if (find(nearbyCards, code => !cards[code])) {
      const codes = filter(
        slice(cardCodes, Math.max(index - 20, 0), Math.min(index + 30, cardCodes.length - 1)),
        code => !cards[code]
      );
      db.getCards(where(`c.code IN (:...codes)`, { codes }), tabooSetId)
      .then(newCards => {
        updateCards({ type: 'cards', cards: newCards });
      }, console.log);
    }
  }, [index, cardCodes, db, cards]);

  useEffect(() => {
    if (currentCard) {
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

  const countChanged = useCallback((code: string, value: number) => {
    if (onDeckCountChange) {
      onDeckCountChange(code, value);
    }
    updateDeckCardCounts({ type: 'set-slot', code, value });
  }, [onDeckCountChange, updateDeckCardCounts]);

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
          code={currentCard.code}
          count={deckCardCounts[currentCard.code] || 0}
          countChanged={countChanged}
          limit={deck_limit}
          showZeroCount
          forceBig
        />
      </View>
    );
  }, [countChanged, deckCardCounts, currentCard, hasSecondCore, onDeckCountChange]);
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
  }, [showCardSpoiler, backgroundStyle, tabooSetId, componentId, width, toggleShowSpoilers, showInvestigatorCards, cards]);
  const data: (Card | undefined)[] = useMemo(() => {
    return map(cardCodes, code => cards[code]);
  }, [cardCodes, cards]);

  const footer = useMemo(() => {
    return !!renderFooter && renderFooter(deckCardCounts, deckCountControls);
  }, [renderFooter, deckCardCounts, deckCountControls]);
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
        onScrollIndexChanged={setIndex}
      />
      { footer }
      { Platform.OS === 'ios' && <View style={[styles.gutter, { height }]} /> }
    </View>
  );
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
