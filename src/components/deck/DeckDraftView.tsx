import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { map } from 'lodash';
import Animated, { SharedValue, SlideInLeft, SlideOutDown, useAnimatedReaction, useSharedValue, withTiming } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ActionButton from 'react-native-action-button';

import { NavigationProps } from '@components/nav/types';
import { CampaignId, DeckId, SET_CURRENT_DRAFT, SET_CURRENT_DRAFT_SIZE, Slots, TOO_FEW_CARDS } from '@actions/types';
import { useCampaignDeck } from '@data/hooks';
import { useParsedDeck } from './hooks';
import StyleContext from '@styles/StyleContext';
import DeckNavFooter from './DeckNavFooter';
import { Navigation, OptionsTopBar, OptionsTopBarButton } from 'react-native-navigation';
import LoadingSpinner from '@components/core/LoadingSpinner';
import Card from '@data/types/Card';
import { useDraftableCards } from './useChaosDeckGenerator';
import { AppState, getDraftPacks } from '@reducers';
import { useCounter, useEffectUpdate, useLatestDeckCards, usePressCallback, useSettingValue } from '@components/core/hooks';
import { getDraftCards } from '@lib/randomDeck';
import DeckButton from './controls/DeckButton';
import space, { s, xs } from '@styles/space';
import CardGridComponent, { DraftHistory, GridItem } from '@components/cardlist/CardGridComponent';
import { incDeckSlot } from './actions';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import ListToggleButton from './ListToggleButton';
import { showCard } from '@components/nav/helper';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import Ripple from '@lib/react-native-material-ripple';
import AppIcon from '@icons/AppIcon';
import { parseDeck } from '@lib/parseDeck';
import { useAlertDialog } from './dialogs';
import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import { CollectionEditProps } from '@components/settings/CollectionEditView';
import LanguageContext from '@lib/i18n/LanguageContext';

export interface DeckDraftProps {
  id: DeckId;
  campaignId: CampaignId | undefined;
}

function DraftButton({ card, onDraft, cardWidth, item }: { card: Card; cardWidth: number; item: GridItem; onDraft: (card: Card, item?: GridItem) => void }) {
  const { colors, shadow } = useContext(StyleContext);
  const handleOnPress = useCallback(() => onDraft(card, item), [onDraft, card, item]);
  const debouncedOnPress = usePressCallback(handleOnPress, 500);
  const size = 32;
  return (
    <Ripple style={[
      shadow.medium,
      {
        backgroundColor: colors.L20,
        width: cardWidth,
        height: size,
        borderRadius: size / 2,
      },
    ]} contentStyle={[styles.button, { height: size }]} onPress={debouncedOnPress} rippleColor={colors.M} rippleSize={size}>
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
) {
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


function FabDraftButton({ onPress, loading, secondaryAction }: { onPress: () => void; loading: boolean; secondaryAction?: boolean }) {
  const { colors, shadow } = useContext(StyleContext);
  const localPress = useCallback(() => {
    if (!loading) {
      onPress();
    }
  }, [loading, onPress]);
  const renderIcon = useCallback(() => {
    return loading ? <ActivityIndicator size="small" color={colors.L30} animating /> : (
      <AppIcon name="draft" size={24} color={colors.L30} />
    );
  }, [loading, colors])
  return (
    <ActionButton
      buttonColor={secondaryAction ? colors.D20 : colors.warn}
      renderIcon={renderIcon}
      onPress={localPress}
      offsetX={s + xs}
      offsetY={NOTCH_BOTTOM_PADDING + s + xs}
      shadowStyle={shadow.large}
      fixNativeFeedbackRadius
    />
  );
}

function FadingCardSearchResult({ item, card, onCardPress, onDraft, draftHistory }: {
  item: GridItem;
  card: Card;
  draftHistory: SharedValue<DraftHistory>;
  onCardPress: (card: Card) => void;
  onDraft: (card: Card, item: GridItem) => void;
}) {
  const { borderStyle } = useContext(StyleContext);
  const actualOnDraft = useCallback((card: Card) => {
    onDraft(card, item);
  }, [onDraft, item]);
  const opacity = useSharedValue(1);
  useAnimatedReaction(() => {
    if (!item.draftCycle || draftHistory.value.cycle < item.draftCycle) {
      return false;
    }
    return !draftHistory.value.code || draftHistory.value.code !== item.code;
  }, (result, previous) => {
    if (result !== previous) {
      opacity.value = result ? withTiming(0, { duration: 250 }) : withTiming(1, { duration: 100 });
    }
  }, [item.draftCycle, item.code, draftHistory]);
  return (
    <Animated.View key={item.key} style={[
      borderStyle,
      { borderTopWidth: StyleSheet.hairlineWidth },
      { opacity },
    ]} entering={item.enterAnimation} exiting={item.exitAnimation}>
      <CardSearchResult
        id={item.key}
        card={card}
        onPress={onCardPress}
        control={{
          type: 'draft',
          onDraft: actualOnDraft,
        }}
      />
    </Animated.View>
  );
}

export default function DeckDraftView({ componentId, id, campaignId }: DeckDraftProps & NavigationProps) {
  const deck = useCampaignDeck(id, campaignId);
  const {
    deckEdits,
    tabooSetId,
    parsedDeck,
    visible,
  } = useParsedDeck(id, componentId);
  const meta = deckEdits?.meta;
  const slots = deckEdits?.slots;
  const problem = parsedDeck?.problem;
  useEffect(() => {
    Navigation.mergeOptions(componentId, navigationOptions({ lightButton: true }));
  }, [componentId]);
  const dispatch = useDispatch();
  const localSlots = useRef<Slots>({ ...(deckEdits?.slots || {}) });
  useEffect(() => {
    if (slots) {
      localSlots.current = { ...slots };
    }
  }, [slots]);
  const initialDraftSize = useSelector((state: AppState) => state.decks.draft?.[id.uuid]?.size || 3);
  const initialDraftCards = useSelector((state: AppState) => state.decks.draft?.[id.uuid]?.current);
  const [draftCards, setLocalDraftCards] = useState<undefined | string[]>(initialDraftCards);
  const draftCycle = useRef<number>(1);

  const updateDraftSize = useCallback((size: number) => dispatch({ type: SET_CURRENT_DRAFT_SIZE, id, size }), [id, dispatch]);

  const setDraftCards = useCallback((current: string[] | undefined) => {
    draftCycle.current = current ? draftCycle.current + 1 : 1;
    setLocalDraftCards(current);
    dispatch({ type: SET_CURRENT_DRAFT, id, current });
  }, [id, dispatch, setLocalDraftCards, draftCycle]);

  const [handSize, incHandSize, decHandSize] = useCounter(initialDraftSize, { min: 2, max: 10, hapticFeedback: true }, updateDraftSize);
  const [in_collection, ignore_collection] = useSelector(getDraftPacks);
  const [editingPack, setEditingPacks] = useState(false);

  const [investigatorBack, allPossibleCodes, cards] = useDraftableCards({
    investigatorCode: deck?.investigator,
    meta,
    tabooSetId,
    in_collection,
    ignore_collection,
    disabled: !visible && editingPack,
  });
  const [deckCards, ] = useLatestDeckCards(deck);
  const possibleCodes = useRef<string[]>([]);
  useEffect(() => {
    if (allPossibleCodes) {
      possibleCodes.current = allPossibleCodes;
    }
  }, [allPossibleCodes]);

  const [alertDialog, showAlert] = useAlertDialog();
  const { listSeperator } = useContext(LanguageContext);
  const onDraftNewCards = useCallback(() => {
    if (!meta || !investigatorBack) {
      return;
    }
    const currentParsedDeck = parseDeck(investigatorBack.code, meta, localSlots.current, {}, {}, {
      ...cards,
      ...deckCards,
    }, listSeperator);
    if (!currentParsedDeck || currentParsedDeck.problem?.reason && currentParsedDeck.problem.reason !== TOO_FEW_CARDS) {
      setDraftCards([]);
      showAlert(
        t`Invalid deck`,
        t`This deck is currently invalid in some way. Please address the issues before continuing the draft.`
      );
      return;
    }
    if (currentParsedDeck.problem?.reason !== TOO_FEW_CARDS) {
      Navigation.pop(componentId);
      return;
    }
    const [draftOptions, newPossibleCodes] = getDraftCards(
      investigatorBack,
      meta,
      localSlots.current,
      handSize,
      possibleCodes.current,
      cards,
      in_collection,
      ignore_collection,
      listSeperator,
      deckCards
    );
    setDraftCards(map(draftOptions, c => c.code));
    possibleCodes.current = newPossibleCodes;
  }, [componentId, deckCards, showAlert, setDraftCards, listSeperator, investigatorBack, meta, handSize, cards, in_collection, ignore_collection]);

  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const backPressed = useCallback(() => Navigation.pop(componentId), [componentId]);
  const draftHistory = useSharedValue<DraftHistory>({ cycle: -1, code: '000' });
  const draftItems = useMemo(() => {
    return map(draftCards, code => {
      return {
        key: `${draftCycle.current}_${code}`,
        code: code,
        enterAnimation: draftCycle.current > 1 ? SlideInLeft.duration(500).delay(500) : undefined,
        exitAnimation: SlideOutDown.duration(500),
        draftCycle: draftCycle.current,
      };
    });
  }, [draftCards]);
  const onRedrawDraftCards = useCallback(() => {
    draftHistory.value = {
      cycle: draftCycle.current,
    };
    onDraftNewCards();
  }, [onDraftNewCards, draftHistory]);

  useEffectUpdate(() => {
    if (draftCards) {
      draftHistory.value = {
        cycle: draftCycle.current,
      }
      setDraftCards(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [in_collection, ignore_collection])

  const onDraft = useCallback((card: Card, item?: GridItem) => {
    ReactNativeHapticFeedback.trigger('impactMedium');
    if (item && item.draftCycle !== undefined) {
      draftHistory.value = {
        cycle: item.draftCycle,
        code: card.code,
      };
    }
    localSlots.current[card.code] = Math.min(
      (localSlots.current[card.code] || 0) + 1,
      card.deck_limit || 0
    );
    setTimeout(() => {
      onDraftNewCards();
    }, 250);
    dispatch(incDeckSlot(id, card.code, card.deck_limit || 0));
  }, [dispatch, draftHistory, id, onDraftNewCards]);

  const gridView = useSettingValue('draft_grid');

  const controlForCard = useCallback((item: GridItem, card: Card, cardWidth: number) => {
    return <DraftButton item={item} card={card} cardWidth={cardWidth} onDraft={onDraft} />
  }, [onDraft]);
  const onCardPress = useCallback((card: Card) => {
    showCard(componentId, card.code, card, colors, { showSpoilers: true });
  }, [componentId, colors]);

  const renderCardItem = useCallback(({ item }: { item: GridItem }) => {
    const card = cards && cards[item.code];
    if (!card) {
      return null;
    }
    return (
      <FadingCardSearchResult
        item={item}
        card={card}
        onCardPress={onCardPress}
        onDraft={onDraft}
        draftHistory={draftHistory}
      />
    );
  }, [cards, onDraft, onCardPress, draftHistory]);
  const showPackChooser = useCallback(() => {
    Navigation.push<CollectionEditProps>(componentId, {
      component: {
        name: 'My.Collection',
        passProps: {
          draftMode: true,
        },
      },
    });
    setTimeout(() => {
      setEditingPacks(true);
    }, 50);

  }, [componentId]);

  useEffect(() => {
    if (visible && editingPack) {
      setEditingPacks(false);
    }
  }, [visible, editingPack, setEditingPacks]);

  return (
    <View style={[backgroundStyle, { flex: 1 }]}>
      <View style={[space.paddingS, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.L20 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[typography.large, typography.dark, space.paddingRightM]}>
            {t`Hand size:`}
          </Text>
          <PlusMinusButtons
            dialogStyle
            onIncrement={incHandSize}
            onDecrement={decHandSize}
            count={handSize}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <DeckButton onPress={showPackChooser} title={t`Choose packs`} icon="deck" shrink />
        </View>
      </View>
      { !allPossibleCodes ? <LoadingSpinner large /> : (
        <>
          { (!draftCards || !draftCards.length) && (
            <View style={[{ flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }]}>
              <View style={space.paddingS}>
                <Text style={typography.text}>
                  { t`This tool lets you build a deck progressively, choosing one card at a time from a limited set of cards.`}
                  {'\n\n'}
                  { t`Each 'hand' of cards is taken at random from all possible cards that are allowed given the current investigator + deckbuilding option choices you have made.`}
                  {'\n\n'}
                  { t`The drafting process will continue until your deck is full, but you can stop or change the settings at any time` }
                </Text>
              </View>
              <View style={[space.paddingSideS, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                <DeckButton
                  color="red"
                  title={t`Begin draft`}
                  onPress={onDraftNewCards}
                  icon="draft"
                  shrink
                />
              </View>
            </View>
          ) }
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
        control="fab"
      />
      <FabDraftButton
        loading={!allPossibleCodes}
        secondaryAction={!!(draftCards && draftCards.length === handSize)}
        onPress={draftCards ? onRedrawDraftCards : onDraftNewCards}
      />
      { alertDialog }
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
