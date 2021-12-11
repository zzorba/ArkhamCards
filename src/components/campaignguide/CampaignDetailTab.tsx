import React, { useCallback, useContext, useMemo } from 'react';
import { InteractionManager, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { filter, findLast, find, keys, last } from 'lodash';
import { t } from 'ttag';
import { Navigation } from 'react-native-navigation';

import { ProcessedCampaign, StepId } from '@data/scenario';
import StyleContext from '@styles/StyleContext';
import { ShowAlert, ShowCountDialog } from '@components/deck/dialogs';
import space, { s } from '@styles/space';
import useDeckUpgradeAction from '@components/deck/useDeckUpgradeAction';
import { Deck, CampaignCycleCode, Trauma, getDeckId } from '@actions/types';
import { ShowScenario } from './LinkedCampaignGuideView/useCampaignLinkHelper';
import DeckButton from '@components/deck/controls/DeckButton';
import { useDeckActions } from '@data/remote/decks';
import useChaosBagDialog from '@components/campaign/CampaignDetailView/useChaosBagDialog';
import CampaignGuideContext from './CampaignGuideContext';
import ScenarioCarouselComponent from './ScenarioCarouselComponent';
import { CampaignAchievementsProps } from './CampaignAchievementsView';
import CampaignInvestigatorsComponent from './CampaignInvestigatorsComponent';
import CampaignSummaryHeader from '@components/campaign/CampaignSummaryHeader';
import useTraumaDialog from '@components/campaign/useTraumaDialog';
import { UpdateCampaignActions } from '@data/remote/campaigns';
import { showGuideCampaignLog } from '@components/campaign/nav';
import { WeaknessSetProps } from './WeaknessSetView';
import useConnectionProblemBanner from '@components/core/useConnectionProblemBanner';
import { useArkhamDbError } from '@data/hooks';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';

const SHOW_WEAKNESS = false;

interface Props {
  componentId: string;
  processedCampaign: ProcessedCampaign;
  updateCampaignActions: UpdateCampaignActions;
  showAlert: ShowAlert;
  showCountDialog: ShowCountDialog;
  showLinkedScenario?: ShowScenario;
  displayLinkScenarioCount?: number;
  footerButtons?: React.ReactNode;
  login: () => void;
}


export default function CampaignDetailTab({
  componentId, processedCampaign, displayLinkScenarioCount, footerButtons, updateCampaignActions,
  showLinkedScenario, showAlert, showCountDialog, login,
}: Props) {
  const { backgroundStyle, width } = useContext(StyleContext);
  const { userId, arkhamDb } = useContext(ArkhamCardsAuthContext);
  const reLogin = useCallback(() => login(), [login]);
  const arkhamDbError = useArkhamDbError();
  const { campaignId, campaign, campaignGuide, campaignState, campaignInvestigators } = useContext(CampaignGuideContext);

  const deckActions = useDeckActions();
  const deckUpgradeCompleted = useCallback(async(deck: Deck, xp: number, id: StepId) => {
    const [choices, , delayedDeckEdit] = campaignState.numberChoices(id.id, id.scenario);
    if (choices && delayedDeckEdit) {
      await campaignState.setNumberChoices(
        id.id,
        choices,
        getDeckId(deck),
        {
          ...delayedDeckEdit,
          resolved: true,
        },
        id.scenario
      )
    }
  }, [campaignState]);
  const [connectionProblemBanner] = useConnectionProblemBanner({ width, arkhamdbState: { error: arkhamDbError, reLogin } })

  const [saving, saveDeckError, saveDeckUpgrade] = useDeckUpgradeAction<StepId>(deckActions, deckUpgradeCompleted);

  const showAddInvestigator = useCallback(() => {
    campaignState.showChooseDeck();
  }, [campaignState]);
  const scenarioId = useMemo(() => last(filter(processedCampaign.scenarios, s => s.type === 'started'))?.id.encodedScenarioId, [processedCampaign.scenarios]);
  const showCampaignLog = useCallback(() => {
    showGuideCampaignLog(
      componentId,
      campaignId,
      campaignGuide,
      processedCampaign.campaignLog,
      { standalone: false, hideChaosBag: true },
      scenarioId,
    );
  }, [componentId, campaignId, campaignGuide, processedCampaign.campaignLog, scenarioId]);

  const showCampaignAchievements = useCallback(() => {
    Navigation.push<CampaignAchievementsProps>(componentId, {
      component: {
        name: 'Guide.Achievements',
        passProps: {
          campaignId,
        },
        options: {
          topBar: {
            title: {
              text: t`Achievements`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [componentId, campaignId]);
  const updateTrauma = useCallback((code: string, trauma: Trauma) => {
    const latestScenario = findLast(processedCampaign.scenarios, s => s.type === 'completed');
    InteractionManager.runAfterInteractions(() => {
      campaignState.setInterScenarioInvestigatorData(
        code,
        trauma,
        latestScenario ? latestScenario?.id.encodedScenarioId : undefined
      );
    });
  }, [processedCampaign, campaignState]);

  const { showTraumaDialog, traumaDialog } = useTraumaDialog(updateTrauma, true);
  const chaosBagDisabled = useMemo(() => !keys(processedCampaign.campaignLog.chaosBag).length, [processedCampaign.campaignLog.chaosBag]);
  const allInvestigators = useMemo(() => filter(campaignInvestigators, investigator => !processedCampaign.campaignLog.isEliminated(investigator)), [campaignInvestigators, processedCampaign.campaignLog]);
  const currentScenario = findLast(processedCampaign.scenarios, s => (s.type === 'started' || s.type === 'completed') && s.scenarioGuide.scenarioType() === 'scenario') ||
    find(processedCampaign.scenarios, s => s.type === 'playable' && s.scenarioGuide.scenarioType() === 'scenario');

  const showWeaknessSet = useCallback(() => {
    Navigation.push<WeaknessSetProps>(componentId, {
      component: {
        name: 'Guide.WeaknessSet',
        passProps: {
          campaignId,
        },
        options: {
          topBar: {
            title: {
              text: t`Weakness Set`,
            },
            backButton: {
              title: t`Cancel`,
            },
          },
        },
      },
    })
  }, [componentId, campaignId]);

  const [chaosBagDialog, showChaosBag] = useChaosBagDialog({
    componentId,
    allInvestigators,
    campaignId,
    chaosBag: processedCampaign.campaignLog.chaosBag || {},
    guided: true,
    scenarioId: currentScenario?.id?.encodedScenarioId,
    setChaosBag: updateCampaignActions.setChaosBag,
    cycleCode: campaign.cycleCode,
  });
  return (
    <SafeAreaView style={[styles.wrapper, backgroundStyle]}>
      <ScrollView contentContainerStyle={backgroundStyle} showsVerticalScrollIndicator={false}>
        { !!userId && !!arkhamDb && !!campaignId.serverId && connectionProblemBanner }
        <View style={[space.paddingSideS, space.paddingBottomS]}>
          <CampaignSummaryHeader
            difficulty={processedCampaign.campaignLog.campaignData.difficulty}
            name={campaignGuide.campaignName()}
            cycle={campaignGuide.campaignCycleCode() as CampaignCycleCode}
          />
          <DeckButton
            icon="log"
            title={t`Campaign Log`}
            detail={t`Review and add records`}
            color="light_gray"
            onPress={showCampaignLog}
            bottomMargin={s}
          />
          { campaignGuide.achievements().length > 0 && (
            <DeckButton
              icon="finish"
              title={t`Achievements`}
              detail={t`Note campaign achievements`}
              color="light_gray"
              onPress={showCampaignAchievements}
              bottomMargin={s}
            />
          ) }
          <DeckButton
            icon="chaos_bag"
            title={t`Chaos Bag`}
            detail={chaosBagDisabled ? t`Complete campaign setup` : t`Review and draw tokens`}
            disabled={chaosBagDisabled}
            color="light_gray"
            onPress={showChaosBag}
            bottomMargin={s}
          />
          { SHOW_WEAKNESS && (
            <DeckButton
              icon="weakness"
              title={t`Weakness Set`}
              detail={t`Review and draw weaknesses`}
              color="light_gray"
              onPress={showWeaknessSet}
              bottomMargin={s}
            />
          ) }
        </View>
        <ScenarioCarouselComponent
          componentId={componentId}
          processedCampaign={processedCampaign}
          displayLinkScenarioCount={displayLinkScenarioCount}
          showLinkedScenario={showLinkedScenario}
          showAlert={showAlert}
        />
        <View style={[space.paddingSideS, space.paddingBottomS]}>
          <CampaignInvestigatorsComponent
            componentId={componentId}
            showAlert={showAlert}
            showAddInvestigator={showAddInvestigator}
            processedCampaign={processedCampaign}
            showTraumaDialog={showTraumaDialog}
            showCountDialog={showCountDialog}
            actions={updateCampaignActions}
            saveDeckUpgrade={saveDeckUpgrade}
            savingDeckUpgrade={saving}
          />
        </View>
        { footerButtons }
      </ScrollView>
      { chaosBagDialog }
      { traumaDialog }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
