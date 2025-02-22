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
import { updateCampaignXp } from '@components/campaign/actions';
import { UpdateCampaignActions } from '@data/remote/campaigns';
import { SaveDeck, SaveDeckUpgrade } from '@components/deck/useDeckUpgradeAction';
import { CampaignLogSectionDefinition } from '@data/scenario/types';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import LoadingCardSearchResult from '@components/cardlist/LoadingCardSearchResult';
import { useArkhamDbError } from '@data/hooks';
import { useAppDispatch } from '@app/store';
import CampaignHeader from './CampaignHeader';

interface Props {
  componentId: string;
  actions: UpdateCampaignActions;
  processedCampaign: ProcessedCampaign;
  savingDeckUpgrade: boolean;
  loading: boolean;
  login: () => void;
  showAddInvestigator: () => void;
  showCountDialog: ShowCountDialog;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  showAlert: ShowAlert;
  saveDeckUpgrade: SaveDeckUpgrade<StepId>;
  saveDeck: SaveDeck<StepId>;
}

function AliveInvestigatorRow({
  componentId, investigator, processedCampaign, investigatorCountSections, suppliesSections, savingDeckUpgrade,
  login, removeInvestigatorPressed, showChooseDeckForInvestigator, showXpDialogPressed, showTraumaDialog,
  saveDeckUpgrade, saveDeck,
}: {
  componentId: string;
  investigator: Card;
  processedCampaign: ProcessedCampaign;
  investigatorCountSections: CampaignLogSectionDefinition[];
  suppliesSections: CampaignLogSectionDefinition[];
  savingDeckUpgrade: boolean;
  login: () => void;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  showChooseDeckForInvestigator: (investigator: Card) => void;
  showXpDialogPressed: (investigator: Card) => void;
  removeInvestigatorPressed: (investigator: Card) => void;
  saveDeckUpgrade: SaveDeckUpgrade<StepId>;
  saveDeck: SaveDeck<StepId>;
}) {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!savingDeckUpgrade) {
      setSaving(false);
    }
  }, [savingDeckUpgrade, setSaving]);
  const { campaign, campaignGuide, campaignState, latestDecks, spentXp } = useContext(CampaignGuideContext);
  const { typography } = useContext(StyleContext);
  const [nextDeckUpgradeStepId, nextDeckUpgradeType] = useMemo(() => {
    if (!userId) {
      return [undefined, undefined];
    }
    const stepId = campaignState.nextDelayedDeckEdit(investigator.code, userId);
    if (!stepId) {
      return [undefined, undefined];
    }
    const [,,delayedDeckEdits] = campaignState.numberChoices(stepId.id, stepId.scenario);
    return [stepId, delayedDeckEdits?.type];
  }, [campaignState, investigator.code, userId]);
  const deck = latestDecks[investigator.code];
  const saveNextDeckUpgradePressed = useCallback(async() => {
    if (nextDeckUpgradeStepId && deck) {
      const [,,delayedDeckEdits] = campaignState.numberChoices(nextDeckUpgradeStepId.id, nextDeckUpgradeStepId.scenario);
      if (delayedDeckEdits) {
        setSaving(true);
        if (delayedDeckEdits.type === 'save') {
          await saveDeck(
            deck,
            delayedDeckEdits.xp,
            delayedDeckEdits.storyCounts,
            nextDeckUpgradeStepId
          );
        } else {
          await saveDeckUpgrade(
            deck,
            delayedDeckEdits.xp,
            delayedDeckEdits.storyCounts,
            delayedDeckEdits.ignoreStoryCounts,
            delayedDeckEdits.exileCounts,
            nextDeckUpgradeStepId
          );
        }
        setSaving(false);
      }
    }
  }, [saveDeck, saveDeckUpgrade, nextDeckUpgradeStepId, deck, campaignState, setSaving]);
  const arkhamDbError = useArkhamDbError();
  const needsArkhamDbReauth = !deck?.deck.local && arkhamDbError === 'badAccessToken';
  const traumaAndCardData = useMemo(() =>
    processedCampaign.campaignLog.traumaAndCardData(investigator.code),
  [processedCampaign.campaignLog, investigator.code]);
  return (
    <InvestigatorCampaignRow
      campaign={campaign}
      campaignGuide={campaignGuide}
      badge={nextDeckUpgradeStepId ? 'deck' : undefined}
      spentXp={spentXp[investigator.code] ?? 0}
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
            { needsArkhamDbReauth ? (
              <DeckButton
                shrink
                key="deck_upgrade"
                color="default"
                icon="arkhamdb"
                title={t`Reauthorize ArkhamDB`}
                detail={t`Login required to save deck upgrade`}
                loading={saving}
                onPress={login}
              />
            ) : (
              <DeckButton
                shrink
                key="deck_upgrade"
                color="gold"
                icon="deck"
                title={nextDeckUpgradeType === 'save' ? t`Claim previous rewards` : t`Claim previous scenario XP`}
                detail={nextDeckUpgradeType === 'save' ? t`Apply changes from last completed scenario or interlude` : t`Apply changes from last completed scenario`}
                loading={saving}
                onPress={saveNextDeckUpgradePressed}
              />
            ) }
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
  const {
    componentId, loading, processedCampaign, actions, savingDeckUpgrade,
    login, showAddInvestigator, showTraumaDialog, showAlert, showCountDialog,
    saveDeckUpgrade, saveDeck,
  } = props;
  const { syncCampaignChanges, campaign, campaignId, campaignGuide, campaignState, latestDecks, campaignInvestigators, spentXp } = useContext(CampaignGuideContext);
  const dispatch = useAppDispatch();

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
  const investigatorCount = campaignInvestigators?.length;
  const suppliesSections = useMemo(() => filter(campaignGuide.campaignLogSections(), section => section.id !== 'hidden' && section.type === 'supplies'), [campaignGuide]);
  const investigatorCountSections = useMemo(() => filter(
    campaignGuide.campaignLogSections(),
    section =>
      section.id !== 'hidden' && !section.hidden && section.type === 'investigator_count'
  ), [campaignGuide]);
  return (
    <>
      <CampaignHeader title={investigatorCount ? `${t`Investigators`} · ${investigatorCount}` : t`Investigators`} style={space.paddingTopS} />
      { loading || campaignInvestigators === undefined ? (
        <LoadingCardSearchResult noBorder />
      ) : (
        <>
          { map(aliveInvestigators, investigator => (
            <AliveInvestigatorRow
              key={investigator.code}
              investigator={investigator}
              componentId={componentId}
              investigatorCountSections={investigatorCountSections}
              suppliesSections={suppliesSections}
              processedCampaign={processedCampaign}
              login={login}
              showChooseDeckForInvestigator={showChooseDeckForInvestigator}
              removeInvestigatorPressed={removeInvestigatorPressed}
              showXpDialogPressed={showXpDialogPressed}
              showTraumaDialog={betweenScenarios ? showTraumaDialog : disabledShowTraumaPressed}
              saveDeckUpgrade={saveDeckUpgrade}
              saveDeck={saveDeck}
              savingDeckUpgrade={savingDeckUpgrade}
            />
          )) }
          <DeckButton
            color="light_gray"
            icon="plus-button"
            title={t`Add Investigator`}
            onPress={showAddInvestigator}
            bottomMargin={s}
          />
          { killedInvestigators.length > 0 && (
            <CampaignHeader style={styles.header} title={`${t`Killed and Insane Investigators`} · ${killedInvestigators.length}`} />
          ) }
          { map(killedInvestigators, investigator => {
            const traumaAndCardData = processedCampaign.campaignLog.traumaAndCardData(investigator.code);
            return (
              <InvestigatorCampaignRow
                campaignGuide={campaignGuide}
                key={investigator.code}
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
        </>
      ) }
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
