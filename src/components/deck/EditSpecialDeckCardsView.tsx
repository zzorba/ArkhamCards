import React, { useCallback, useContext, useMemo, useLayoutEffect } from 'react';
import { forEach, keys, map, sortBy } from 'lodash';
import { ScrollView, StyleSheet } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';

import { t } from 'ttag';
import { useDispatch } from 'react-redux';

import CardSelectorComponent from '@components/cardlist/CardSelectorComponent';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { ACE_OF_RODS_CODE } from '@app_constants';
import Card from '@data/types/Card';
import CardSectionHeader from '@components/core/CardSectionHeader';
import ArkhamButton from '@components/core/ArkhamButton';
import { useRequiredCards } from '@components/core/hooks';
import { setIgnoreDeckSlot } from './actions';
import { useParsedDeck, useShowDrawWeakness } from './hooks';
import { useAlertDialog } from './dialogs';
import { CampaignId, DeckId } from '@actions/types';
import StyleContext from '@styles/StyleContext';
import LoadingCardSearchResult from '@components/cardlist/LoadingCardSearchResult';
import { ParsedDeckContextProvider } from './DeckEditContext';
import { getDeckScreenOptions } from '@components/nav/helper';

export interface EditSpecialCardsProps {
  id: DeckId;
  campaignId?: CampaignId;
  assignedWeaknesses?: string[];
  headerBackgroundColor?: string;
}

function EditSpecialDeckCardsView() {
  const route = useRoute<RouteProp<RootStackParamList, 'Deck.EditSpecial'>>();
  const navigation = useNavigation();
  const { id, campaignId, assignedWeaknesses } = route.params;

  const { backgroundStyle, colors } = useContext(StyleContext);
  const dispatch = useDispatch();
  const parsedDeckObj = useParsedDeck(id, 'edit');
  const {
    deckT,
    cards,
    deckEdits,
    deckEditsRef,
    tabooSetId,
    parsedDeck,
    parsedDeckRef,
  } = parsedDeckObj;
  const [requiredCards, requiredCardsLoading] = useRequiredCards(parsedDeck?.investigator, tabooSetId);
  const deckInvestigatorId = deckT?.investigator;

  // Set screen options with proper styling
  useLayoutEffect(() => {
    if (parsedDeck?.investigator) {
      const screenOptions = getDeckScreenOptions(
        colors,
        { title: t`Edit Special Cards` },
        parsedDeck.investigator.front
      );
      navigation.setOptions(screenOptions);
    }
  }, [navigation, colors, parsedDeck?.investigator]);
  const cardPressed = useCallback((card: Card) => {
    navigation.navigate('Card', {
      id: card.code,
      pack_code: card.pack_code,
      showSpoilers: true,
      deckId: id,
      deckInvestigatorId,
      initialCustomizations: parsedDeckRef.current?.customizations,
    });
  }, [navigation, id, deckInvestigatorId, parsedDeckRef]);
  const [alertDialog, showAlert] = useAlertDialog();
  const showDrawWeakness = useShowDrawWeakness({
    deck: deckT,
    id,
    campaignId,
    showAlert,
    deckEditsRef,
    assignedWeaknesses,
  });

  const editStoryPressed = useCallback(() => {
    navigation.navigate('Deck.EditAddCards', {
      id,
      storyOnly: true,
      title: t`Edit Special Cards`,
    });
  }, [navigation, id]);

  const editWeaknessPressed = useCallback(() => {
    navigation.navigate('Deck.EditAddCards', {
      id,
      weaknessOnly: true,
    });
  }, [navigation, id]);

  const isSpecial = useCallback((card: Card) => {
    return !!(card.code === ACE_OF_RODS_CODE || (deckEditsRef.current && deckEditsRef.current.ignoreDeckLimitSlots[card.code] > 0));
  }, [deckEditsRef]);

  const weaknesses = useMemo(() => {
    if (!deckEdits) {
      return [];
    }
    const weaknesses: Card[] = [];
    forEach(keys(deckEdits.slots), code => {
      const card = cards && cards[code];
      if (card && card.subtype_code === 'basicweakness') {
        weaknesses.push(card);
      }
    });
    return weaknesses;
  }, [deckEdits, cards]);

  const basicWeaknessSection = useMemo(() => {
    if (!deckEdits) {
      return null;
    }
    return (
      <>
        <CardSectionHeader section={{ title: t`Basic weakness` }} />
        { map(sortBy(weaknesses, card => card.name), card => (
          <CardSearchResult
            key={card.code}
            card={card}
            onPress={cardPressed}
            control={{
              type: 'count',
              count: deckEdits.slots[card.code] || 0,
            }}
          />
        )) }
        <ArkhamButton
          icon="edit"
          title={t`Edit Weakness Cards`}
          onPress={editWeaknessPressed}
        />
        <ArkhamButton
          icon="card"
          title={t`Draw Basic Weakness`}
          onPress={showDrawWeakness}
        />
      </>
    );
  }, [weaknesses, deckEdits, showDrawWeakness, editWeaknessPressed, cardPressed]);
  const hasDeck = !!deckEdits;
  const investigatorSection = useMemo(() => {
    if (!hasDeck) {
      return null;
    }
    return (
      <>
        <CardSectionHeader section={{ title: t`Investigator` }} />
        { requiredCardsLoading && <LoadingCardSearchResult /> }
        { map(sortBy(requiredCards, card => card.name), card => (
          <CardSearchResult
            key={card.code}
            card={card}
            onPress={cardPressed}
            control={{
              type: 'deck',
              limit: card.deck_limit || 1,
            }}
          />
        )) }
      </>
    );
  }, [cardPressed, hasDeck, requiredCards, requiredCardsLoading]);

  const storyCards = useMemo(() => {
    if (!deckEdits) {
      return [];
    }
    const storyCards: Card[] = [];
    forEach(keys(deckEdits.slots), code => {
      const card = cards && cards[code];
      if (card && card.mythos_card) {
        storyCards.push(card);
      }
    });
    return storyCards;
  }, [deckEdits, cards]);
  const storySection = useMemo(() => {
    if (!deckEdits) {
      return null;
    }
    return (
      <>
        <CardSectionHeader section={{ title: t`Story` }} />
        { map(sortBy(storyCards, card => card.name), card => (
          <CardSearchResult
            key={card.code}
            card={card}
            onPress={cardPressed}
            control={{
              type: 'deck_count',
              count: deckEdits.slots[card.code],
            }}
          />
        )) }
        <ArkhamButton
          icon="edit"
          title={t`Edit Story Cards`}
          onPress={editStoryPressed}
        />
      </>
    );
  }, [deckEdits, storyCards, cardPressed, editStoryPressed]);
  const setIgnoreCardCount = useCallback((card: Card, count: number) => {
    dispatch(setIgnoreDeckSlot(id, card.code, count));
  }, [dispatch, id]);
  const ignoreCardsSection = useMemo(() => {
    if (!deckEdits) {
      return null;
    }
    return (
      <CardSelectorComponent
        slots={deckEdits.slots}
        counts={deckEdits.ignoreDeckLimitSlots}
        updateCount={setIgnoreCardCount}
        filterCard={isSpecial}
        header={<CardSectionHeader section={{ title: t`Do not count towards deck size` }} />}
      />
    );
  }, [setIgnoreCardCount, deckEdits, isSpecial]);

  return (
    <ParsedDeckContextProvider parsedDeckObj={parsedDeckObj}>
      <>
        <ScrollView style={[styles.wrapper, backgroundStyle]}>
          { investigatorSection }
          { ignoreCardsSection }
          { storySection }
          { basicWeaknessSection }
        </ScrollView>
        { alertDialog }
      </>
    </ParsedDeckContextProvider>
  );
}

export default EditSpecialDeckCardsView;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
