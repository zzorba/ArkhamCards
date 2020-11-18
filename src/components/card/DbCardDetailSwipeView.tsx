import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Platform,
  View,
  useWindowDimensions,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { t } from 'ttag';
import { find, filter, map, slice } from 'lodash';

import { FOOTER_HEIGHT } from '@components/DeckNavFooter/constants';
import CardDetailComponent from './CardDetailView/CardDetailComponent';
import { rightButtonsForCard } from './CardDetailView';
import { CardFaqProps } from './CardFaqView';
import { getTabooSet, AppState, getPacksInCollection, getPackSpoilers } from '@reducers';
import { InvestigatorCardsProps } from '../cardlist/InvestigatorCardsView';
import { NavigationProps } from '@components/nav/types';
import Card from '@data/Card';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useToggles, useComponentDidAppear, useNavigationButtonPressed, useCards } from '@components/core/hooks';
import DatabaseContext from '@data/DatabaseContext';
import { where } from '@data/query';
import Carousel from 'react-native-snap-carousel';
import DeckQuantityComponent from '@components/cardlist/CardSearchResult/ControlComponent/DeckQuantityComponent';
import DeckNavFooter from '@components/DeckNavFooter';

export interface CardDetailSwipeProps {
  cardCodes: string[];
  initialCards?: Card[];
  initialIndex: number;
  whiteNav: boolean;
  showAllSpoilers?: boolean;
  tabooSetId?: number;
  deckId?: number;
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
  const { componentId, cardCodes, initialCards, showAllSpoilers, deckId, tabooSetId: tabooSetOverride, initialIndex } = props;
  const { backgroundStyle, colors } = useContext(StyleContext);
  const { db } = useContext(DatabaseContext);
  const { width, height } = useWindowDimensions();
  const tabooSetId = useSelector((state: AppState) => getTabooSet(state, tabooSetOverride));
  const hasSecondCore = useSelector((state: AppState) => getPacksInCollection(state).core || false);
  const showSpoilers = useSelector((state: AppState) => getPackSpoilers(state));
  const [spoilers, toggleShowSpoilers] = useToggles({});
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
  }, [index, cardCodes, db, cards, tabooSetId, updateCards]);

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
  }, [currentCard, componentId, props.whiteNav]);

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
  }, [componentId]);

  useComponentDidAppear(() => {
    Navigation.mergeOptions(componentId, options(props));
  }, componentId, [componentId]);
  useNavigationButtonPressed(({ buttonId }) => {
    if (currentCard) {
      if (buttonId === 'share') {
        Linking.openURL(`https://arkhamdb.com/card/${currentCard.code}#reviews-header`);
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

  const showCardSpoiler = useCallback((card?: Card) => {
    if (!card) {
      return false;
    }
    return !!(showAllSpoilers || showSpoilers[card.pack_code] || spoilers[card.code]);
  }, [showSpoilers, spoilers, showAllSpoilers]);

  const deckCountControls = useMemo(() => {
    if (deckId === undefined || !currentCard) {
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
        <DeckQuantityComponent code={currentCard.code} deckId={deckId} forceBig showZeroCount limit={deck_limit} />
      </View>
    );
  }, [deckId, currentCard, hasSecondCore]);
  const renderCard = useCallback((
    { item: card, index: itemIndex }: { item?: Card | undefined; index: number; dataIndex: number }): React.ReactNode => {
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
  }, [showCardSpoiler, backgroundStyle, tabooSetId, componentId, width, colors, height, toggleShowSpoilers, showInvestigatorCards]);
  const data: (Card | undefined)[] = useMemo(() => {
    return map(cardCodes, code => cards[code]);
  }, [cardCodes, cards]);
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
        disableIntervalMomentum
      />
      { deckId !== undefined && <DeckNavFooter deckId={deckId} componentId={componentId} controls={deckCountControls} /> }
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
