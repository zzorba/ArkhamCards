import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { InteractionManager, Text, StyleSheet, View } from 'react-native';
import { filter, find, findLast, flatMap, forEach, map, mapValues, partition } from 'lodash';
import { isAfter } from 'date-fns';
import { useAppState } from '@react-native-community/hooks';
import { t } from 'ttag';

import { InvestigatorData, Trauma } from '@actions/types';
import InvestigatorCampaignRow from '@components/campaign/InvestigatorCampaignRow';
import { ProcessedCampaign } from '@data/scenario';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import Card from '@data/types/Card';
import space, { s, l } from '@styles/space';
import { useCounters, useEffectUpdate } from '@components/core/hooks';
import StyleContext from '@styles/StyleContext';
import { ShowAlert, ShowCountDialog } from '@components/deck/dialogs';
import DeckButton from '@components/deck/controls/DeckButton';
import CampaignLogSectionComponent from './CampaignLogComponent/CampaignLogSectionComponent';
import DeckSlotHeader from '@components/deck/section/DeckSlotHeader';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useDispatch } from 'react-redux';
import { updateCampaign } from '@components/campaign/actions';

interface Props {
  componentId: string;
  processedCampaign: ProcessedCampaign;
  showAddInvestigator: () => void;
  showCountDialog: ShowCountDialog;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  showAlert: ShowAlert;
}

function getDate(date: string | Date) {
  if (typeof date === 'string') {
    return new Date(Date.parse(date));
  }
  return date;
}

export default function CampaignInvestigatorsComponent(props: Props) {
  const { componentId, processedCampaign, showAddInvestigator, showTraumaDialog, showAlert, showCountDialog } = props;
  const { campaignGuideVersion, campaignId, campaignGuide, campaignState, latestDecks, campaignInvestigators, adjustedInvestigatorData, playerCards, lastUpdated } = useContext(CampaignGuideContext);
  const { typography } = useContext(StyleContext);
  const investigatorSpentXp = useMemo(() => mapValues(adjustedInvestigatorData, data => (data && data.spentXp) || 0), [adjustedInvestigatorData]);
  const { user } = useContext(ArkhamCardsAuthContext);
  const dispatch = useDispatch();

  const [spentXp,,,,syncSpentXp] = useCounters(investigatorSpentXp);
  useEffectUpdate(() => {
    syncSpentXp(investigatorSpentXp);
  }, [syncSpentXp, adjustedInvestigatorData]);

  const appState = useAppState();
  const syncCampaignData = useCallback(() => {
    const {
      campaignLog,
      scenarios,
    } = processedCampaign;
    const guideLastUpdated = getDate(campaignState.lastUpdated());
    const newLastUpdated = isAfter(getDate(lastUpdated), guideLastUpdated) ? lastUpdated : guideLastUpdated;
    dispatch(updateCampaign(
      user,
      campaignId,
      {
        guideVersion: campaignGuideVersion === -1 ? campaignGuide.campaignVersion() : campaignGuideVersion,
        difficulty: campaignLog.campaignData.difficulty,
        investigatorData: campaignLog.campaignData.investigatorData,
        chaosBag: campaignLog.chaosBag,
        scenarioResults: flatMap(scenarios, scenario => {
          if (scenario.type !== 'completed') {
            return [];
          }
          const scenarioType = scenario.scenarioGuide.scenarioType();
          return {
            scenario: scenario.scenarioGuide.scenarioName(),
            scenarioCode: scenario.scenarioGuide.scenarioId(),
            resolution: campaignLog.scenarioResolution(scenario.scenarioGuide.scenarioId()) || '',
            interlude: scenarioType === 'interlude' || scenarioType === 'epilogue',
          };
        }),
      },
      newLastUpdated
    ));
  }, [lastUpdated, campaignGuide, campaignGuideVersion, campaignId, campaignState, processedCampaign, user, dispatch]);
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
              campaignState.removeDeck(deck);
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

  const canEditTrauma = useMemo(() => {
    return !find(processedCampaign.scenarios, scenario => scenario.type === 'started') &&
      !!find(processedCampaign.scenarios, scenario => scenario.type === 'completed');
  }, [processedCampaign]);

  const [killedInvestigators, aliveInvestigators] = useMemo(() => partition(
    campaignInvestigators,
    investigator => processedCampaign.campaignLog.isEliminated(investigator)
  ), [processedCampaign.campaignLog, campaignInvestigators]);

  const showXpDialogPressed = useCallback((investigator: Card) => {
    const adjustedInvestigatorData: InvestigatorData = {};
    forEach(spentXp, (xp, code) => {
      adjustedInvestigatorData[code] = {
        spentXp: xp,
      };
    });

    showCountDialog({
      title: investigator.name,
      label: t`Spent experience`,
      value: spentXp[investigator.code] || 0,
      max: processedCampaign.campaignLog.totalXp(investigator.code),
      update: (count: number) => {
        adjustedInvestigatorData[investigator.code] = {
          spentXp: count,
        };
        dispatch(updateCampaign(
          user,
          campaignId,
          { adjustedInvestigatorData },
          new Date()
        ));
      },
    });
  }, [showCountDialog, dispatch, user, campaignId, spentXp, processedCampaign.campaignLog]);

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
  return (
    <>
      <View style={[space.paddingBottomS, space.paddingTopS]}>
        <Text style={[typography.large, typography.center, typography.light]}>
          { `— ${t`Investigators`} · ${investigatorCount} —` }
        </Text>
      </View>
      { map(aliveInvestigators, investigator => (
        <InvestigatorCampaignRow
          key={investigator.code}
          campaignId={campaignId}
          playerCards={playerCards}
          spentXp={spentXp[investigator.code] || 0}
          totalXp={processedCampaign.campaignLog.totalXp(investigator.code)}
          deck={latestDecks[investigator.code]}
          componentId={componentId}
          investigator={investigator}
          showXpDialog={showXpDialogPressed}
          traumaAndCardData={processedCampaign.campaignLog.traumaAndCardData(investigator.code)}
          chooseDeckForInvestigator={showChooseDeckForInvestigator}
          removeInvestigator={removeInvestigatorPressed}
          showTraumaDialog={canEditTrauma ? showTraumaDialog : disabledShowTraumaPressed}
        >
          <>
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
                <>
                  <DeckSlotHeader title={supplies.title} first />
                  <View style={space.paddingTopXs}>
                    <CampaignLogSectionComponent
                      sectionId={supplies.id}
                      campaignGuide={campaignGuide}
                      section={investigatorSection}
                    />
                  </View>
                </>
              );
            }) }
          </>
        </InvestigatorCampaignRow>
      )) }
      { killedInvestigators.length > 0 && (
        <View style={styles.header}>
          <Text style={[typography.large, typography.center, typography.light]}>
            { `— ${t`Killed and Insane Investigators`} · ${killedInvestigators.length} —` }
          </Text>
        </View>
      ) }
      <View style={[space.paddingBottomS]}>
        { map(killedInvestigators, investigator => (
          <InvestigatorCampaignRow
            key={investigator.code}
            playerCards={playerCards}
            spentXp={spentXp[investigator.code] || 0}
            totalXp={processedCampaign.campaignLog.totalXp(investigator.code)}
            showXpDialog={showXpDialogPressed}
            campaignId={campaignId}
            deck={latestDecks[investigator.code]}
            componentId={componentId}
            investigator={investigator}
            traumaAndCardData={processedCampaign.campaignLog.traumaAndCardData(investigator.code)}
          />
        )) }
      </View>
      <View style={space.paddingBottomS}>
        <DeckButton
          icon="per_investigator"
          title={t`Add Investigator`}
          onPress={showAddInvestigator}
          color="light_gray"
          thin
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: s,
    paddingTop: l,
  },
  bottomBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
