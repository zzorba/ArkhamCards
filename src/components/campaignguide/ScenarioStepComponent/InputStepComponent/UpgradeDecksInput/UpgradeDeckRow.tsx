import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { flatMap, forEach, keys, map, sortBy } from 'lodash';
import { t } from 'ttag';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Switch from '@components/core/Switch';
import { Deck, Slots, NumberChoices, DeckId, getDeckId } from '@actions/types';
import BasicListRow from '@components/core/BasicListRow';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import CardSectionHeader from '@components/core/CardSectionHeader';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { showDeckModal, showCard } from '@components/nav/helper';
import InvestigatorRow from '@components/core/InvestigatorRow';
import DeckUpgradeComponent, { DeckUpgradeHandles } from '@components/deck/DeckUpgradeComponent';
import { BODY_OF_A_YITHIAN } from '@app_constants';
import Card from '@data/types/Card';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import StyleContext from '@styles/StyleContext';
import { useCounter, useEffectUpdate, useFlag, useDeck } from '@components/core/hooks';
import useCardList from '@components/card/useCardList';
import DeckButton from '@components/deck/controls/DeckButton';
import space from '@styles/space';
import ArkhamButton from '@components/core/ArkhamButton';
import useDeckUpgrade from '@components/deck/useDeckUpgrade';
import { CreateDeckActions } from '@data/remote/decks';

interface ShowDeckButtonProps {
  componentId: string;
  deckId: DeckId;
  investigator: Card;
  actions: CreateDeckActions;
}

function ShowDeckButton({ componentId, deckId, investigator, actions }: ShowDeckButtonProps) {
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
      icon="deck"
      title={t`View upgrade`}
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
  setUnsavedEdits: (investigator: string, edits: boolean) => void;
  editable: boolean;
  actions: CreateDeckActions;
}

function computeChoiceId(stepId: string, investigator: Card) {
  return `${stepId}#${investigator.code}`;
}

function UpgradeDeckRow({ componentId, id, campaignState, scenarioState, investigator, deck, campaignLog, actions, setUnsavedEdits, editable }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const deckUpgradeComponent = useRef<DeckUpgradeHandles>();
  const earnedXp = useMemo(() => campaignLog.earnedXp(investigator.code), [campaignLog, investigator]);
  const [xpAdjust, incXp, decXp] = useCounter(earnedXp, {});
  const [physicalAdjust, incPhysical, decPhysical] = useCounter(0, {});
  const [mentalAdjust, incMental, decMental] = useCounter(0, {});
  const [killedAdjust, toggleKilled] = useFlag(false);
  const [insaneAdjust, toggleInsane] = useFlag(false);

  const unsavedEdits = useMemo(() => {
    return physicalAdjust !== 0 ||
      mentalAdjust !== 0 ||
      xpAdjust !== earnedXp ||
      killedAdjust ||
      insaneAdjust;
  }, [earnedXp, xpAdjust, physicalAdjust, mentalAdjust, killedAdjust, insaneAdjust]);

  useEffectUpdate(() => {
    setUnsavedEdits(investigator.code, unsavedEdits);
  }, [setUnsavedEdits, investigator, unsavedEdits]);

  const choiceId = useMemo(() => {
    return computeChoiceId(id, investigator);
  }, [id, investigator]);

  const saveCampaignLog = useCallback((xp: number, deck?: Deck) => {
    const choices: NumberChoices = {
      xp: [xp - earnedXp],
      physical: [physicalAdjust],
      mental: [mentalAdjust],
      killed: [killedAdjust ? 1 : 0],
      insane: [insaneAdjust ? 1 : 0],
    };
    scenarioState.setNumberChoices(choiceId, choices, deck ? getDeckId(deck) : undefined);
  }, [scenarioState, earnedXp, choiceId, physicalAdjust, mentalAdjust, killedAdjust, insaneAdjust]);

  const [choices, deckChoice] = useMemo(() => scenarioState.numberAndDeckChoices(choiceId), [scenarioState, choiceId]);

  const xp: number = useMemo(() => {
    if (choices === undefined) {
      return xpAdjust;
    }
    return earnedXp + ((choices.xp && choices.xp[0]) || 0);
  }, [xpAdjust, choices, earnedXp]);

  const physicalTrauma: number = useMemo(() => {
    if (choices === undefined) {
      return physicalAdjust;
    }
    return (choices.physical && choices.physical[0]) || 0;
  }, [choices, physicalAdjust]);

  const mentalTrauma: number = useMemo(() => {
    if (choices === undefined) {
      return mentalAdjust;
    }
    return (choices.mental && choices.mental[0]) || 0;
  }, [choices, mentalAdjust]);
  const killed = useMemo(() => {
    if (choices === undefined) {
      return killedAdjust;
    }
    return !!(choices.killed && choices.killed[0]);
  }, [choices, killedAdjust]);
  const insane = useMemo(() => {
    if (choices === undefined) {
      return insaneAdjust;
    }
    return !!(choices.insane && choices.insane[0]);
  }, [choices, insaneAdjust]);
  const onUpgrade = useCallback((deck: Deck, xp: number) => {
    saveCampaignLog(xp, deck);
  }, [saveCampaignLog]);

  const save = useCallback(() => {
    if (deck) {
      if (deckUpgradeComponent.current) {
        deckUpgradeComponent.current.save();
      }
    } else {
      saveCampaignLog(xpAdjust);
    }
  }, [deck, deckUpgradeComponent, saveCampaignLog, xpAdjust]);

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

  const storyAssetDeltas = useMemo(() => campaignLog.storyAssetChanges(investigator.code), [campaignLog, investigator]);
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

  const xpSection = useMemo(() => {
    const xpString = xp >= 0 ? `+${xp}` : `${xp}`;
    return (
      <>
        <CardSectionHeader
          investigator={investigator}
          section={{ superTitle: t`Experience points` }}
        />
        <BasicListRow>
          <Text style={typography.text}>
            { xpString }
          </Text>
          { choices === undefined && editable && (
            <PlusMinusButtons
              count={xpAdjust}
              onIncrement={incXp}
              onDecrement={decXp}
            />
          ) }
        </BasicListRow>
      </>
    );
  }, [typography, xp, investigator, editable, xpAdjust, incXp, decXp, choices]);
  const baseTrauma = useMemo(() => campaignLog.baseTrauma(investigator.code), [campaignLog, investigator]);
  const traumaDelta = useMemo(() => campaignLog.traumaChanges(investigator.code), [campaignLog, investigator]);

  const traumaSection = useMemo(() => {
    const physical = (traumaDelta.physical || 0) + physicalTrauma;
    const mental = (traumaDelta.mental || 0) + mentalTrauma;
    const totalPhysical = (baseTrauma.physical || 0) + physical;
    const totalMental = (baseTrauma.mental || 0) + mental;

    const physicalDeltaString = physical >= 0 ? `+${physical}` : `${physical}`;
    const mentalDeltaString = mental >= 0 ? `+${mental}` : `${mental}`;
    const locked = (choices !== undefined) || !editable;
    return (
      <>
        { (!locked || physical !== 0 || mental !== 0 || killed || insane) && (
          <CardSectionHeader
            investigator={investigator}
            section={{ superTitle: t`Trauma` }}
          />
        ) }
        { (!locked || physical !== 0) && (
          <>
            <CardSectionHeader
              investigator={investigator}
              section={{ subTitle: t`Physical` }}
            />
            <BasicListRow>
              <Text style={[typography.text]}>
                { physicalDeltaString }
                { !locked && (
                  <Text style={[typography.text, { color: colors.lightText }]}>
                    { t` (New Total: ${totalPhysical})` }
                  </Text>
                ) }
              </Text>
              { !locked && (
                <PlusMinusButtons
                  count={totalPhysical}
                  onIncrement={incPhysical}
                  onDecrement={decPhysical}
                  max={investigator.health || 0}
                  disabled={killedAdjust || insaneAdjust}
                />
              ) }
            </BasicListRow>
          </>
        ) }
        { (!locked || killedAdjust) && (
          <BasicListRow>
            <Text style={[typography.text]}>
              { t`Killed` }
            </Text>
            { !locked ? (
              <Switch
                value={killedAdjust}
                customColor={colors.faction[investigator.factionCode()].background}
                onValueChange={toggleKilled}
                disabled={insaneAdjust}
              />
            ) : (
              <MaterialCommunityIcons
                name="check"
                size={18}
                color={colors.darkText}
              />
            ) }
          </BasicListRow>
        ) }
        { (!locked || mental !== 0) && (
          <>
            <CardSectionHeader
              investigator={investigator}
              section={{ subTitle: t`Mental` }}
            />
            <BasicListRow>
              <Text style={typography.text}>
                { mentalDeltaString }
                { !locked && (
                  <Text style={[typography.text, { color: colors.lightText }]}>
                    { t` (New Total: ${totalMental})` }
                  </Text>
                ) }
              </Text>
              { !locked && (
                <PlusMinusButtons
                  count={totalMental}
                  onIncrement={incMental}
                  onDecrement={decMental}
                  max={(investigator.sanity || 0)}
                  disabled={killedAdjust || insaneAdjust}
                />
              ) }
            </BasicListRow>
          </>
        ) }
        { (!locked || insaneAdjust) && (
          <BasicListRow>
            <Text style={[typography.text]}>
              { t`Insane` }
            </Text>
            { !locked ? (
              <Switch
                customColor={colors.faction[investigator.factionCode()].background}
                value={insaneAdjust}
                onValueChange={toggleInsane}
                disabled={killedAdjust}
              />
            ) : (
              <MaterialCommunityIcons
                name="check"
                size={18}
                color={colors.darkText}
              />
            ) }
          </BasicListRow>
        ) }
      </>
    );
  }, [incMental, decMental, incPhysical, decPhysical, toggleInsane, toggleKilled, investigator,
    colors, typography, baseTrauma, choices, editable, insane, killed, physicalTrauma, mentalTrauma,
    insaneAdjust, killedAdjust, traumaDelta]);
  const [saving, error, saveDeckUpgrade] = useDeckUpgrade(deck, actions, onUpgrade);
  const saveButton = useMemo(() => {
    if (choices !== undefined || !editable || deck) {
      return null;
    }
    if (!unsavedEdits) {
      return null;
    }
    return (
      <View style={space.paddingS}>
        <DeckButton
          icon="upgrade"
          color="gold"
          title={t`Save adjustments`}
          detail={t`Save your changes to the campaign log`}
          onPress={save}
          loading={saving}
        />
      </View>
    );
  }, [choices, editable, deck, save, saving, unsavedEdits]);

  const campaignSection = useMemo(() => {
    return (
      <>
        { (choices !== undefined || !deck) && xpSection }
        { traumaSection }
        { storyAssetSection }
        { saveButton }
      </>
    );
  }, [choices, deck, xpSection, traumaSection, storyAssetSection, saveButton]);

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
            actions={actions}
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
          <ArkhamButton variant="outline" grow icon="deck" title={t`Select deck`} onPress={selectDeck} />
        </View>
      );
    }
    if (choices === undefined) {
      return (
        <View style={[styles.row, space.paddingBottomS]}>
          <DeckButton
            icon="upgrade"
            color="gold"
            title={t`Save deck upgrade`}
            detail={t`Save XP to deck after making adjustments`}
            onPress={save}
            loading={saving}
          />
        </View>
      );
    }
    return (
      <View style={styles.row}>
        <ArkhamButton variant="outline" grow icon="deck" title={t`View deck`} onPress={viewDeck} />
      </View>
    );
  }, [componentId, deck, editable, investigator, actions, deckChoice, choices, saving, save, selectDeck, viewDeck]);

  const storyCountsForDeck = useMemo(() => {
    if (!deck) {
      return {};
    }
    const newSlots: Slots = {};
    forEach(keys(storyAssets), code => {
      const delta = storyAssetDeltas[code];
      if (delta) {
        newSlots[code] = (deck.slots?.[code] || 0) + delta;
      } else {
        newSlots[code] = (deck.slots?.[code] || 0);
      }
      if (newSlots[code] < 0) {
        newSlots[code] = 0;
      }
    });
    forEach(storyAssetDeltas, (delta, code) => {
      if (storyAssets[code] === undefined) {
        if (delta) {
          newSlots[code] = (deck.slots?.[code] || 0) + delta;
        }
      }
    });
    return newSlots;
  }, [deck, storyAssets, storyAssetDeltas]);


  const detailsSection = useMemo(() => {
    if (!deck) {
      return campaignSection;
    }
    if (choices !== undefined || !editable) {
      return campaignSection;
    }
    return (
      <DeckUpgradeComponent
        componentId={componentId}
        ref={deckUpgradeComponent}
        deck={deck}
        investigator={investigator}
        campaignSection={campaignSection}
        startingXp={campaignLog.earnedXp(investigator.code)}
        storyCounts={storyCountsForDeck}
        ignoreStoryCounts={campaignLog.ignoreStoryAssets(investigator.code)}
        saveDeckUpgrade={saveDeckUpgrade}
        saving={saving}
        error={error}
      />
    );
  }, [componentId, deck, investigator, campaignLog, editable, choices, storyCountsForDeck,
    saveDeckUpgrade, saving, error,
    deckUpgradeComponent, campaignSection]);

  const isYithian = storyAssets && (storyAssets[BODY_OF_A_YITHIAN] || 0) > 0;
  return (
    <InvestigatorRow
      investigator={investigator}
      yithian={isYithian}
      button={deckButton}
      noFactionIcon
    >
      { !saving && detailsSection }
    </InvestigatorRow>
  );
}

UpgradeDeckRow.choiceId = computeChoiceId;
export default UpgradeDeckRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'column',
    flex: 1,
  },
});
