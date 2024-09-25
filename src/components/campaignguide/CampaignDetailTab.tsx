import React, { useCallback, useContext, useMemo } from 'react';
import { InteractionManager, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { filter, findLast, find, keys, last } from 'lodash';
import { t } from 'ttag';
import { Navigation, OptionsModalPresentationStyle, OptionsModalTransitionStyle } from 'react-native-navigation';

import { iconsMap } from '@app/NavIcons';
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
import DeckOverlapComponent from '@components/deck/DeckDetailView/DeckOverlapComponent';
import { useLatestDecksCards } from '@components/core/hooks';
import { getTarotReadingLabel, TarotCardReadingProps, TarotReadingType, useTarotCardReadingPicker } from '@components/campaign/TarotCardReadingView';
import { CampaignMapProps } from './CampaignMapView';
import COLORS from '@styles/colors';
import LanguageContext from '@lib/i18n/LanguageContext';
import { CampaignRulesProps } from './CampaignRulesView';
import { CAMPAIGN_SETUP_ID } from '@data/scenario/CampaignGuide';
import CampaignHeader from './CampaignHeader';
import { showRules } from './nav';

const SHOW_WEAKNESS = true;

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
  const { backgroundStyle, typography, width } = useContext(StyleContext);
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
      componentId,
      campaignId,
      campaignGuide,
      processedCampaign.campaignLog,
      { standalone: false, hideChaosBag: true },
      scenarioId,
      processedCampaign
    );
  }, [componentId, campaignId, campaignGuide, processedCampaign, scenarioId]);

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
      };
      Navigation.showModal<CampaignMapProps>({
        stack: {
          children: [{
            component: {
              name: 'Campaign.Map',
              passProps,
              options: {
                topBar: {
                  title: {
                    text: t`Map`,
                  },
                  leftButtons: [{
                    icon: iconsMap.dismiss,
                    id: 'close',
                    color: COLORS.M,
                    accessibilityLabel: t`Close`,
                  }],
                },
                layout: {
                  backgroundColor: '0x8A9284',
                },
                modalPresentationStyle: Platform.OS === 'ios' ?
                  OptionsModalPresentationStyle.fullScreen :
                  OptionsModalPresentationStyle.overCurrentContext,
                modalTransitionStyle: OptionsModalTransitionStyle.crossDissolve,
              },
            },
          }],
        },
      });
    }
  }, [campaignId, campaignMap, campaignLog]);

  const [chaosBagDialog, showChaosBag] = useChaosBagDialog({
    componentId,
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
    Navigation.push<TarotCardReadingProps>(componentId, {
      component: {
        name: 'Campaign.Tarot',
        passProps: {
          id: campaignId,
          originalReading: campaign.tarotReading,
          scenarios: campaignGuide.tarotScenarios(),
          readingType,
        },
        options: {
          topBar: {
            title: {
              text: t`Tarot Reading`,
            },
            subtitle: {
              text: getTarotReadingLabel(readingType),
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [componentId, campaignGuide, campaignId, campaign.tarotReading]);
  const [tarotDialog, showTarotDialog] = useTarotCardReadingPicker({
    value: undefined,
    onValueChange: onTarotPress,
  })
  const rules = useMemo(() => processedCampaign.campaignLog.campaignGuide.campaignRules(lang), [lang]);
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
  }, [rules]);
  const showRulesPressed = useCallback(() => {
    showRules(componentId, campaignId, { rules, campaignErrata: errata });
  }, [componentId, rules, errata, rulesHeader, campaignId]);

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
          componentId={componentId}
          processedCampaign={processedCampaign}
          displayLinkScenarioCount={displayLinkScenarioCount}
          showLinkedScenario={showLinkedScenario}
          showAlert={showAlert}
        />
        <View style={space.paddingSideS}>
          <CampaignInvestigatorsComponent
            componentId={componentId}
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
              componentId={componentId}
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
