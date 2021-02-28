import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { head, forEach, map, sum, throttle } from 'lodash';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { Action } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';

import { t } from 'ttag';
import { CampaignId, Deck, DeckId, getDeckId, Slots } from '@actions/types';
import { updateCampaign } from './actions';
import { NavigationProps } from '@components/nav/types';
import BasicButton from '@components/core/BasicButton';
import NavButton from '@components/core/NavButton';
import ToggleFilter from '@components/core/ToggleFilter';
import { saveDeckChanges } from '@components/deck/actions';
import { RANDOM_BASIC_WEAKNESS } from '@app_constants';
import { iconsMap } from '@app/NavIcons';
import { parseDeck } from '@lib/parseDeck';
import { getAllDecks, AppState, getDeck } from '@reducers';
import { MyDecksSelectorProps } from '@components/campaign/MyDecksSelectorDialog';
import WeaknessDrawComponent from '../weakness/WeaknessDrawComponent';
import { CampaignEditWeaknessProps } from './CampaignEditWeaknessDialog';
import { xs } from '@styles/space';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { ThunkDispatch } from 'redux-thunk';
import { useCampaignLatestDeckIds, useFlag, useInvestigatorCards, useNavigationButtonPressed, usePlayerCards, useSlots } from '@components/core/hooks';
import { useCampaign } from '@data/remote/hooks';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useUpdateDeckActions } from '@data/remote/decks';

export interface CampaignDrawWeaknessProps {
  campaignId: CampaignId;
  deckSlots?: Slots;
  unsavedAssignedCards?: string[];
  saveWeakness?: (code: string, replaceRandomBasicWeakness: boolean) => void;
}

type Props = NavigationProps & CampaignDrawWeaknessProps;

type DeckDispatch = ThunkDispatch<AppState, unknown, Action>;
const EMPTY_WEAKNESS_SET = { packCodes: [], assignedCards: {} };

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
  const deckActions = useUpdateDeckActions();
  const { user } = useContext(ArkhamCardsAuthContext);
  const campaign = useCampaign(campaignId);
  const latestDeckIds = useCampaignLatestDeckIds(campaign);
  const decks = useSelector(getAllDecks);
  const investigators = useInvestigatorCards();
  const cards = usePlayerCards();

  const playerCount = useMemo(() => {
    if (!campaign) {
      return 0;
    }
    return sum(map(latestDeckIds, deckId => {
      const deck = getDeck(decks, deckId);
      if (deck) {
        const investigator = investigators && investigators[deck.investigator_code];
        if (!investigator) {
          return 0;
        }
        if (!investigator.eliminated(campaign.investigatorData?.[deck.investigator_code])) {
          return 1;
        }
      }
      return 0;
    }));
  }, [investigators, latestDeckIds, campaign, decks]);
  const weaknessSet = useMemo(() => campaign ? campaign.weaknessSet : EMPTY_WEAKNESS_SET, [campaign]);

  const [selectedDeckId, setSelectedDeckId] = useState<DeckId | undefined>(props.deckSlots ? undefined : head(latestDeckIds));
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

  const selectDeck = useCallback((deck: Deck) => {
    setSelectedDeckId(getDeckId(deck));
  }, [setSelectedDeckId]);

  const onPressInvestigator = useCallback(() => {
    const passProps: MyDecksSelectorProps = {
      campaignId: props.campaignId,
      onDeckSelect: selectDeck,
      selectedDeckIds: latestDeckIds,
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
  }, [latestDeckIds, props.campaignId, selectDeck]);

  const updateDrawnCard = useCallback((nextCard: string, assignedCards: Slots) => {
    setPendingNextCard(nextCard);
    updatePendingAssignedCards({ type: 'sync', slots: assignedCards });
  }, [setPendingNextCard, updatePendingAssignedCards]);

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
    const deck = selectedDeckId && getDeck(decks, selectedDeckId);
    if (deck && cards) {
      const previousDeck = deck.previousDeckId ? getDeck(decks, deck.previousDeckId) : undefined;
      const newSlots = updateSlots(
        deck.slots || {},
        pendingNextCard,
        replaceRandomBasicWeakness
      );
      const parsedDeck = parseDeck(
        deck,
        deck.meta || {},
        newSlots,
        deck.ignoreDeckLimitSlots || {},
        cards,
        previousDeck
      );
      const problem = parsedDeck && parsedDeck.problem ? parsedDeck.problem.reason : '';

      setSaving(true);
      dispatch(saveDeckChanges(user, deckActions, deck, {
        slots: newSlots,
        problem,
        spentXp: parsedDeck && parsedDeck.changes ? parsedDeck.changes.spentXp : 0,
      })).then(() => {
        const newWeaknessSet = {
          packCodes: weaknessSet?.packCodes || [],
          assignedCards: pendingAssignedCards,
        };
        dispatch(updateCampaign(user, campaignId, { weaknessSet: newWeaknessSet }));
        setSaving(false);
        updatePendingAssignedCards({ type: 'sync', slots: {} });
        setPendingNextCard(undefined);
      }, err => {
        setSaving(false);
        Alert.alert(err);
      });
    }
  }, [pendingNextCard, pendingAssignedCards, campaignId, weaknessSet, decks, cards, selectedDeckId, replaceRandomBasicWeakness, deckSlots,
    unsavedAssignedCards, user, deckActions, updateDeckSlots, saveWeakness, dispatch, setSaving, updatePendingAssignedCards, setPendingNextCard]);

  const investigatorChooser = useMemo(() => {
    const deck = selectedDeckId && getDeck(decks, selectedDeckId);
    const investigator = deck && investigators && investigators[deck.investigator_code];
    const investigatorName = investigator ? investigator.name : '';
    const message = t`Investigator: ${investigatorName}`;
    const slots = (deckSlots || (deck && deck.slots)) || {};
    const hasRandomBasicWeakness = slots[RANDOM_BASIC_WEAKNESS] > 0;
    return (
      <View>
        { !!selectedDeckId && (
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
  }, [toggleReplaceRandomBasicWeakness, onPressInvestigator, borderStyle, decks, investigators, selectedDeckId, replaceRandomBasicWeakness, deckSlots]);

  const flippedHeader = useMemo(() => {
    if (!pendingNextCard) {
      return null;
    }
    const deck = selectedDeckId && getDeck(decks, selectedDeckId);
    const investigator = deck && investigators && investigators[deck.investigator_code];
    const buttonText = investigator ?
      t`Save to ${investigator.name}’s Deck` :
      t`Save to Deck`;
    return (
      <BasicButton
        onPress={saveDrawnCard}
        title={buttonText}
      />
    );
  }, [saveDrawnCard, decks, investigators, pendingNextCard, selectedDeckId]);

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
