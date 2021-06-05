import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { flatMap, find, forEach, keys, map, omit, sortBy } from 'lodash';
import { t } from 'ttag';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Switch from '@components/core/Switch';
import { Deck, Slots, NumberChoices, getDeckId } from '@actions/types';
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
import { useCounter, useEffectUpdate, useFlag, useSlots } from '@components/core/hooks';
import useCardList from '@components/card/useCardList';
import DeckButton from '@components/deck/controls/DeckButton';
import space from '@styles/space';
import ArkhamButton from '@components/core/ArkhamButton';
import useDeckUpgrade from '@components/deck/useDeckUpgrade';
import { DeckActions } from '@data/remote/decks';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import ShowDeckButton from '../ShowDeckButton';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { SpecialXp } from '@data/scenario/types';
import CardSelectorComponent from '@components/cardlist/CardSelectorComponent';

interface Props {
  componentId: string;
  id: string;
  campaignState: CampaignStateHelper;
  scenarioState: ScenarioStateHelper;
  investigator: Card;
  deck?: LatestDeckT;
  campaignLog: GuidedCampaignLog;
  setUnsavedEdits: (investigator: string, edits: boolean) => void;
  editable: boolean;
  actions: DeckActions;
  skipDeckSave?: boolean;
  specialXp?: SpecialXp;
  investigatorCounter?: string;
}

function computeChoiceId(stepId: string, investigator: Card) {
  return `${stepId}#${investigator.code}`;
}


function isExile(card: Card) {
  return !!card.exile;
}

function UpgradeDeckRow({
  componentId,
  investigatorCounter: originalInvestigatorCounter,
  skipDeckSave,
  specialXp,
  id,
  campaignState,
  scenarioState,
  investigator,
  deck,
  campaignLog,
  actions,
  setUnsavedEdits,
  editable,
}: Props) {
  const investigatorCounter = originalInvestigatorCounter || campaignLog.campaignData.redirect_experience || undefined;
  const { colors, typography } = useContext(StyleContext);
  const { userId } = useContext(ArkhamCardsAuthContext);
  const { campaignGuide } = useContext(CampaignGuideContext);
  const deckUpgradeComponent = useRef<DeckUpgradeHandles>();
  const earnedXp = useMemo(() => {
    if (specialXp) {
      return campaignLog.specialXp(investigator.code, specialXp);
    }
    return campaignLog.earnedXp(investigator.code);
  }, [campaignLog, investigator, specialXp]);

  const choiceId = useMemo(() => {
    return computeChoiceId(id, investigator);
  }, [id, investigator]);
  const [choices, deckChoice] = useMemo(() => scenarioState.numberAndDeckChoices(choiceId), [scenarioState, choiceId]);
  const initialSpecialExile = useMemo(() => {
    const slots: Slots = {};
    forEach(omit(choices, ['insane', 'killed', 'count', 'physical', 'mental', 'xp']), (count, exile_code) => {
      if (count.length) {
        slots[exile_code] = count[0];
      }
    });
    return slots;
  }, [choices]);
  const [specialExile, updateSpecialExile] = useSlots(initialSpecialExile);
  const [xpAdjust, incXp, decXp] = useCounter(earnedXp, {});
  const [physicalAdjust, incPhysical, decPhysical] = useCounter(0, {});
  const [mentalAdjust, incMental, decMental] = useCounter(0, {});
  const [killedAdjust, toggleKilled] = useFlag(false);
  const [insaneAdjust, toggleInsane] = useFlag(false);
  const investigatorSection = investigatorCounter ? campaignLog.investigatorSections[investigatorCounter] : undefined;
  const existingCount = useMemo(() => {
    if (!investigatorCounter) {
      return 0;
    }
    const entry = find(investigatorSection?.[investigator.code]?.entries || [], e => e.id === '$count' && e.type === 'count');
    return entry?.type === 'count' ? entry.count : 0;
  }, [investigatorSection, investigator, investigatorCounter]);
  const [countAdjust, incCount, decCount] = useCounter(0, { min: -existingCount });

  const unsavedEdits = useMemo(() => {
    return physicalAdjust !== 0 ||
      mentalAdjust !== 0 ||
      xpAdjust !== earnedXp ||
      killedAdjust ||
      insaneAdjust ||
      countAdjust !== 0 ||
      !!find(specialExile, count => count > 0);
  }, [earnedXp, specialExile, xpAdjust, physicalAdjust, mentalAdjust, killedAdjust, insaneAdjust, countAdjust]);

  useEffectUpdate(() => {
    setUnsavedEdits(investigator.code, unsavedEdits);
  }, [setUnsavedEdits, investigator, unsavedEdits]);

  const saveCampaignLog = useCallback((xp: number, deck?: Deck) => {
    const choices: NumberChoices = {
      xp: [xp - earnedXp],
      physical: [physicalAdjust],
      mental: [mentalAdjust],
      killed: [killedAdjust ? 1 : 0],
      insane: [insaneAdjust ? 1 : 0],
    };
    if (investigatorCounter) {
      choices.count = [countAdjust];
    }
    forEach(specialExile, (count, code) => {
      if (count) {
        choices[code] = [count];
      }
    });
    scenarioState.setNumberChoices(choiceId, choices, !skipDeckSave && deck ? getDeckId(deck) : undefined);
  }, [scenarioState, skipDeckSave, investigatorCounter, specialExile,
    countAdjust, earnedXp, choiceId, physicalAdjust, mentalAdjust, killedAdjust, insaneAdjust,
  ]);

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
    if (deck && !skipDeckSave) {
      if (deckUpgradeComponent.current) {
        deckUpgradeComponent.current.save();
      }
    } else {
      saveCampaignLog(xpAdjust);
    }
  }, [deck, skipDeckSave, saveCampaignLog, xpAdjust]);

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
  const [health, sanity] = useMemo(() => {
    const traumaAndCardData = campaignLog.traumaAndCardData(investigator.code);
    return [investigator.getHealth(traumaAndCardData), investigator.getSanity(traumaAndCardData)];
  }, [campaignLog, investigator]);
  const storyAssetDeltas = useMemo(() => campaignLog.storyAssetChanges(investigator.code), [campaignLog, investigator]);
  const storyAssets = useMemo(() => campaignLog.storyAssets(investigator.code), [campaignLog, investigator]);
  const storyAssetCodes = useMemo(() => flatMap(storyAssetDeltas, (count, code) => count !== 0 ? code : []), [storyAssetDeltas]);
  const allStoryAssetCodes = useMemo(() => flatMap(storyAssets, (count, code) => count > 0 ? code : []), [storyAssets]);
  const [storyAssetCards] = useCardList(storyAssetCodes, 'player');
  const [allStoryAssetCards] = useCardList(allStoryAssetCodes, 'player');
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
                  max={health}
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
                  max={sanity}
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
    health, sanity,
    colors, typography, baseTrauma, choices, editable, insane, killed, physicalTrauma, mentalTrauma,
    insaneAdjust, killedAdjust, traumaDelta]);
  const [saving, error, saveDeckUpgrade] = useDeckUpgrade(deck, actions, onUpgrade);
  const saveButton = useMemo(() => {
    if (choices !== undefined || !editable || (!skipDeckSave && deck)) {
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
  }, [choices, skipDeckSave, editable, deck, save, saving, unsavedEdits]);

  const count: number = useMemo(() => {
    if (choices === undefined) {
      return countAdjust;
    }
    return (choices.count && choices.count[0]) || 0;
  }, [choices, countAdjust]);

  const customCountsSection = useMemo(() => {
    if (!investigatorCounter) {
      return null;
    }
    const section = find(campaignGuide.campaignLogSections(), s => s.id === investigatorCounter);
    if (!section) {
      return null;
    }
    const newTotal = count + existingCount;
    const locked = (choices !== undefined) || !editable;
    const deltaString = count >= 0 ? `+${count}` : `${count}`;
    return (
      <>
        <CardSectionHeader
          investigator={investigator}
          section={{
            superTitle: campaignLog.campaignData.redirect_experience ? t`${section.title} (from XP)` : section.title,
          }}
        />
        <BasicListRow>
          <Text style={[typography.text]}>
            { deltaString }
          </Text>
          { !locked && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Text style={[typography.text, { color: colors.lightText }, space.marginRightS]}>
                { t` (New Total: ${newTotal})` }
              </Text>
              <PlusMinusButtons
                count={newTotal}
                onIncrement={incCount}
                onDecrement={decCount}
                min={0}
              />
            </View>
          ) }
        </BasicListRow>
      </>
    );
  }, [investigatorCounter, editable, investigator, incCount, decCount, campaignLog.campaignData,
    choices, count, existingCount, campaignGuide, colors, typography]);
  const updateSpecialExileCount = useCallback((card: Card, value: number) => {
    updateSpecialExile({
      type: 'set-slot',
      code: card.code,
      value,
    });
  }, [updateSpecialExile]);
  const specialExileSlots = useMemo(() => {
    const slots: Slots = {};
    forEach(allStoryAssetCards, (card) => {
      if ((!deck || card.custom()) && !!card.exile && storyAssets[card.code]) {
        slots[card.code] = storyAssets[card.code];
      }
    });
    return slots;
  }, [allStoryAssetCards, storyAssets, deck]);
  const exileSection = useMemo(() => {
    if (!keys(specialExileSlots).length) {
      return null;
    }
    return (
      <CardSelectorComponent
        componentId={componentId}
        slots={specialExileSlots}
        counts={specialExile}
        filterCard={isExile}
        updateCount={updateSpecialExileCount}
        header={(choices !== undefined || !deck) && (
          <CardSectionHeader
            section={{ superTitle: choices !== undefined ? t`Exiled story cards` : t`Exile story cards` }}
            investigator={investigator}
          />
        )}
        locked={!!choices}
      />
    );
  }, [componentId, investigator, choices, specialExile, updateSpecialExileCount, specialExileSlots, deck]);

  const campaignSection = useMemo(() => {
    return (
      <>
        { (choices !== undefined || skipDeckSave || !deck) && (!campaignLog.campaignData.redirect_experience) && xpSection }
        { customCountsSection }
        { traumaSection }
        { storyAssetSection }
        { (choices !== undefined || !deck) && exileSection }
        { saveButton }
      </>
    );
  }, [deck, skipDeckSave, campaignLog.campaignData.redirect_experience, exileSection, choices, xpSection, traumaSection, storyAssetSection, customCountsSection, saveButton]);

  const selectDeck = useCallback(() => {
    campaignState.showChooseDeck(investigator);
  }, [campaignState, investigator]);

  const { campaign } = useContext(CampaignGuideContext);
  const viewDeck = useCallback(() => {
    if (deck) {
      showDeckModal(deck.id, deck.deck, campaign?.id, colors, investigator);
    }
  }, [colors, investigator, deck, campaign]);

  const deckButton = useMemo(() => {
    if (deck && !skipDeckSave && deckChoice !== undefined) {
      return (
        <View style={styles.row}>
          <ShowDeckButton
            deckId={deckChoice}
            investigator={investigator}
          />
        </View>
      );
    }
    if (!editable || skipDeckSave) {
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
      if (deck.owner && userId && deck.owner.id !== userId) {
        return (
          <View style={[styles.row, space.paddingBottomS]}>
            <DeckButton
              icon="upgrade"
              color="light_gray"
              title={t`Save deck upgrade`}
              detail={deck.owner.handle ? t`${deck.owner.handle} must save this upgrade` : t`Your friend must save this upgrade`}
              disabled
            />
          </View>
        );
      }
      return (
        <View style={[styles.row, space.paddingBottomS]}>
          <DeckButton
            icon="upgrade"
            color="gold"
            title={t`Save deck upgrade`}
            detail={saving ? t`Saving` : t`Save XP to deck after making adjustments`}
            onPress={save}
            loading={saving}
            disabled={saving}
          />
        </View>
      );
    }
    return (
      <View style={styles.row}>
        <ArkhamButton variant="outline" grow icon="deck" title={t`View deck`} onPress={viewDeck} />
      </View>
    );
  }, [deck, editable, investigator, skipDeckSave, userId, deckChoice, choices, saving, save, selectDeck, viewDeck]);

  const storyCountsForDeck = useMemo(() => {
    if (!deck) {
      return {};
    }
    const newSlots: Slots = {};
    forEach(keys(storyAssets), code => {
      const delta = storyAssetDeltas[code];
      if (delta) {
        newSlots[code] = (deck.deck.slots?.[code] || 0) + delta;
      } else {
        newSlots[code] = (deck.deck.slots?.[code] || 0);
      }
      if (newSlots[code] < 0) {
        newSlots[code] = 0;
      }
    });
    forEach(storyAssetDeltas, (delta, code) => {
      if (storyAssets[code] === undefined) {
        if (delta) {
          newSlots[code] = (deck.deck.slots?.[code] || 0) + delta;
        }
      }
    });
    return newSlots;
  }, [deck, storyAssets, storyAssetDeltas]);

  const detailsSection = useMemo(() => {
    if (!deck || skipDeckSave) {
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
        hideXp={!!campaignLog.campaignData.redirect_experience}
        investigator={investigator}
        campaignSection={campaignSection}
        exileSection={exileSection}
        startingXp={campaignLog.earnedXp(investigator.code)}
        storyCounts={storyCountsForDeck}
        ignoreStoryCounts={campaignLog.ignoreStoryAssets(investigator.code)}
        saveDeckUpgrade={saveDeckUpgrade}
        saving={saving}
        error={error}
      />
    );
  }, [componentId, deck, investigator, campaignLog, editable, skipDeckSave,
    exileSection, choices, storyCountsForDeck, saving, error, saveDeckUpgrade,
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
