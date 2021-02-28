import React, { useCallback, useContext, useMemo } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { flatMap, find, forEach, map, sortBy } from 'lodash';
import { t } from 'ttag';
import { Action } from 'redux';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import { Deck, Slots, DeckId, getDeckId } from '@actions/types';
import { BODY_OF_A_YITHIAN } from '@app_constants';
import BasicButton from '@components/core/BasicButton';
import CardSectionHeader from '@components/core/CardSectionHeader';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { showDeckModal, showCard } from '@components/nav/helper';
import InvestigatorRow from '@components/core/InvestigatorRow';
import { useDeck } from '@components/core/hooks';
import useCardList from '@components/card/useCardList';
import { saveDeckChanges, SaveDeckChanges } from '@components/deck/actions';
import Card from '@data/types/Card';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import StyleContext from '@styles/StyleContext';
import ArkhamButton from '@components/core/ArkhamButton';
import { TINY_PHONE } from '@styles/sizes';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { UpdateDeckActions } from '@data/remote/decks';

interface ShowDeckButtonProps {
  componentId: string;
  deckId: DeckId;
  investigator: Card;
}

function ShowDeckButton({ componentId, deckId, investigator }: ShowDeckButtonProps) {
  const { colors } = useContext(StyleContext);
  const [deck] = useDeck(deckId);
  const onPress = useCallback(() => {
    if (deck) {
      showDeckModal(
        componentId,
        deck,
        colors,
        investigator,
        { hideCampaign: true }
      );
    }
  }, [componentId, investigator, deck, colors]);

  if (!deck) {
    return null;
  }
  return (
    <ArkhamButton
      variant="outline"
      icon="deck"
      grow
      title={t`View deck`}
      onPress={onPress}
    />
  );
}

interface Props {
  componentId: string;
  id: string;
  campaignState: CampaignStateHelper;
  scenarioState: ScenarioStateHelper;
  investigator: Card;
  deck?: Deck;
  campaignLog: GuidedCampaignLog;
  editable: boolean;
  actions: UpdateDeckActions;
}
type DeckDispatch = ThunkDispatch<AppState, unknown, Action<string>>;

function computeChoiceId(stepId: string, investigator: Card) {
  return `${stepId}#${investigator.code}`;
}

function SaveDeckRow({
  componentId,
  id,
  campaignState,
  scenarioState,
  investigator,
  deck,
  campaignLog,
  editable,
  actions,
}: Props) {
  const { colors } = useContext(StyleContext);
  const { user } = useContext(ArkhamCardsAuthContext);
  const deckDispatch: DeckDispatch = useDispatch();
  const choiceId = useMemo(() => {
    return computeChoiceId(id, investigator);
  }, [id, investigator]);

  const saveCampaignLog = useCallback((deck?: Deck) => {
    scenarioState.setNumberChoices(choiceId, {}, deck ? getDeckId(deck) : undefined);
  }, [scenarioState, choiceId]);

  const [choices, deckChoice] = useMemo(() => scenarioState.numberAndDeckChoices(choiceId), [scenarioState, choiceId]);
  const storyAssetDeltas = useMemo(() => campaignLog.storyAssetChanges(investigator.code), [campaignLog, investigator]);

  const save = useCallback(() => {
    if (deck) {
      const slots: Slots = { ...deck.slots };
      forEach(storyAssetDeltas, (delta, code) => {
        slots[code] = (slots[code] || 0) + delta;
        if (!slots[code]) {
          delete slots[code];
        }
      });
      const changes: SaveDeckChanges = { slots };
      deckDispatch(saveDeckChanges(user, actions, deck, changes) as any).then(saveCampaignLog);
    }
  }, [deck, user, actions, deckDispatch, storyAssetDeltas, saveCampaignLog]);

  const onCardPress = useCallback((card: Card) => {
    showCard(componentId, card.code, card, colors, true);
  }, [componentId, colors]);

  const renderDeltas = useCallback((cards: Card[], deltas: Slots) => {
    return map(
      sortBy(cards, card => card.name),
      card => (
        <CardSearchResult
          key={card.code}
          onPress={onCardPress}
          card={card}
          backgroundColor="transparent"
          control={{
            type: 'count',
            count: deltas[card.code],
            deltaCountMode: true,
          }}
        />
      )
    );
  }, [onCardPress]);

  const storyAssets = useMemo(() => campaignLog.storyAssets(investigator.code), [campaignLog, investigator]);
  const storyAssetCodes = useMemo(() => flatMap(storyAssetDeltas, (count, code) => count !== 0 ? code : []), [storyAssetDeltas]);
  const [storyAssetCards] = useCardList(storyAssetCodes, 'player');
  const storyAssetSection = useMemo(() => {
    if (!storyAssetCards.length) {
      return null;
    }
    return (
      <>
        <CardSectionHeader
          investigator={investigator}
          section={{ superTitle: t`Campaign cards` }}
        />
        { renderDeltas(storyAssetCards, storyAssetDeltas) }
      </>
    );
  }, [storyAssetDeltas, storyAssetCards, renderDeltas, investigator]);

  const saveButton = useMemo(() => {
    if (choices !== undefined || !editable) {
      return null;
    }
    if (deck) {
      return (
        <BasicButton
          title={t`Save deck changes`}
          onPress={save}
        />
      );
    }
    return null;
  }, [choices, editable, deck, save]);

  const campaignSection = useMemo(() => {
    return (
      <>
        { storyAssetSection }
        { saveButton }
      </>
    );
  }, [storyAssetSection, saveButton]);

  const selectDeck = useCallback(() => {
    campaignState.showChooseDeck(investigator);
  }, [campaignState, investigator]);

  const viewDeck = useCallback(() => {
    if (deck) {
      showDeckModal(componentId, deck, colors, investigator, { hideCampaign: true });
    }
  }, [componentId, colors, investigator, deck]);

  const deckButton = useMemo(() => {
    if (deck && deckChoice !== undefined) {
      return (
        <View style={styles.row}>
          <ShowDeckButton
            componentId={componentId}
            deckId={deckChoice}
            investigator={investigator}
          />
        </View>
      );
    }
    if (!editable) {
      return null;
    }
    if (!deck) {
      return (
        <View style={styles.row}>
          <ArkhamButton variant="outline" icon="deck" grow title={t`Select deck`} onPress={selectDeck} />
        </View>
      );
    }
    return (
      <View style={styles.row}>
        <ArkhamButton variant="outline" icon="deck" title={t`View deck`} onPress={viewDeck} />
      </View>
    );
  }, [componentId, deck, editable, investigator, deckChoice, selectDeck, viewDeck]);

  if (!find(storyAssetDeltas, (count: number) => count !== 0)) {
    return null;
  }
  const isYithian = storyAssets && (storyAssets[BODY_OF_A_YITHIAN] || 0) > 0;
  return (
    <InvestigatorRow
      investigator={investigator}
      yithian={isYithian}
      button={deckButton}
      noFactionIcon={TINY_PHONE}
    >
      { campaignSection }
    </InvestigatorRow>
  );
}

SaveDeckRow.choiceId = computeChoiceId;
export default SaveDeckRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'column',
    flex: 1,
  },
});
