import React, { useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';
import { head, find, forEach, map, sum, throttle } from 'lodash';
import { Alert, StyleSheet, View } from 'react-native';
import { Action } from 'redux';
import { useDispatch } from 'react-redux';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';

import { ThunkDispatch } from 'redux-thunk';
import { t } from 'ttag';

import { CampaignId, Deck, getDeckId, OZ, Slots } from '@actions/types';
import Card from '@data/types/Card';
import { updateCampaignWeaknessSet } from './actions';
import BasicButton from '@components/core/BasicButton';
import NavButton from '@components/core/NavButton';
import ToggleFilter from '@components/core/ToggleFilter';
import { saveDeckChanges } from '@components/deck/actions';
import { RANDOM_BASIC_WEAKNESS } from '@app_constants';
import { parseDeck } from '@lib/parseDeck';
import { AppState } from '@reducers';
import { MyDecksSelectorProps } from '@components/campaign/MyDecksSelectorDialog';
import WeaknessDrawComponent from '@components/weakness/WeaknessDrawComponent';
import { xs } from '@styles/space';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useFlag, useInvestigators, useSlots, useLatestDeckCards } from '@components/core/hooks';
import { useCampaign } from '@data/hooks';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useDeckActions } from '@data/remote/decks';
import { useDismissOnCampaignDeleted, useSetCampaignWeaknessSet } from '@data/remote/campaigns';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import LanguageContext from '@lib/i18n/LanguageContext';
import HeaderButton from '@components/core/HeaderButton';

export interface CampaignDrawWeaknessProps {
  campaignId: CampaignId;
  deckSlots?: Slots;
  unsavedAssignedCards?: string[];
  saveWeakness?: (code: string, replaceRandomBasicWeakness: boolean) => void;
  alwaysReplaceRandomBasicWeakness?: boolean;
  investigator?: Card;
}

type DeckDispatch = ThunkDispatch<AppState, unknown, Action>;

function updateSlots(slots: Slots, pendingNextCard: string, replaceRandomBasicWeakness: boolean) {
  const newSlots = { ...slots };
  if (!newSlots[pendingNextCard]) {
    newSlots[pendingNextCard] = 0;
  }
  newSlots[pendingNextCard]++;
  if (replaceRandomBasicWeakness && newSlots[RANDOM_BASIC_WEAKNESS] > 0) {
    newSlots[RANDOM_BASIC_WEAKNESS]--;
    if (!newSlots[RANDOM_BASIC_WEAKNESS]) {
      delete newSlots[RANDOM_BASIC_WEAKNESS];
    }
  }
  return newSlots;
}

export default function CampaignDrawWeaknessDialog() {
  const route = useRoute<RouteProp<RootStackParamList, 'Dialog.CampaignDrawWeakness'>>();
  const navigation = useNavigation();
  const { saveWeakness, campaignId, alwaysReplaceRandomBasicWeakness } = route.params;
  const { borderStyle, colors } = useContext(StyleContext);
  const dispatch: DeckDispatch = useDispatch();
  const deckActions = useDeckActions();
  const { userId } = useContext(ArkhamCardsAuthContext);
  const campaign = useCampaign(campaignId);
  useDismissOnCampaignDeleted(navigation, campaign);

  const investigatorsCodes = useMemo(() => map(campaign?.latestDecks(), d => d.investigator), [campaign]);
  const investigators = useInvestigators(investigatorsCodes);
  const latestDecks = campaign?.latestDecks();
  const playerCount = useMemo(() => {
    if (!campaign) {
      return 0;
    }
    return sum(map(campaign.latestDecks(), deck => {
      if (deck) {
        const investigator = investigators && investigators[deck.investigator];
        if (!investigator) {
          return 0;
        }
        if (!investigator.eliminated(campaign.investigatorTrauma(deck.investigator))) {
          return 1;
        }
      }
      return 0;
    }));
  }, [investigators, campaign]);
  const weaknessSet = campaign?.weaknessSet;

  const [selectedDeck, setSelectedDeck] = useState<LatestDeckT | undefined>(route.params.deckSlots ? undefined : head(latestDecks));
  const [replaceRandomBasicWeakness, toggleReplaceRandomBasicWeakness] = useFlag(true);
  const [saving, setSaving] = useState(false);
  const [pendingNextCard, setPendingNextCard] = useState<string | undefined>();
  const [pendingAssignedCards, updatePendingAssignedCards] = useSlots({});
  const [unsavedAssignedCards, setUnsavedAssignedCards] = useState<string[]>(route.params.unsavedAssignedCards || []);
  const [deckSlots, updateDeckSlots] = useSlots(route.params.deckSlots || {});

  const showEditWeaknessDialog = useCallback(() => {
    navigation.navigate('Dialog.CampaignEditWeakness', { campaignId: route.params.campaignId });
  }, [navigation, route.params.campaignId]);

  const showEditWeaknessDialogPressed = useMemo(() => throttle(showEditWeaknessDialog, 200), [showEditWeaknessDialog]);
  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton
          iconName="dismiss"
          color={colors.M}
          accessibilityLabel={t`Close`}
          onPress={goBack}
        />
      ),
      headerRight: !route.params.deckSlots ? () => (
        <HeaderButton
          iconName="edit"
          color={COLORS.M}
          accessibilityLabel={t`Edit Assigned Weaknesses`}
          onPress={showEditWeaknessDialogPressed}
        />
      ) : undefined,
    })
  }, [route.params.deckSlots, navigation, showEditWeaknessDialogPressed, goBack, colors]);

  const selectDeck = useCallback(async(deck: Deck) => {
    const id = getDeckId(deck);
    const theDeck = find(latestDecks, d => d.id.uuid === id.uuid);
    setSelectedDeck(theDeck);
  }, [setSelectedDeck, latestDecks]);

  const onPressInvestigator = useCallback(() => {
    const passProps: MyDecksSelectorProps = {
      campaignId: route.params.campaignId,
      onDeckSelect: selectDeck,
      selectedDecks: latestDecks,
      onlyShowSelected: true,
      includeParallel: campaign?.cycleCode === OZ,
    };
    navigation.navigate('Dialog.DeckSelector', passProps);
  }, [latestDecks, route.params.campaignId, selectDeck, campaign?.cycleCode, navigation]);

  const updateDrawnCard = useCallback((nextCard: string, assignedCards: Slots) => {
    setPendingNextCard(nextCard);
    updatePendingAssignedCards({ type: 'sync', slots: assignedCards });
  }, [setPendingNextCard, updatePendingAssignedCards]);
  const setCampaignWeaknessSet = useSetCampaignWeaknessSet();
  const [cards] = useLatestDeckCards(saveWeakness ? undefined : selectedDeck, false);
  const { listSeperator } = useContext(LanguageContext);
  const saveDrawnCard = useCallback(() => {
    if (!pendingNextCard) {
      return;
    }
    if (saveWeakness) {
      // We are in 'pending' mode to don't save it immediately.
      saveWeakness(pendingNextCard, replaceRandomBasicWeakness);
      const newSlots = deckSlots && updateSlots(
        deckSlots,
        pendingNextCard,
        replaceRandomBasicWeakness || !!alwaysReplaceRandomBasicWeakness
      );
      updatePendingAssignedCards({ type: 'sync', slots: {} });
      setPendingNextCard(undefined);
      setUnsavedAssignedCards([...unsavedAssignedCards, pendingNextCard]);
      updateDeckSlots({ type: 'sync', slots: newSlots });
      return;
    }
    if (selectedDeck && cards) {
      const newSlots = updateSlots(
        selectedDeck.deck.slots || {},
        pendingNextCard,
        replaceRandomBasicWeakness || !!alwaysReplaceRandomBasicWeakness
      );
      const parsedDeck = parseDeck(
        selectedDeck.deck.investigator_code,
        selectedDeck.deck.meta || {},
        newSlots,
        selectedDeck.deck.ignoreDeckLimitSlots || {},
        selectedDeck.deck.sideSlots || {},
        cards,
        listSeperator,
        selectedDeck. previousDeck,
        undefined,
        selectedDeck.deck
      );
      const problem = parsedDeck && parsedDeck.problem ? parsedDeck.problem.reason : '';

      setSaving(true);
      dispatch(saveDeckChanges(userId, deckActions, selectedDeck.deck, {
        slots: newSlots,
        problem,
        spentXp: parsedDeck && parsedDeck.changes ? parsedDeck.changes.spentXp : 0,
      })).then(() => {
        const newWeaknessSet = {
          packCodes: weaknessSet?.packCodes || [],
          assignedCards: pendingAssignedCards,
        };
        dispatch(updateCampaignWeaknessSet(setCampaignWeaknessSet, campaignId, newWeaknessSet));
        setSaving(false);
        updatePendingAssignedCards({ type: 'sync', slots: {} });
        setPendingNextCard(undefined);
      }, err => {
        setSaving(false);
        Alert.alert(err);
      });
    }
  }, [pendingNextCard, pendingAssignedCards, campaignId, weaknessSet, cards, selectedDeck, replaceRandomBasicWeakness, alwaysReplaceRandomBasicWeakness, deckSlots,
    unsavedAssignedCards, userId, deckActions, listSeperator, setCampaignWeaknessSet, updateDeckSlots, saveWeakness, dispatch, setSaving, updatePendingAssignedCards, setPendingNextCard]);

  const investigatorChooser = useMemo(() => {
    const investigator = selectedDeck && investigators && investigators[selectedDeck.investigator];
    const investigatorName = investigator ? investigator.name : '';
    const message = t`Investigator: ${investigatorName}`;
    const slots = (deckSlots || (selectedDeck && selectedDeck.deck.slots)) || {};
    const hasRandomBasicWeakness = slots[RANDOM_BASIC_WEAKNESS] > 0;
    return (
      <View>
        { !!selectedDeck && (
          <NavButton
            text={message}
            onPress={onPressInvestigator}
          />
        ) }
        { hasRandomBasicWeakness && !alwaysReplaceRandomBasicWeakness && (
          <ToggleFilter
            style={{ ...styles.toggleRow, ...borderStyle }}
            label={t`Replace Random Weakness`}
            setting="replaceRandomBasicWeakness"
            value={replaceRandomBasicWeakness}
            onChange={toggleReplaceRandomBasicWeakness}
          />
        ) }
      </View>
    );
  }, [toggleReplaceRandomBasicWeakness, onPressInvestigator, alwaysReplaceRandomBasicWeakness, borderStyle, investigators, selectedDeck, replaceRandomBasicWeakness, deckSlots]);

  const flippedHeader = useMemo(() => {
    if (!pendingNextCard) {
      return null;
    }
    const investigator = selectedDeck && investigators && investigators[selectedDeck.investigator];
    const buttonText = investigator ?
      t`Save to ${investigator.name}’s Deck` :
      t`Save to Deck`;
    return (
      <BasicButton
        onPress={saveDrawnCard}
        title={buttonText}
      />
    );
  }, [saveDrawnCard, investigators, pendingNextCard, selectedDeck]);

  const assignedCards = useMemo(() => {
    if (!weaknessSet) {
      return {};
    }
    const assignedCards = { ...weaknessSet.assignedCards };
    forEach(unsavedAssignedCards, code => {
      assignedCards[code] = (assignedCards[code] || 0) + 1;
    });
    return assignedCards;
  }, [weaknessSet, unsavedAssignedCards]);

  const dynamicWeaknessSet = useMemo(() => {
    return {
      packCodes: weaknessSet?.packCodes || [],
      assignedCards,
    };
  }, [weaknessSet, assignedCards]);

  if (!weaknessSet) {
    return null;
  }

  const investigator = selectedDeck && investigators && investigators[selectedDeck.investigator];
  return (
    <WeaknessDrawComponent
      playerCount={playerCount}
      campaignMode
      investigator={investigator}
      customHeader={investigatorChooser}
      customFlippedHeader={flippedHeader}
      weaknessSet={dynamicWeaknessSet}
      updateDrawnCard={updateDrawnCard}
      saving={saving}
    />
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    paddingTop: xs,
    width: '100%',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
});
