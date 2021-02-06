import React, { useCallback, useContext, useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { filter, keys } from 'lodash';
import { t } from 'ttag';
import { Navigation } from 'react-native-navigation';

import { ProcessedCampaign } from '@data/scenario';
import StyleContext from '@styles/StyleContext';
import { ShowAlert, ShowCountDialog } from '@components/deck/dialogs';
import space, { s } from '@styles/space';
import Card from '@data/Card';
import { Campaign, CampaignCycleCode, CampaignId, Trauma } from '@actions/types';
import { useDispatch } from 'react-redux';
import { updateCampaign } from '@components/campaign/actions';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { ShowScenario } from './LinkedCampaignGuideView/useCampaignLinkHelper';
import DeckButton from '@components/deck/controls/DeckButton';
import useChaosBagDialog from '@components/campaign/CampaignDetailView/useChaosBagDialog';
import CampaignGuideContext from './CampaignGuideContext';
import ScenarioCarouselComponent from './ScenarioCarouselComponent';
import { CampaignLogProps } from './CampaignLogView';
import { CampaignAchievementsProps } from './CampaignAchievementsView';
import CampaignInvestigatorsComponent from './CampaignInvestigatorsComponent';
import CampaignSummaryHeader from '@components/campaign/CampaignSummaryHeader';

interface Props {
  componentId: string;
  processedCampaign: ProcessedCampaign;
  showAlert: ShowAlert;
  showCountDialog: ShowCountDialog;
  showLinkedScenario?: ShowScenario;
  showTraumaDialog: (investigator: Card, traumaData: Trauma, onUpdate?: (code: string, trauma: Trauma) => void) => void;
  headerButtons: React.ReactNode;
  displayLinkScenarioCount?: number;
}
export default function CampaignDetailTab({
  componentId, processedCampaign, headerButtons, displayLinkScenarioCount,
  showLinkedScenario, showAlert, showTraumaDialog, showCountDialog,
}: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  const { user } = useContext(ArkhamCardsAuthContext);
  const { campaignId, campaignGuide, campaignState, campaignInvestigators } = useContext(CampaignGuideContext);
  const dispatch = useDispatch();
  const saveCampaignUpdate = useCallback((campaignId: CampaignId, sparseCampaign: Partial<Campaign>, now?: Date) => {
    console.log('Updating campaign data');
    dispatch(updateCampaign(user, campaignId, sparseCampaign, now));
  }, [dispatch, user]);

  const showAddInvestigator = useCallback(() => {
    campaignState.showChooseDeck();
  }, [campaignState]);
  const showCampaignLog = useCallback(() => {
    Navigation.push<CampaignLogProps>(componentId, {
      component: {
        name: 'Guide.Log',
        passProps: {
          campaignId,
          campaignGuide,
          campaignLog: processedCampaign.campaignLog,
          hideChaosBag: true,
        },
        options: {
          topBar: {
            title: {
              text: t`Campaign Log`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [componentId, campaignId, campaignGuide, processedCampaign.campaignLog]);

  const showCampaignAchievements = useCallback(() => {
    Navigation.push<CampaignAchievementsProps>(componentId, {
      component: {
        name: 'Guide.Achivements',
        passProps: {
          campaignId,
        },
        options: {
          topBar: {
            title: {
              text: t`Achivements`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [componentId, campaignId]);

  const chaosBagDisabled = useMemo(() => !keys(processedCampaign.campaignLog.chaosBag).length, [processedCampaign.campaignLog.chaosBag]);
  const allInvestigators = useMemo(() => filter(campaignInvestigators, investigator => !processedCampaign.campaignLog.isEliminated(investigator)), [campaignInvestigators, processedCampaign.campaignLog]);
  const [chaosBagDialog, showChaosBag] = useChaosBagDialog({ componentId, allInvestigators, campaignId, chaosBag: processedCampaign.campaignLog.chaosBag || {}, guided: true });
  return (
    <SafeAreaView style={[styles.wrapper, backgroundStyle]}>
      <ScrollView contentContainerStyle={backgroundStyle} showsVerticalScrollIndicator={false}>
        <View style={[space.paddingSideS, space.paddingBottomS]}>
          <CampaignSummaryHeader
            difficulty={processedCampaign.campaignLog.campaignData.difficulty}
            name={campaignGuide.campaignName()}
            cycle={campaignGuide.campaignCycleCode() as CampaignCycleCode}
            buttons={headerButtons}
          />
          <DeckButton
            icon="log"
            title={t`Campaign Log`}
            detail={t`Review records`}
            color="light_gray"
            onPress={showCampaignLog}
            bottomMargin={s}
          />
          { campaignGuide.achievements().length > 0 && (
            <DeckButton
              icon="finish"
              title={t`Achievements`}
              detail={t`Record campaign achivements`}
              color="light_gray"
              onPress={showCampaignAchievements}
              bottomMargin={s}
            />
          ) }
          <DeckButton
            icon="chaos_bag"
            title={t`Chaos Bag`}
            detail={chaosBagDisabled ? t`Complee campaign setup first` : t`Review and draw tokens`}
            disabled={chaosBagDisabled}
            color="light_gray"
            onPress={showChaosBag}
            bottomMargin={s}
          />
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
            updateCampaign={saveCampaignUpdate}
            processedCampaign={processedCampaign}
            showTraumaDialog={showTraumaDialog}
            showCountDialog={showCountDialog}
          />
        </View>
      </ScrollView>
      { chaosBagDialog }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
