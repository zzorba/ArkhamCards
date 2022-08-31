import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Platform,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import Carousel from 'react-native-snap-carousel';
import { useSelector } from 'react-redux';
import { t } from 'ttag';
import { find, filter, map, slice } from 'lodash';

import CardDetailComponent from './CardDetailView/CardDetailComponent';
import { rightButtonsForCard } from './CardDetailView';
import { CardFaqProps } from './CardFaqView';
import { makeTabooSetSelector, AppState, getPackSpoilers, getPacksInCollection } from '@reducers';
import { InvestigatorCardsProps } from '../cardlist/InvestigatorCardsView';
import { NavigationProps } from '@components/nav/types';
import Card from '@data/types/Card';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useToggles, useComponentDidAppear, useNavigationButtonPressed, useCards, useSettingValue } from '@components/core/hooks';
import DatabaseContext from '@data/sqlite/DatabaseContext';
import { where } from '@data/sqlite/query';
import DeckNavFooter, { FOOTER_HEIGHT } from '@components/deck/DeckNavFooter';
import { FactionCodeType } from '@app_constants';
import FloatingDeckQuantityComponent from '@components/cardlist/CardSearchResult/ControlComponent/FloatingDeckQuantityComponent';
import { Customizations, DeckId } from '@actions/types';
import { CardInvestigatorProps } from './CardInvestigatorsView';
import CardCustomizationOptions from './CardDetailView/CardCustomizationOptions';
import { useCardCustomizations, useSimpleDeckEdits } from '@components/deck/hooks';
import { CustomizationChoice } from '@data/types/CustomizationOption';
import LanguageContext from '@lib/i18n/LanguageContext';

export interface CardDetailSwipeProps {
  cardCodes: string[];
  controls?: ('deck' | 'side' | 'special' | 'bonded')[];
  initialCards?: Card[];
  initialIndex: number;
  whiteNav: boolean;
  showAllSpoilers?: boolean;
  tabooSetId?: number;
  deckId?: DeckId;
  faction?: FactionCodeType;
  editable?: boolean;
  customizationsEditable?: boolean;
  initialCustomizations: Customizations | undefined
}

type Props = NavigationProps & CardDetailSwipeProps;

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

function ScrollableCard({ componentId, mode, customizationsEditable, card, setChoice, width, height, deckId, customizations, deckCount, toggleShowSpoilers, showInvestigatorCards, showCardSpoiler }: {
  componentId: string;
  card: Card | undefined;
  customizationsEditable: boolean | undefined;
  setChoice: (code: string, choice: CustomizationChoice) => void;
  width: number;
  height: number;
  deckId: DeckId | undefined;
  deckCount?: number;
  customizations: Customizations;
  showCardSpoiler: (card: Card) => boolean;
  toggleShowSpoilers: (code: string) => void;
  showInvestigatorCards: (code: string) => void;
  mode?: 'view' | 'edit' | 'upgrade';
}) {
  const { backgroundStyle, colors } = useContext(StyleContext);
  const { listSeperator } = useContext(LanguageContext);
  const customizationChoices = useMemo(() => {
    if (card && deckId) {
      return (deckCount ? customizations[card.code] || [] : []);
    }
    return undefined;
  }, [deckId, customizations, card, deckCount])
  const customizedCard = useMemo(() => {
    return card?.withCustomizations(listSeperator, customizationChoices);
  }, [card, listSeperator, customizationChoices]);
  if (!customizedCard) {
    return (
      <View style={[styles.wrapper, backgroundStyle, { width, height, justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.lightText} size="small" animating />
      </View>
    );
  }
  return (
    <ScrollView
      overScrollMode="never"
      bounces={false}
      contentContainerStyle={backgroundStyle}
    >
      <CardDetailComponent
        componentId={componentId}
        card={customizedCard}
        showSpoilers={showCardSpoiler(customizedCard)}
        toggleShowSpoilers={toggleShowSpoilers}
        showInvestigatorCards={showInvestigatorCards}
        width={width}
      />
      { !!customizedCard.customization_options && !!card && (
        <CardCustomizationOptions
          componentId={componentId}
          card={card}
          mode={mode}
          deckId={deckId}
          customizationOptions={customizedCard.customization_options}
          customizationChoices={customizationChoices}
          width={width}
          editable={!!customizationsEditable && !!deckCount}
          setChoice={setChoice}
        />
      ) }
      { deckId !== undefined && <View style={{ width, height: FOOTER_HEIGHT }} /> }
    </ScrollView>
  );
}

function DbCardDetailSwipeView(props: Props) {
  const { componentId, cardCodes, editable, customizationsEditable, initialCards, showAllSpoilers, deckId, tabooSetId: tabooSetOverride, initialIndex, controls, initialCustomizations } = props;
  const { listSeperator } = useContext(LanguageContext);
  const [customizations, setChoice] = useCardCustomizations(deckId, initialCustomizations);
  const deckEdits = useSimpleDeckEdits(deckId);
  const { backgroundStyle, width, height } = useContext(StyleContext);
  const { db } = useContext(DatabaseContext);
  const tabooSetSelector: (state: AppState, tabooSetOverride?: number) => number | undefined = useMemo(makeTabooSetSelector, []);
  const tabooSetId = useSelector((state: AppState) => tabooSetSelector(state, tabooSetOverride));
  const packInCollection = useSelector(getPacksInCollection);
  const ignore_collection = useSettingValue('ignore_collection');
  const showSpoilers = useSelector(getPackSpoilers);
  const [spoilers, toggleShowSpoilers] = useToggles({});
  const [index, setIndex] = useState(initialIndex);
  const [cards, updateCards] = useCards('code', initialCards);
  const [currentCode, currentControl] = useMemo(() => {
    return [
      cardCodes[index],
      controls ? controls[index] : undefined,
    ];
  }, [cardCodes, controls, index]);

  const currentCard = useMemo(() => {
    const card = cards[currentCode];
    return card && card.withCustomizations(listSeperator, customizations[currentCode]);
  }, [listSeperator, customizations, currentCode, cards]);
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

  const showInvestigators = useCallback((code: string) => {
    Navigation.push<CardInvestigatorProps>(componentId, {
      component: {
        name: 'Card.Investigators',
        passProps: {
          code,
        },
        options: {
          topBar: {
            title: {
              text: t`Investigators`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [componentId]);
  const backPressed = useCallback(() => {
    Navigation.pop(componentId);
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
      } else if (buttonId === 'investigator') {
        showInvestigators(currentCard.code);
      } else if (buttonId === 'back') {
        Navigation.pop(componentId);
      }
    }
  }, componentId, [currentCard, showInvestigators, showInvestigatorCards]);

  const showCardSpoiler = useCallback((card: Card) => {
    return !!(showAllSpoilers || showSpoilers[card.pack_code] || spoilers[card.code]);
  }, [showSpoilers, spoilers, showAllSpoilers]);

  const deckCountControls = useMemo(() => {
    if (deckId === undefined || !currentCard) {
      return null;
    }
    if (currentControl === 'bonded') {
      return null;
    }
    const deck_limit: number = currentCard.collectionDeckLimit(packInCollection, ignore_collection);
    return (
      <FloatingDeckQuantityComponent
        code={currentCard.code}
        deckId={deckId}
        limit={deck_limit}
        side={currentControl === 'side'}
        editable={editable}
      />
    );
  }, [deckId, editable, currentCard, currentControl, packInCollection, ignore_collection]);
  const mode = deckEdits?.mode;
  const slots = deckEdits?.slots;
  const renderCard = useCallback((
    { item: card, index: itemIndex }: { item?: Card | undefined; index: number; dataIndex: number }
  ): React.ReactNode => {
    return (
      <ScrollableCard
        key={itemIndex}
        card={card}
        width={width}
        height={height}
        deckId={deckId}
        mode={mode}
        componentId={componentId}
        customizations={customizations}
        showCardSpoiler={showCardSpoiler}
        toggleShowSpoilers={toggleShowSpoilers}
        showInvestigatorCards={showInvestigatorCards}
        setChoice={setChoice}
        deckCount={card && slots?.[card.code]}
        customizationsEditable={editable || customizationsEditable}
      />
    );
  }, [slots, customizationsEditable, editable, customizations, mode, componentId, deckId, width, height, setChoice, showCardSpoiler, toggleShowSpoilers, showInvestigatorCards]);
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
        initialNumToRender={data[initialIndex]?.type_code === 'investigator' ? 1 : 2}
        maxToRenderPerBatch={3}
        renderItem={renderCard}
        sliderWidth={width}
        itemWidth={width}
        useExperimentalSnap
        shouldOptimizeUpdates
        onScrollIndexChanged={setIndex}
        disableIntervalMomentum
        apparitionDelay={Platform.OS === 'ios' ? 50 : undefined}
      />
      { deckId !== undefined && (
        <>
          <DeckNavFooter
            componentId={componentId}
            deckId={deckId}
            control="counts"
            onPress={backPressed}
          />
          { deckCountControls }
        </>
      ) }
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
