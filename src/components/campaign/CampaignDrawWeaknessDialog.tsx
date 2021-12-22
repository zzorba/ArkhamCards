import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { head, find, forEach, map, sum, throttle } from 'lodash';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { Action } from 'redux';
import { useDispatch } from 'react-redux';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { ThunkDispatch } from 'redux-thunk';
import { t } from 'ttag';

import { CampaignId, Deck, getDeckId, Slots } from '@actions/types';
import { updateCampaignWeaknessSet } from './actions';
import { NavigationProps } from '@components/nav/types';
import BasicButton from '@components/core/BasicButton';
import NavButton from '@components/core/NavButton';
import ToggleFilter from '@components/core/ToggleFilter';
import { saveDeckChanges } from '@components/deck/actions';
import { RANDOM_BASIC_WEAKNESS } from '@app_constants';
import { iconsMap } from '@app/NavIcons';
import { parseDeck } from '@lib/parseDeck';
import { AppState } from '@reducers';
import { MyDecksSelectorProps } from '@components/campaign/MyDecksSelectorDialog';
import WeaknessDrawComponent from '@components/weakness/WeaknessDrawComponent';
import { CampaignEditWeaknessProps } from './CampaignEditWeaknessDialog';
import { xs } from '@styles/space';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useFlag, useInvestigatorCards, useNavigationButtonPressed, usePlayerCards, useSlots } from '@components/core/hooks';
import { useCampaign } from '@data/hooks';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useDeckActions } from '@data/remote/decks';
import { useSetCampaignWeaknessSet } from '@data/remote/campaigns';
import LatestDeckT from '@data/interfaces/LatestDeckT';

export interface CampaignDrawWeaknessProps {
  campaignId: CampaignId;
  deckSlots?: Slots;
  unsavedAssignedCards?: string[];
  saveWeakness?: (code: string, replaceRandomBasicWeakness: boolean) => void;
}

type Props = NavigationProps & CampaignDrawWeaknessProps;

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

export default function CampaignDrawWeaknessDialog(props: Props) {
  const { saveWeakness, componentId, campaignId } = props;
  const { borderStyle } = useContext(StyleContext);
  const dispatch: DeckDispatch = useDispatch();
  const deckActions = useDeckActions();
  const { userId } = useContext(ArkhamCardsAuthContext);
  const campaign = useCampaign(campaignId);
  campaign?.latestDecks
  const investigators = useInvestigatorCards();
  const cards = usePlayerCards();
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

  const [selectedDeck, setSelectedDeck] = useState<LatestDeckT | undefined>(props.deckSlots ? undefined : head(latestDecks));
  const [replaceRandomBasicWeakness, toggleReplaceRandomBasicWeakness] = useFlag(true);
  const [saving, setSaving] = useState(false);
  const [pendingNextCard, setPendingNextCard] = useState<string | undefined>();
  const [pendingAssignedCards, updatePendingAssignedCards] = useSlots({});
  const [unsavedAssignedCards, setUnsavedAssignedCards] = useState<string[]>(props.unsavedAssignedCards || []);
  const [deckSlots, updateDeckSlots] = useSlots(props.deckSlots || {});

  const showEditWeaknessDialog = useCallback(() => {
    Navigation.push<CampaignEditWeaknessProps>(componentId, {
      component: {
        name: 'Dialog.CampaignEditWeakness',
        passProps: {
          campaignId: props.campaignId,
        },
      },
    });
  }, [componentId, props.campaignId]);

  const showEditWeaknessDialogPressed = useMemo(() => throttle(showEditWeaknessDialog, 200), [showEditWeaknessDialog]);
  useEffect(() => {
    if (!props.deckSlots) {
      Navigation.mergeOptions(componentId, {
        topBar: {
          rightButtons: [{
            icon: iconsMap.edit,
            id: 'edit',
            color: COLORS.M,
            accessibilityLabel: t`Edit Assigned Weaknesses`,
          }],
        },
      });
    }
  }, [props.deckSlots, componentId]);
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'edit') {
      showEditWeaknessDialogPressed();
    }
  }, componentId, [showEditWeaknessDialogPressed]);

  const selectDeck = useCallback(async(deck: Deck) => {
    const id = getDeckId(deck);
    const theDeck = find(latestDecks, d => d.id.uuid === id.uuid);
    setSelectedDeck(theDeck);
  }, [setSelectedDeck, latestDecks]);

  const onPressInvestigator = useCallback(() => {
    const passProps: MyDecksSelectorProps = {
      campaignId: props.campaignId,
      onDeckSelect: selectDeck,
      selectedDecks: latestDecks,
      onlyShowSelected: true,
    };
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'Dialog.DeckSelector',
            passProps,
            options: {
              modalPresentationStyle: Platform.OS === 'ios' ?
                OptionsModalPresentationStyle.fullScreen :
                OptionsModalPresentationStyle.overCurrentContext,
            },
          },
        }],
      },
    });
  }, [latestDecks, props.campaignId, selectDeck]);

  const updateDrawnCard = useCallback((nextCard: string, assignedCards: Slots) => {
    setPendingNextCard(nextCard);
    updatePendingAssignedCards({ type: 'sync', slots: assignedCards });
  }, [setPendingNextCard, updatePendingAssignedCards]);
  const setCampaignWeaknessSet = useSetCampaignWeaknessSet();
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
        replaceRandomBasicWeakness
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
        replaceRandomBasicWeakness
      );
      const parsedDeck = parseDeck(
        selectedDeck.deck,
        selectedDeck.deck.meta || {},
        newSlots,
        selectedDeck.deck.ignoreDeckLimitSlots || {},
        selectedDeck.deck.sideSlots || {},
        cards,
        selectedDeck. previousDeck
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
  }, [pendingNextCard, pendingAssignedCards, campaignId, weaknessSet, cards, selectedDeck, replaceRandomBasicWeakness, deckSlots,
    unsavedAssignedCards, userId, deckActions, setCampaignWeaknessSet, updateDeckSlots, saveWeakness, dispatch, setSaving, updatePendingAssignedCards, setPendingNextCard]);

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
        { hasRandomBasicWeakness && (
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
  }, [toggleReplaceRandomBasicWeakness, onPressInvestigator, borderStyle, investigators, selectedDeck, replaceRandomBasicWeakness, deckSlots]);

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

  return (
    <WeaknessDrawComponent
      componentId={componentId}
      playerCount={playerCount}
      campaignMode
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
