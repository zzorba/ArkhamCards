import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { map } from 'lodash';
import Animated, { SlideInDown, SlideInLeft, SlideOutDown, SlideOutRight, useSharedValue } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { NavigationProps } from '@components/nav/types';
import { CampaignId, DeckId, SET_CURRENT_DRAFT, SET_CURRENT_DRAFT_SIZE } from '@actions/types';
import { useCampaignDeck } from '@data/hooks';
import { useParsedDeck } from './hooks';
import StyleContext from '@styles/StyleContext';
import DeckNavFooter from './DeckNavFooter';
import { Navigation, OptionsTopBar, OptionsTopBarButton } from 'react-native-navigation';
import LoadingSpinner from '@components/core/LoadingSpinner';
import Card from '@data/types/Card';
import { useDraftableCards } from './useChaosDeckGenerator';
import { AppState, getPacksInCollection } from '@reducers';
import { useCounter, usePressCallback, useSettingValue } from '@components/core/hooks';
import { getDraftCards } from '@lib/randomDeck';
import DeckButton from './controls/DeckButton';
import space from '@styles/space';
import CardGridComponent, { DraftHistory, GridItem } from '@components/cardlist/CardGridComponent';
import { incDeckSlot } from './actions';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import ListToggleButton from './ListToggleButton';
import { showCard } from '@components/nav/helper';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import Ripple from '@lib/react-native-material-ripple';
import AppIcon from '@icons/AppIcon';
import { ca } from 'date-fns/locale';

export interface DeckDraftProps {
  id: DeckId;
  campaignId?: CampaignId;
}

function DraftButton({ card, onDraft, cardWidth, item }: { card: Card; cardWidth: number; item: GridItem; onDraft: (card: Card, item?: GridItem) => void }) {
  const { colors, shadow } = useContext(StyleContext);
  const handleOnPress = useCallback(() => onDraft(card, item), [onDraft, card, item]);
  const debouncedOnPress = usePressCallback(handleOnPress, 500);
  const size = 32;
  return (
    <Ripple style={[
      shadow.medium,
      styles.button,
      {
        backgroundColor: colors.L20,
        width: cardWidth,
        height: size,
        borderRadius: size / 2,
      },
    ]} onPress={debouncedOnPress} rippleColor={colors.M} rippleSize={size}>
      <AppIcon name="plus-button" size={24} color={colors.M} />
    </Ripple>
  );
}


export function navigationOptions(
  {
    lightButton,
  }: {
    lightButton?: boolean;
  }
){
  const rightButtons: OptionsTopBarButton[] = [{
    id: 'grid',
    component: {
      name: 'ListToggleButton',
      passProps: {
        setting: 'draft_grid',
        lightButton,
      },
      width: ListToggleButton.WIDTH,
      height: ListToggleButton.HEIGHT,
    },
    accessibilityLabel: t`Grid`,
    enabled: true,
  }];
  const topBarOptions: OptionsTopBar = {
    rightButtons,
  };

  return {
    topBar: topBarOptions,
  };
}

export default function DeckDraftView({ componentId, id, campaignId }: DeckDraftProps & NavigationProps) {
  const deck = useCampaignDeck(id, campaignId);
  const parsedDeckObj = useParsedDeck(id, componentId);
  useEffect(() => {
    Navigation.mergeOptions(componentId, navigationOptions({ lightButton: true }));
  }, [componentId]);

  const initialDraftSize = useSelector((state: AppState) => state.decks.draft?.[id.uuid]?.size || 3);
  const initialDraftCards = useSelector((state: AppState) => state.decks.draft?.[id.uuid]?.current);
  const [draftCards, setLocalDraftCards] = useState<undefined | string[]>(initialDraftCards);
  const draftCycle = useRef<number>(1);

  const dispatch = useDispatch();
  const updateDraftSize = useCallback((size: number) => dispatch({ type: SET_CURRENT_DRAFT_SIZE, id, size }), [id, dispatch]);

  const setDraftCards = useCallback((current: string[]) => {
    draftCycle.current = draftCycle.current + 1;
    setLocalDraftCards(current);
    dispatch({ type: SET_CURRENT_DRAFT, id, current });
  }, [id, dispatch, setLocalDraftCards, draftCycle]);

  const [handSize, incHandSize, decHandSize] = useCounter(initialDraftSize, { min: 2, max: 10, hapticFeedback: true }, updateDraftSize);
  const meta = parsedDeckObj.deckEdits?.meta;
  const tabooSetId = parsedDeckObj.tabooSetId;
  const [investigatorBack, allPossibleCodes, cards] = useDraftableCards({ investigatorCode: deck?.investigator, meta, tabooSetId });
  const possibleCodes = useRef<string[]>([]);
  useEffect(() => {
    if (allPossibleCodes) {
      possibleCodes.current = allPossibleCodes;
    }
  }, [allPossibleCodes]);

  const in_collection = useSelector(getPacksInCollection);
  const ignore_collection = useSettingValue('ignore_collection');
  const deckEdits = parsedDeckObj.deckEdits;
  const onDraftNewCards = useCallback(() => {
    if (!deckEdits || !investigatorBack) {
      return;
    }
    const [draftOptions, newPossibleCodes] = getDraftCards(
      investigatorBack,
      deckEdits.meta,
      deckEdits.slots,
      handSize,
      possibleCodes.current,
      cards,
      in_collection,
      ignore_collection
    );
    setDraftCards(map(draftOptions, c => c.code));
    possibleCodes.current = newPossibleCodes;
  }, [investigatorBack, deckEdits, handSize, cards, in_collection, ignore_collection]);

  const { backgroundStyle, colors, typography, shadow } = useContext(StyleContext);
  const backPressed = useCallback(() => Navigation.pop(componentId), [componentId]);
  const draftHistory = useSharedValue<DraftHistory>({ cycle: -1, code: '000' });
  const draftItems = useMemo(() => {
    return map(draftCards, code => {
      return {
        key: `${draftCycle.current}_${code}`,
        code: code,
        enterAnimation: SlideInLeft.duration(500).delay(500),
        exitAnimation: SlideOutDown.duration(500),
        draftCycle: draftCycle.current,
      };
    });
  }, [draftCards]);
  const onDraft = useCallback((card: Card, item?: GridItem) => {
    ReactNativeHapticFeedback.trigger('impactMedium');
    if (item && item.draftCycle !== undefined) {
      draftHistory.value = {
        cycle: item.draftCycle,
        code: card.code,
      };
    }
    setTimeout(() => {
      onDraftNewCards();
    }, 500);
    dispatch(incDeckSlot(id, card.code, card.deck_limit || 0, false));
  }, [dispatch, id, onDraftNewCards]);

  const gridView = useSettingValue('draft_grid');

  const controlForCard = useCallback((item: GridItem, card: Card, cardWidth: number) => {
    return <DraftButton item={item} card={card} cardWidth={cardWidth} onDraft={onDraft} />
  }, [onDraft]);
  const onCardPress = useCallback((card: Card) => {
    showCard(componentId, card.code, card, colors, true);
  }, [componentId, colors]);

  const renderCardItem = useCallback(({ item }: { item: GridItem }) => {
    const card = cards && cards[item.code];
    if (!card) {
      return null;
    }
    return (
      <Animated.View key={item.key} entering={SlideInLeft} exiting={SlideOutRight}>
        <CardSearchResult
          id={item.key}
          card={card}
          onPress={onCardPress}
          control={{
            type: 'draft',
            onDraft,
          }}
        />
      </Animated.View>
    );
  }, [cards, onDraft, onCardPress]);

  return (
    <View style={[backgroundStyle, { flex: 1 }]}>
      <View style={[space.paddingS, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.L20 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[typography.large, typography.dark, space.paddingRightM]}>{t`Hand size:`}</Text>
          <PlusMinusButtons
            dialogStyle
            onIncrement={incHandSize}
            onDecrement={decHandSize}
            count={handSize}
          />
        </View>
        <DeckButton
          shrink
          loading={!allPossibleCodes}
          icon="draft"
          color={draftCards && draftCards.length === handSize ? 'red_outline' : 'red'}
          title={draftCards ? t`Redraw` : t`Begin`}
          onPress={onDraftNewCards}
        />
      </View>
      { !allPossibleCodes ? <LoadingSpinner large /> : (
        <>
          { gridView ? (
            <CardGridComponent
              controlForCard={controlForCard}
              items={draftItems}
              cards={cards}
              componentId={componentId}
              draftHistory={draftHistory}
              controlHeight={60}
              controlPosition="below"
            />
          ) : (
            <FlatList
              data={draftItems}
              renderItem={renderCardItem}
            />
          ) }
        </>
      ) }
      <DeckNavFooter
        deckId={id}
        componentId={componentId}
        onPress={backPressed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
