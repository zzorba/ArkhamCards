import React, { useCallback, useContext, useMemo } from 'react';
import { InteractionManager, ScrollView, StyleSheet, View } from 'react-native';
import { filter, findLast, find, keys, last } from 'lodash';
import { t } from 'ttag';

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
import CampaignInvestigatorsComponent from './CampaignInvestigatorsComponent';
import CampaignSummaryHeader from '@components/campaign/CampaignSummaryHeader';
import useTraumaDialog from '@components/campaign/useTraumaDialog';
import { UpdateCampaignActions } from '@data/remote/campaigns';
import { showGuideCampaignLog } from '@components/campaign/nav';
import useConnectionProblemBanner from '@components/core/useConnectionProblemBanner';
import { useArkhamDbError } from '@data/hooks';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import DeckOverlapComponent from '@components/deck/DeckDetailView/DeckOverlapComponent';
import { useLatestDecksCards } from '@components/core/hooks';
import { TarotReadingType, useTarotCardReadingPicker } from '@components/campaign/TarotCardReadingView';
import { CampaignMapProps } from './CampaignMapView';
import LanguageContext from '@lib/i18n/LanguageContext';
import CampaignHeader from './CampaignHeader';
import { showRules } from './nav';
import { useNavigation } from '@react-navigation/native';

const SHOW_WEAKNESS = true;

interface Props {
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
  processedCampaign, displayLinkScenarioCount, footerButtons, updateCampaignActions,
  showLinkedScenario, showAlert, showCountDialog, login,
}: Props) {
  const navigation = useNavigation();
  const { backgroundStyle, width } = useContext(StyleContext);
  const { userId, arkhamDb } = useContext(ArkhamCardsAuthContext);
  const { lang } = useContext(LanguageContext);
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

  const [saving, , saveDeckUpgrade, saveDeck] = useDeckUpgradeAction<StepId>(deckActions, deckUpgradeCompleted);

  const showAddInvestigator = useCallback(() => {
    campaignState.showChooseDeck();
  }, [campaignState]);
  const scenarioId = useMemo(() => last(filter(processedCampaign.scenarios, s => s.type === 'started'))?.id.encodedScenarioId, [processedCampaign.scenarios]);
  const showCampaignLog = useCallback(() => {
    showGuideCampaignLog(
      navigation,
      campaignId,
      campaignGuide,
      processedCampaign.campaignLog,
      { standalone: false, hideChaosBag: true },
      scenarioId,
      processedCampaign
    );
  }, [navigation, processedCampaign, campaignId, campaignGuide, scenarioId]);

  const showCampaignAchievements = useCallback(() => {
    navigation.navigate('Guide.Achievements', { campaignId });
  }, [navigation, campaignId]);
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
  const chaosBagDisabled = useMemo(
    () =>!keys(processedCampaign.campaignLog.chaosBag).length,
    [processedCampaign.campaignLog.chaosBag]
  );
  const allInvestigators = useMemo(
    () => filter(campaignInvestigators, investigator => !processedCampaign.campaignLog.isEliminated(investigator)),
    [campaignInvestigators, processedCampaign.campaignLog]
  );
  const currentScenario = findLast(processedCampaign.scenarios, s => (s.type === 'started' || s.type === 'completed') && s.scenarioGuide.scenarioType() === 'scenario') ||
    find(processedCampaign.scenarios, s => s.type === 'playable' && s.scenarioGuide.scenarioType() === 'scenario');

  const showWeaknessSet = useCallback(() => {
    navigation.navigate('Guide.WeaknessSet', { campaignId });
  }, [navigation, campaignId]);
  const campaignLog = processedCampaign.campaignLog;
  const campaignMap = campaignGuide.campaignMap();
  const showCampaignMap = useCallback(() => {
    if (campaignMap) {
      const investigators = campaignLog.investigatorCodes(false);
      const hasFast = !!find(investigators, code => campaignLog.hasCard(code, campaignMap.fast_code));
      const passProps: CampaignMapProps = {
        campaignId,
        campaignMap,
        currentLocation: campaignLog.campaignData.scarlet.location,
        currentTime: campaignLog.count('time', '$count'),
        statusReports: campaignLog.calendarEntries('time'),
        visitedLocations: campaignLog.campaignData.scarlet.visitedLocations,
        unlockedLocations: campaignLog.campaignData.scarlet.unlockedLocations,
        unlockedDossiers: campaignLog.campaignData.scarlet.unlockedDossiers,
        hasFast,
        subtitle: undefined,
      };
      navigation.navigate('Campaign.Map', passProps);
    }
  }, [navigation, campaignId, campaignMap, campaignLog]);

  const [chaosBagDialog, showChaosBag] = useChaosBagDialog({
    allInvestigators,
    campaignId,
    chaosBag: processedCampaign.campaignLog.chaosBag || {},
    guided: true,
    scenarioId: currentScenario?.id?.encodedScenarioId,
    setChaosBag: updateCampaignActions.setChaosBag,
    cycleCode: campaign.cycleCode,
    processedCampaign,
  });

  const onTarotPress = useCallback((readingType: TarotReadingType) => {
    navigation.navigate('Campaign.Tarot', {
      id: campaignId,
      originalReading: campaign.tarotReading,
      scenarios: campaignGuide.tarotScenarios(),
      readingType,
    });
  }, [navigation, campaignGuide, campaignId, campaign.tarotReading]);
  const [tarotDialog, showTarotDialog] = useTarotCardReadingPicker({
    value: undefined,
    onValueChange: onTarotPress,
  })
  const rules = useMemo(() => processedCampaign.campaignLog.campaignGuide.campaignRules(lang), [lang, processedCampaign.campaignLog.campaignGuide]);
  const errata = useMemo(() => campaignGuide.campaignFaq(), [campaignGuide]);
  const [rulesHeader, rulesDescription] = useMemo(() => {
    if (rules.length && errata.length) {
      return [t`Campaign Rules & FAQ`, t`Review campaign specific info`];
    }
    if (rules.length) {
      return [t`Campaign Rules`, t`Review campaign specific rules`];
    }
    if (errata.length) {
      return [t`Campaign FAQ`, t`Review campaign specific clarifications`];
    }
    return [undefined, undefined];
  }, [rules, errata]);
  const showRulesPressed = useCallback(() => {
    showRules(navigation, campaignId, { rules, campaignErrata: errata });
  }, [navigation, rules, errata, campaignId]);

  const latestDecksList = campaign.latestDecks();
  const [cards] = useLatestDecksCards(latestDecksList, false, latestDecksList.length ? (latestDecksList[0].deck.taboo_id || 0) : 0);
  const [showMap, embarking] = useMemo(() => [
    !!campaignGuide.campaignMap() && !!processedCampaign.campaignLog.campaignData.scarlet.showMap,
    !!processedCampaign.campaignLog.campaignData.scarlet.embark,
  ], [campaignGuide, processedCampaign.campaignLog]);

  return (
    <View style={styles.wrapper}>
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
          <DeckButton
            icon="chaos_bag"
            title={t`Chaos Bag`}
            detail={chaosBagDisabled ? t`Complete campaign setup` : t`Review and draw tokens`}
            disabled={chaosBagDisabled}
            color={chaosBagDisabled ? 'light_gray_outline' : 'light_gray'}
            onPress={showChaosBag}
            bottomMargin={s}
          />
          { showMap && (
            <DeckButton
              icon="map"
              title={t`Map`}
              detail={embarking ? t`Use the embark button below` : t`Review the world map`}
              disabled={embarking}
              color={embarking ? 'light_gray_outline' : 'light_gray'}
              onPress={showCampaignMap}
              bottomMargin={s}
            />
          ) }
        </View>
        <ScenarioCarouselComponent
          processedCampaign={processedCampaign}
          displayLinkScenarioCount={displayLinkScenarioCount}
          showLinkedScenario={showLinkedScenario}
          showAlert={showAlert}
        />
        <View style={space.paddingSideS}>
          <CampaignInvestigatorsComponent
            showAlert={showAlert}
            login={login}
            loading={!campaignInvestigators}
            showAddInvestigator={showAddInvestigator}
            processedCampaign={processedCampaign}
            showTraumaDialog={showTraumaDialog}
            showCountDialog={showCountDialog}
            actions={updateCampaignActions}
            saveDeckUpgrade={saveDeckUpgrade}
            saveDeck={saveDeck}
            savingDeckUpgrade={saving}
          />
        </View>
        <CampaignHeader title={t`Information`} style={space.paddingTopM} />
        <View style={space.paddingSideS}>
          { !!rulesHeader && (
            <DeckButton
              icon="book"
              title={rulesHeader}
              detail={rulesDescription}
              color="light_gray"
              onPress={showRulesPressed}
              bottomMargin={s}
            />
          ) }
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
            icon="special_cards"
            title={t`Tarot Readings`}
            detail={t`Perform readings with the tarot deck`}
            color="light_gray"
            onPress={showTarotDialog}
            bottomMargin={s}
          />
        </View>
        { !!cards && (
          <View style={[space.paddingSideS, space.paddingBottomS]}>
            <DeckOverlapComponent
              cards={cards}
              campaign={campaign}
              latestDecks={latestDecksList}
              campaignInvestigators={campaignInvestigators}
            />
          </View>
        ) }
        { footerButtons }
        <View style={{ height: 120 }} />
      </ScrollView>
      { chaosBagDialog }
      { traumaDialog }
      { tarotDialog }
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
