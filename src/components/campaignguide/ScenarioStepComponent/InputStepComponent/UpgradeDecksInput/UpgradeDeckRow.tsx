import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { flatMap, find, forEach, keys, map, omit, sortBy } from 'lodash';
import { t } from 'ttag';

import { Deck, Slots, NumberChoices, getDeckId } from '@actions/types';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { showCard } from '@components/nav/helper';
import { BODY_OF_A_YITHIAN } from '@app_constants';
import Card from '@data/types/Card';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import StyleContext from '@styles/StyleContext';
import { useCounter, useEffectUpdate, useFlag, useSlots } from '@components/core/hooks';
import useCardList from '@components/card/useCardList';
import space, { s, xs } from '@styles/space';
import useDeckUpgrade from '@components/deck/useDeckUpgrade';
import { DeckActions } from '@data/remote/decks';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import ShowDeckButton from '../ShowDeckButton';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { SpecialXp } from '@data/scenario/types';
import CardSelectorComponent from '@components/cardlist/CardSelectorComponent';
import { AnimatedCompactInvestigatorRow } from '@components/core/CompactInvestigatorRow';
import HealthSanityIcon from '@components/core/HealthSanityIcon';
import AppIcon from '@icons/AppIcon';
import COLORS from '@styles/colors';
import ActionButton from '@components/campaignguide/prompts/ActionButton';
import ExileCardSelectorComponent from '@components/campaign/ExileCardSelectorComponent';
import DeckSlotHeader from '@components/deck/section/DeckSlotHeader';
import { fetchPrivateDeck } from '@components/deck/actions';
import EncounterIcon from '@icons/EncounterIcon';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { TINY_PHONE } from '@styles/sizes';
import { useDispatch } from 'react-redux';
import { useDeck } from '@data/hooks';

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

function deckMessage(saved: boolean, hasDeck: boolean, hasChanges: boolean) {
  if (saved) {
    return t`Changes have been recorded.`;
  }
  if (!hasDeck) {
    if (!hasChanges) {
      return t`No adjustments need saving.`;
    }
    return t`When you have finished making adjustments, press the 'Save' button to record your changes.`;
  }
  return t`This deck will be upgraded with XP and any new story cards will be added or removed as specified.`;
}

function CounterRow({
  icon,
  title,
  count,
  total,
  inc,
  dec,
  max,
  min,
  editable,
  disabled,
  bottomBorder,
  hideTotal,
}: {
  editable: boolean;
  icon?: React.ReactNode;
  title: string;
  count: number;
  total: number;
  inc: () => void;
  dec: () => void;
  max?: number;
  min?: number;
  disabled?: boolean;
  bottomBorder?: boolean;
  hideTotal?: boolean;
}) {
  const { borderStyle, colors, typography } = useContext(StyleContext);
  const description = useMemo(() => {
    if (!editable) {
      return null;
    }
    return (
      <View style={[styles.startRow, space.paddingRightS]}>
        <Text style={typography.text}>
          { count }
        </Text>
        { !hideTotal && (
          <Text style={[typography.small, { color: colors.lightText }]}>
            { t` (new total: ${total})` }
          </Text>
        ) }
      </View>
    );
  }, [editable, total, colors, typography, hideTotal, count]);
  return (
    <View style={[
      styles.betweenRow,
      space.paddingTopS,
      space.paddingBottomS,
      space.paddingLeftXs,
      space.paddingRightXs,
      space.marginSideS,
      bottomBorder ? { borderBottomWidth: StyleSheet.hairlineWidth } : undefined,
      borderStyle,
    ]}>
      <View style={styles.column}>
        <View style={styles.startRow}>
          { icon }
          <Text style={[typography.small, typography.italic]}>
            { title }
          </Text>
        </View>
        { !!TINY_PHONE && <View style={space.paddingTopXs}>{description}</View> }
      </View>
      <View style={styles.endRow}>
        { !TINY_PHONE && description }
        { editable ? (
          <PlusMinusButtons
            count={total}
            countRender={(
              <Text style={[typography.counter, typography.center, { minWidth: 28 }]}>
                { count }
              </Text>
            )}
            onIncrement={inc}
            onDecrement={dec}
            showZeroCount
            min={min}
            max={max}
            disabled={disabled}
            rounded
            dialogStyle
          />
        ) : (
          <Text style={[typography.counter, { color: colors.lightText }]}>
            { total }
          </Text>
        ) }
      </View>
    </View>
  );
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
  const { colors, typography, width } = useContext(StyleContext);
  const dispatch = useDispatch();
  const { userId, arkhamDbUser } = useContext(ArkhamCardsAuthContext);
  const { campaignGuide } = useContext(CampaignGuideContext);
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
  const savedDeck = useDeck(deckChoice, choices !== undefined);
  const savedExileCounts = useMemo(() => {
    if (!savedDeck || !savedDeck.deck.exile_string) {
      return {};
    }
    const slots: Slots = {};
    forEach(savedDeck.deck.exile_string.split(','), code => {
      if (!slots[code]) {
        slots[code] = 0;
      }
      slots[code]++;
    });
    return slots;
  }, [savedDeck]);
  const initialSpecialExile = useMemo(() => {
    if (!choices) {
      return {};
    }
    const slots: Slots = {};
    forEach(omit(choices, ['insane', 'killed', 'count', 'physical', 'mental', 'xp']), (count, exile_code) => {
      if (count.length) {
        slots[exile_code] = count[0];
      }
    });
    return slots;
  }, [choices]);
  const existingCount = useMemo(() => {
    if (!investigatorCounter) {
      return 0;
    }
    const investigatorSection = investigatorCounter ? campaignLog.investigatorSections[investigatorCounter] : undefined;
    const entry = find(investigatorSection?.[investigator.code]?.entries || [], e => e.id === '$count' && e.type === 'count');
    return entry?.type === 'count' ? entry.count : 0;
  }, [campaignLog.investigatorSections, investigator, investigatorCounter]);
  const [countAdjust, incCount, decCount] = useCounter(0, { min: -existingCount });
  const [physicalAdjust, incPhysical, decPhysical] = useCounter(0, {});
  const [mentalAdjust, incMental, decMental] = useCounter(0, {});
  const [xpAdjust, incXp, decXp] = useCounter(earnedXp, { min: 0 });
  const [specialExile, updateSpecialExile] = useSlots(initialSpecialExile);
  const [exileCounts, updateExileCounts] = useSlots({});
  const onExileCountChange = useCallback((card: Card, count: number) => {
    updateExileCounts({ type: 'set-slot', code: card.code, value: count });
  }, [updateExileCounts]);

  const saveCampaignLog = useCallback((xp: number, deck?: Deck) => {
    const choices: NumberChoices = {
      xp: [xp - earnedXp],
      physical: [physicalAdjust],
      mental: [mentalAdjust],
      // Removed fields:
      // killed: [0 / 1],
      // insane: [0 / 1],
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
  }, [scenarioState, skipDeckSave, investigatorCounter, specialExile, countAdjust, earnedXp, choiceId, physicalAdjust, mentalAdjust]);

  const onUpgrade = useCallback((deck: Deck, xp: number) => {
    saveCampaignLog(xp, deck);
  }, [saveCampaignLog]);
  const [saving, error, saveDeckUpgrade] = useDeckUpgrade(deck, actions, onUpgrade);
  useEffect(() => {
    // We only want to save once.
    if (choices === undefined && !skipDeckSave && deck && !deck.id.local && deck.id.arkhamdb_user === arkhamDbUser) {
      dispatch(fetchPrivateDeck(userId, actions, deck.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const unsavedEdits = useMemo(() => {
    return physicalAdjust !== 0 ||
      mentalAdjust !== 0 ||
      xpAdjust !== earnedXp ||
      countAdjust !== 0 ||
      !!find(specialExile, count => count > 0);
  }, [earnedXp, specialExile, xpAdjust, physicalAdjust, mentalAdjust, countAdjust]);

  useEffectUpdate(() => {
    setUnsavedEdits(investigator.code, unsavedEdits);
  }, [setUnsavedEdits, investigator, unsavedEdits]);

  const xp: number = useMemo(() => {
    if (choices === undefined) {
      if (!editable) {
        return earnedXp;
      }
      return xpAdjust;
    }
    return earnedXp + ((choices.xp && choices.xp[0]) || 0);
  }, [xpAdjust, choices, earnedXp, editable]);

  const physicalTrauma: number = useMemo(() => {
    if (choices === undefined) {
      if (!editable) {
        return 0;
      }
      return physicalAdjust;
    }
    return (choices.physical && choices.physical[0]) || 0;
  }, [choices, physicalAdjust, editable]);

  const mentalTrauma: number = useMemo(() => {
    if (choices === undefined) {
      if (!editable) {
        return 0;
      }
      return mentalAdjust;
    }
    return (choices.mental && choices.mental[0]) || 0;
  }, [choices, mentalAdjust, editable]);
  const storyAssets = useMemo(() => campaignLog.storyAssets(investigator.code), [campaignLog, investigator]);
  const storyAssetDeltas = useMemo(() => campaignLog.storyAssetChanges(investigator.code), [campaignLog, investigator]);
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
  const saveDeck = useCallback(() => {
    saveDeckUpgrade(xp, storyCountsForDeck, campaignLog.ignoreStoryAssets(investigator.code), exileCounts);
  }, [saveDeckUpgrade, xp, storyCountsForDeck, campaignLog, exileCounts, investigator.code]);
  const save = useCallback(() => {
    if (deck && !skipDeckSave) {
      saveDeck();
    } else {
      saveCampaignLog(xpAdjust);
    }
  }, [deck, skipDeckSave, saveCampaignLog, xpAdjust, saveDeck]);


  const onCardPress = useCallback((card: Card) => {
    showCard(componentId, card.code, card, colors, true);
  }, [componentId, colors]);

  const renderDeltas = useCallback((cards: Card[], deltas: Slots) => {
    return map(
      sortBy(cards, card => card.name),
      (card, idx) => (
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
          noBorder={idx === cards.length - 1}
        />
      )
    );
  }, [onCardPress]);
  const [health, sanity] = useMemo(() => {
    const traumaAndCardData = campaignLog.traumaAndCardData(investigator.code);
    return [investigator.getHealth(traumaAndCardData), investigator.getSanity(traumaAndCardData)];
  }, [campaignLog, investigator]);
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
        <View style={space.paddingSideS}><DeckSlotHeader title={t`Campaign cards`} first /></View>
        { renderDeltas(storyAssetCards, storyAssetDeltas) }
      </>
    );
  }, [storyAssetDeltas, storyAssetCards, renderDeltas]);

  const xpSection = useMemo(() => {
    const xpString = xp >= 0 ? `+${xp}` : `${xp}`;
    return (
      <View style={[space.marginS, styles.xpBlock, styles.betweenRow, { backgroundColor: colors.upgrade }]}>
        <View style={styles.startRow}>
          <View style={space.paddingS}>
            <AppIcon name="upgrade" size={32} color={COLORS.D20} />
          </View>
          <Text style={[typography.large, { color: COLORS.D30, flexShrink: 1 }]} adjustsFontSizeToFit>
            { t`Earned XP:` }
          </Text>
        </View>
        { (choices === undefined && editable) ? (
          <View style={space.marginRightXs}>
            <PlusMinusButtons
              count={xpAdjust}
              countRender={(
                <Text style={[typography.counter, typography.center, { color: COLORS.D30, minWidth: 28 }]}>
                  { xp }
                </Text>
              )}
              onIncrement={incXp}
              onDecrement={decXp}
              color="light"
              dialogStyle
              rounded
              disabled={saving}
            />
          </View>
        ) : (
          <Text style={[typography.counter, { color: COLORS.D30 }, space.paddingRightS]}>
            { xpString }
          </Text>
        )}
      </View>
    );
  }, [typography, xp, colors, editable, xpAdjust, incXp, decXp, choices, saving]);
  const baseTrauma = useMemo(() => campaignLog.baseTrauma(investigator.code), [campaignLog, investigator]);
  const traumaDelta = useMemo(() => campaignLog.traumaChanges(investigator.code), [campaignLog, investigator]);

  const traumaSection = useMemo(() => {
    const physical = (traumaDelta.physical || 0) + physicalTrauma;
    const mental = (traumaDelta.mental || 0) + mentalTrauma;
    const totalPhysical = (baseTrauma.physical || 0) + physical;
    const totalMental = (baseTrauma.mental || 0) + mental;
    const locked = (choices !== undefined) || !editable;
    return (
      <>
        <CounterRow
          editable={!locked}
          bottomBorder
          disabled={saving}
          icon={<View style={{ paddingLeft: 2, paddingRight: 1 }}><HealthSanityIcon type="health" size={24} /></View>}
          title={t`Physical`}
          count={physical}
          total={totalPhysical}
          inc={incPhysical}
          dec={decPhysical}
          max={health}
        />
        <CounterRow
          editable={!locked}
          disabled={saving}
          icon={<View style={space.paddingRightXs}><HealthSanityIcon type="sanity" size={20} /></View>}
          title={t`Mental`}
          count={mental}
          total={totalMental}
          inc={incMental}
          dec={decMental}
          max={sanity}
        />
      </>
    );
  }, [incMental, decMental, incPhysical, decPhysical, editable, saving,
    health, sanity, baseTrauma, choices, physicalTrauma, mentalTrauma, traumaDelta]);


  const selectDeck = useCallback(() => {
    campaignState.showChooseDeck(investigator);
  }, [campaignState, investigator]);

  const { campaign } = useContext(CampaignGuideContext);
  const footer = useMemo(() => {
    if (deck && deck.owner && userId && deck.owner.id !== userId && editable) {
      return (
        <View style={[space.paddingS, { flexDirection: 'column', backgroundColor: colors.L10, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }]}>
          <View style={choices !== undefined ? styles.startRow : styles.startColumn}>
            <ActionButton
              color={choices !== undefined ? 'green' : 'dark'}
              leftIcon="check"
              title={choices !== undefined ? t`Saved` : t`Not deck owner`}
              onPress={save}
              disabled
            />
            <View style={[styles.column, { flex: 1 }, space.paddingLeftS, choices === undefined ? space.marginTopS : undefined]}>
              <Text style={[typography.small, typography.italic, typography.light]}>
                { deck.owner?.handle ?
                  t`This deck is owned by ${deck.owner.handle}. They must open the app on their own device to save the upgrade` :
                  t`This deck is owned by another user. They must open the app on their own device to save the upgrade` }
              </Text>
            </View>
          </View>
        </View>
      );
    }
    const currentMessage = saving ? t`Saving` : t`Save`;
    const secondSection = !skipDeckSave && (deck ? choices !== undefined : choices === undefined);
    const deckButton = deck && choices !== undefined && deckChoice && (
      <ShowDeckButton
        deckId={deckChoice}
        investigator={investigator}
      />
    );
    if (choices === undefined && !editable) {
      return null;
    }
    return (
      <View style={[space.paddingS, { flexDirection: 'column', backgroundColor: colors.L10, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }]}>
        <View style={[styles.startRow, secondSection ? { paddingBottom: xs, borderBottomWidth: 1, borderColor: colors.L30 } : undefined]}>
          <ActionButton
            color="green"
            leftIcon="check"
            title={choices !== undefined ? t`Saved` : currentMessage}
            onPress={save}
            disabled={choices !== undefined || (!deck && !unsavedEdits)}
            loading={saving}
          />
          <View style={[styles.column, { flex: 1 }, space.paddingLeftS]}>
            { !!error && (
              <Text style={[typography.small, typography.italic, typography.light]}>
                { error }
              </Text>
            ) }
            <Text style={[typography.small, typography.italic, typography.light]}>
              { deckMessage(choices !== undefined || !editable, !!deck && !skipDeckSave, unsavedEdits) }
            </Text>
          </View>
        </View>
        { secondSection && (
          <View style={[styles.column, space.paddingTopXs]}>
            <Text style={[typography.small, typography.italic, typography.light]}>
              { !deck ?
                t`This investigator does not have a deck associated with it.\nIf you choose a deck, the app can help track spent experience, story asset changes, and deckbuilding requirements.` :
                t`Now that your upgrade has been saved, when visiting the deck be sure to use the 'Edit' button when making card changes.`
              }
            </Text>
            <View style={[space.paddingTopS, styles.startRow]}>
              { !deck ?
                <ActionButton leftIcon="deck" color="dark" title={t`Choose deck`} onPress={selectDeck} /> :
                deckButton
              }
            </View>
          </View>
        ) }
      </View>
    );
  }, [choices, deckChoice, investigator, skipDeckSave, userId, error, selectDeck, editable, deck, typography, save, colors, saving, unsavedEdits]);

  const count: number = useMemo(() => {
    if (choices === undefined) {
      if (!editable) {
        return 0;
      }
      return countAdjust;
    }
    return (choices.count && choices.count[0]) || 0;
  }, [choices, countAdjust, editable]);

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
    return (
      <CounterRow
        editable={!locked}
        icon={<View style={space.paddingRightXs}><EncounterIcon encounter_code={campaign.cycleCode} size={22} color={colors.D10} /></View>}
        title={campaignLog.campaignData.redirect_experience ? t`${section.title} (from XP)` : section.title}
        count={newTotal}
        total={newTotal}
        inc={incCount}
        dec={decCount}
        min={0}
        bottomBorder
        hideTotal
        disabled={saving}
      />
    );
  }, [investigatorCounter, campaign.cycleCode, colors, incCount, decCount, saving, campaignLog.campaignData, editable, choices, count, existingCount, campaignGuide]);
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
    return (
      <>
        { !!deck && (choices === undefined || keys(savedExileCounts).length > 0) && (
          <ExileCardSelectorComponent
            componentId={componentId}
            deck={deck}
            label={<View style={space.paddingSideS}><DeckSlotHeader title={t`Exiled cards` } /></View>}
            exileCounts={choices === undefined ? exileCounts : savedExileCounts}
            updateExileCount={onExileCountChange}
            disabled={!editable || saving || choices !== undefined}
          >
            { exileSection }
          </ExileCardSelectorComponent>
        )}
        { (choices === undefined ? keys(specialExileSlots).length : keys(specialExile).length) > 0 && (
          <CardSelectorComponent
            componentId={componentId}
            slots={specialExileSlots}
            counts={specialExile}
            filterCard={isExile}
            updateCount={updateSpecialExileCount}
            header={(choices !== undefined || !deck) && (
              <View style={space.paddingSideS}>
                <DeckSlotHeader title={choices !== undefined ? t`Exiled story cards` : t`Exile story cards` } />
              </View>
            )}
            locked={saving || !!choices}
          />
        ) }
      </>
    );
  }, [deck, componentId, saving, onExileCountChange, updateSpecialExileCount, editable, savedExileCounts, specialExileSlots, exileCounts, choices, specialExile]);
  const campaignSection = useMemo(() => {
    return (
      <>
        { customCountsSection }
        { traumaSection }
        { (!campaignLog.campaignData.redirect_experience) && xpSection }
        { storyAssetSection }
        { exileSection }
        { footer }
      </>
    );
  }, [exileSection, campaignLog.campaignData.redirect_experience, xpSection, traumaSection, storyAssetSection, customCountsSection, footer]);

  const isYithian = storyAssets && (storyAssets[BODY_OF_A_YITHIAN] || 0) > 0;
  const [open, toggleOpen] = useFlag(choices === undefined);
  return (
    <View style={space.paddingBottomS}>
      <AnimatedCompactInvestigatorRow
        yithian={isYithian}
        investigator={investigator}
        open={choices === undefined || open}
        toggleOpen={toggleOpen}
        disabled={choices === undefined}
        headerContent={!open && editable && <ArkhamSwitch value large color="light" />}
        width={width - s * (editable ? 4 : 2)}
      >
        { campaignSection }
      </AnimatedCompactInvestigatorRow>
    </View>
  );
}

UpgradeDeckRow.choiceId = computeChoiceId;
export default UpgradeDeckRow;

const styles = StyleSheet.create({
  startRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  startColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  betweenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  endRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  xpBlock: {
    borderRadius: 4,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});
