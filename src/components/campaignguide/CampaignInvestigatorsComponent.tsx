import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Text, StyleSheet, View, Platform } from 'react-native';
import { filter, find, flatMap, map, partition } from 'lodash';
import { useAppState } from '@react-native-community/hooks';
import { t } from 'ttag';

import { Trauma } from '@actions/types';
import InvestigatorCampaignRow from '@components/campaign/InvestigatorCampaignRow';
import { ProcessedCampaign, StepId } from '@data/scenario';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import Card from '@data/types/Card';
import space, { s, l } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { ShowAlert, ShowCountDialog } from '@components/deck/dialogs';
import DeckButton from '@components/deck/controls/DeckButton';
import CampaignLogSectionComponent from './CampaignLogComponent/CampaignLogSectionComponent';
import DeckSlotHeader from '@components/deck/section/DeckSlotHeader';
import { useDispatch } from 'react-redux';
import { updateCampaignXp } from '@components/campaign/actions';
import { UpdateCampaignActions } from '@data/remote/campaigns';
import { SaveDeckUpgrade } from '@components/deck/useDeckUpgradeAction';
import { CampaignLogSectionDefinition } from '@data/scenario/types';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';

interface Props {
  componentId: string;
  actions: UpdateCampaignActions;
  processedCampaign: ProcessedCampaign;
  savingDeckUpgrade: boolean;
  showAddInvestigator: () => void;
  showCountDialog: ShowCountDialog;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  showAlert: ShowAlert;
  saveDeckUpgrade: SaveDeckUpgrade<StepId>;
}

function AliveInvestigatorRow({
  componentId, investigator, processedCampaign, investigatorCountSections, suppliesSections, savingDeckUpgrade,
  removeInvestigatorPressed, showChooseDeckForInvestigator, showXpDialogPressed, showTraumaDialog, saveDeckUpgrade,
}: {
  componentId: string;
  investigator: Card;
  processedCampaign: ProcessedCampaign;
  investigatorCountSections: CampaignLogSectionDefinition[];
  suppliesSections: CampaignLogSectionDefinition[];
  savingDeckUpgrade: boolean;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  showChooseDeckForInvestigator: (investigator: Card) => void;
  showXpDialogPressed: (investigator: Card) => void;
  removeInvestigatorPressed: (investigator: Card) => void;
  saveDeckUpgrade: SaveDeckUpgrade<StepId>;
}) {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!savingDeckUpgrade) {
      setSaving(false);
    }
  }, [savingDeckUpgrade, setSaving]);
  const { campaign, campaignGuide, campaignState, latestDecks, playerCards, spentXp } = useContext(CampaignGuideContext);
  const { typography } = useContext(StyleContext);
  const nextDeckUpgradeStepId = useMemo(() => userId ? campaignState.nextDelayedDeckEdit(investigator.code, userId) : undefined, [campaignState, investigator.code, userId]);
  const deck = latestDecks[investigator.code];
  const saveNextDeckUpgradePressed = useCallback(() => {
    if (nextDeckUpgradeStepId && deck) {
      const [,,deckEdits] = campaignState.numberChoices(nextDeckUpgradeStepId.id, nextDeckUpgradeStepId.scenario);
      if (deckEdits) {
        setSaving(true);
        saveDeckUpgrade(
          deck,
          deckEdits.xp,
          deckEdits.storyCounts,
          deckEdits.ignoreStoryCounts,
          deckEdits.exileCounts,
          nextDeckUpgradeStepId
        );
      }
    }
  }, [saveDeckUpgrade, nextDeckUpgradeStepId, deck, campaignState, setSaving]);
  const traumaAndCardData = useMemo(() =>
    processedCampaign.campaignLog.traumaAndCardData(investigator.code),
  [processedCampaign.campaignLog, investigator.code]);
  return (
    <InvestigatorCampaignRow
      campaign={campaign}
      campaignGuide={campaignGuide}
      playerCards={playerCards}
      badge={nextDeckUpgradeStepId ? 'deck' : undefined}
      spentXp={spentXp[investigator.code] || 0}
      totalXp={processedCampaign.campaignLog.totalXp(investigator.code)}
      unspentXp={processedCampaign.campaignLog.specialXp(investigator.code, 'unspect_xp')}
      deck={deck}
      componentId={componentId}
      investigator={investigator}
      showXpDialog={showXpDialogPressed}
      traumaAndCardData={traumaAndCardData}
      chooseDeckForInvestigator={showChooseDeckForInvestigator}
      removeInvestigator={removeInvestigatorPressed}
      showTraumaDialog={showTraumaDialog}
    >
      <View style={styles.column}>
        { !!nextDeckUpgradeStepId && (
          <View style={space.paddingBottomS}>
            <DeckButton
              shrink
              key="deck_upgrade"
              color="gold"
              icon="deck"
              title={t`Save deck upgrade`}
              detail={t`Apply deck changes from previous scenario`}
              loading={saving}
              onPress={saveNextDeckUpgradePressed}
            />
          </View>
        ) }
        {
          flatMap(investigatorCountSections, investigatorCount => {
            const section = processedCampaign.campaignLog.investigatorSections[investigatorCount.id];
            if (!section) {
              return null;
            }
            const investigatorSection = section[investigator.code];
            const countEntry = find(investigatorSection?.entries, e => e.id === '$count' && e.type === 'count');
            return (
              <View key={`${investigator.code}-${investigatorCount.id}`} style={space.paddingBottomS}>
                <DeckSlotHeader
                  title={investigatorCount.title}
                  first
                />
                <Text style={[space.marginLeftS, typography.gameFont]}>
                  { countEntry?.type === 'count' ? countEntry.count : 0 }
                </Text>
              </View>
            );
          })
        }
        { flatMap(suppliesSections, supplies => {
          const section = processedCampaign.campaignLog.investigatorSections[supplies.id];
          if (!section) {
            return null;
          }
          const investigatorSection = section[investigator.code];
          if (!investigatorSection) {
            return null;
          }
          return (
            <View key={`${investigator.code}-${supplies.id}`} style={Platform.OS === 'android' ? space.paddingBottomS : undefined}>
              <DeckSlotHeader title={supplies.title} first />
              <View style={space.paddingTopXs}>
                <CampaignLogSectionComponent
                  sectionId={supplies.id}
                  campaignGuide={campaignGuide}
                  section={investigatorSection}
                />
              </View>
            </View>
          );
        }) }
      </View>
    </InvestigatorCampaignRow>
  );
}

export default function CampaignInvestigatorsComponent(props: Props) {
  const { componentId, processedCampaign, actions, savingDeckUpgrade, showAddInvestigator, showTraumaDialog, showAlert, showCountDialog, saveDeckUpgrade } = props;
  const { syncCampaignChanges, campaign, campaignId, campaignGuide, campaignState, latestDecks, campaignInvestigators, playerCards, spentXp } = useContext(CampaignGuideContext);
  const { typography } = useContext(StyleContext);
  const dispatch = useDispatch();

  const appState = useAppState();
  const syncCampaignData = useCallback(() => {
    syncCampaignChanges(processedCampaign);
  }, [syncCampaignChanges, processedCampaign]);
  const syncCampaignDataRef = useRef<() => void>(syncCampaignData);

  useEffect(() => {
    syncCampaignDataRef.current = syncCampaignData;
  }, [syncCampaignData]);

  useEffect(() => {
    if (appState === 'inactive' || appState === 'background') {
      syncCampaignData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState]);

  useEffect(() => {
    // Update the campaign on unmount.
    return () => {
      syncCampaignDataRef.current();
    };
  }, []);

  const showChooseDeckForInvestigator = useCallback((investigator: Card) => {
    campaignState.showChooseDeck(investigator);
  }, [campaignState]);
  const removeInvestigatorPressed = useCallback((investigator: Card) => {
    const deck = latestDecks[investigator.code];
    if (deck) {
      showAlert(
        t`Remove deck from campaign`,
        t`Are you sure you want to remove this deck from the campaign?\n\nAfter removing the deck you will be able to select a different deck, but experience and story assets will only be saved as you complete new scenarios.`,
        [
          { text: t`Cancel`, style: 'cancel' },
          {
            text: t`Remove deck`,
            style: 'destructive',
            onPress: () => {
              campaignState.removeDeck(deck.id, deck.investigator);
            },
          },
        ]
      );
    } else {
      if (processedCampaign.campaignLog.hasInvestigatorPlayedScenario(investigator)) {
        showAlert(
          t`Cannot remove`,
          t`Since this investigator has participated in one or more scenarios during this campaign, they cannot be removed.\n\nHowever, you can choose to have them not participate in future scenarios of this campaign.`
        );
      } else {
        campaignState.removeInvestigator(investigator);
      }
    }
  }, [latestDecks, processedCampaign.campaignLog, campaignState, showAlert]);

  const betweenScenarios = useMemo(() => {
    return !find(processedCampaign.scenarios, scenario => scenario.type === 'started') &&
      !!find(processedCampaign.scenarios, scenario => scenario.type === 'completed');
  }, [processedCampaign]);

  const [killedInvestigators, aliveInvestigators] = useMemo(() => partition(
    campaignInvestigators,
    investigator => processedCampaign.campaignLog.isEliminated(investigator)
  ), [processedCampaign.campaignLog, campaignInvestigators]);

  const showXpDialogPressed = useCallback((investigator: Card) => {
    showCountDialog({
      title: investigator.name,
      label: t`Spent experience`,
      value: spentXp[investigator.code] || 0,
      max: processedCampaign.campaignLog.totalXp(investigator.code),
      update: (count: number) => {
        dispatch(updateCampaignXp(
          actions,
          campaignId,
          investigator.code,
          count,
          'spentXp'
        ));
      },
    });
  }, [showCountDialog, dispatch, actions, campaignId, spentXp, processedCampaign.campaignLog]);

  const disabledShowTraumaPressed = useCallback(() => {
    const campaignSetupCompleted = !!find(processedCampaign.scenarios, scenario => scenario.type === 'completed');
    showAlert(
      t`Investigator trauma`,
      campaignSetupCompleted ?
        t`You can only edit trauma here between scenarios.\n\nDuring scenario play it can be edited using the scenario guide.` :
        t`Starting trauma can be adjusted after 'Campaign Setup' has been completed.`
    );
  }, [processedCampaign.scenarios, showAlert]);
  const investigatorCount = campaignInvestigators.length;
  const suppliesSections = useMemo(() => filter(campaignGuide.campaignLogSections(), section => section.id !== 'hidden' && section.type === 'supplies'), [campaignGuide]);
  const investigatorCountSections = useMemo(() => filter(campaignGuide.campaignLogSections(), section => section.id !== 'hidden' && section.type === 'investigator_count'), [campaignGuide]);
  return (
    <>
      <View style={[space.paddingBottomS, space.paddingTopS]}>
        <Text style={[typography.large, typography.center, typography.light]}>
          { `— ${t`Investigators`} · ${investigatorCount} —` }
        </Text>
      </View>
      { map(aliveInvestigators, investigator => (
        <AliveInvestigatorRow
          key={investigator.code}
          investigator={investigator}
          showChooseDeckForInvestigator={showChooseDeckForInvestigator}
          removeInvestigatorPressed={removeInvestigatorPressed}
          componentId={componentId}
          investigatorCountSections={investigatorCountSections}
          suppliesSections={suppliesSections}
          processedCampaign={processedCampaign}
          showXpDialogPressed={showXpDialogPressed}
          showTraumaDialog={betweenScenarios ? showTraumaDialog : disabledShowTraumaPressed}
          saveDeckUpgrade={saveDeckUpgrade}
          savingDeckUpgrade={savingDeckUpgrade}
        />
      )) }
      { killedInvestigators.length > 0 && (
        <View style={styles.header}>
          <Text style={[typography.large, typography.center, typography.light]}>
            { `— ${t`Killed and Insane Investigators`} · ${killedInvestigators.length} —` }
          </Text>
        </View>
      ) }
      { map(killedInvestigators, investigator => {
        const traumaAndCardData = processedCampaign.campaignLog.traumaAndCardData(investigator.code);
        return (
          <InvestigatorCampaignRow
            campaignGuide={campaignGuide}
            key={investigator.code}
            playerCards={playerCards}
            spentXp={spentXp[investigator.code] || 0}
            totalXp={processedCampaign.campaignLog.totalXp(investigator.code)}
            unspentXp={processedCampaign.campaignLog.specialXp(investigator.code, 'unspect_xp')}
            showXpDialog={showXpDialogPressed}
            showTraumaDialog={betweenScenarios && ((traumaAndCardData?.physical && traumaAndCardData?.physical === investigator.health) || (traumaAndCardData?.mental && traumaAndCardData?.mental === investigator.sanity)) ? showTraumaDialog : undefined}
            campaign={campaign}
            deck={latestDecks[investigator.code]}
            componentId={componentId}
            investigator={investigator}
            traumaAndCardData={traumaAndCardData}
          />
        );
      }) }
      <DeckButton
        color="light_gray"
        icon="plus-thin"
        title={t`Add Investigator`}
        onPress={showAddInvestigator}
        bottomMargin={s}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: s,
    paddingTop: l,
  },
  column: {
    flexDirection: 'column',
  },
});
