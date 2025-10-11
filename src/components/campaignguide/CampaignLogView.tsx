import React, { useContext, useEffect, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { find, findLast } from 'lodash';
import { t } from 'ttag';

import CampaignGuide from '@data/scenario/CampaignGuide';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import CampaignLogComponent from './CampaignLogComponent';
import StyleContext from '@styles/StyleContext';
import { CampaignId } from '@actions/types';
import { useScenarioGuideContext } from './withScenarioGuideContext';
import LoadingSpinner from '@components/core/LoadingSpinner';
import CampaignGuideContext from './CampaignGuideContext';
import CampaignErrorView from './CampaignErrorView';
import { ProcessedCampaign } from '@data/scenario';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';
import HeaderTitle from '@components/core/HeaderTitle';
import { useDismissOnCampaignDeleted } from '@data/remote/campaigns';


export interface CampaignLogProps {
  campaignId: CampaignId;
  campaignGuide: CampaignGuide;
  campaignLog: GuidedCampaignLog;
  scenarioId?: string;
  standalone?: boolean;
  hideChaosBag?: boolean;
  processedCampaign?: ProcessedCampaign;
}

export default function CampaignLogView() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Guide.Log'>>();
  const {
    campaignId,
    campaignGuide,
    scenarioId,
    campaignLog,
    standalone,
    processedCampaign: initialProcessedCampaign,
    hideChaosBag = false,
  } = route.params;
  const navigation = useNavigation();
  const { backgroundStyle, colors, width } = useContext(StyleContext);
  const [campaignContext, scenarioContext, processedCampaign, processedCampaignError] = useScenarioGuideContext(campaignId, scenarioId, false, standalone, initialProcessedCampaign);
  useDismissOnCampaignDeleted(navigation, campaignContext?.campaign);

  const interScenarioId = useMemo(() => {
    if (processedCampaign && !find(processedCampaign.scenarios, scenario => scenario.type === 'started') &&
      !!find(processedCampaign.scenarios, scenario => scenario.type === 'completed')) {
      return findLast(processedCampaign.scenarios, s => s.type === 'completed')?.id.encodedScenarioId;
    }
    return undefined;
  }, [processedCampaign]);
  const current = !!scenarioContext?.processedScenario.canUndo;
  const scenarionName = scenarioContext?.processedScenario.scenarioGuide.scenarioName();
  useEffect(() => {
    if (!current && scenarionName) {
      navigation.setOptions({
        headerTitle: () => (
          <HeaderTitle
            title={t`Campaign Log`}
            subtitle={t`After completion of ${scenarionName}`}
            color={colors.darkText}
          />
        ),
      });
    }
  }, [current, scenarionName, navigation, colors]);
  const liveCampaignLog = scenarioContext?.processedScenario?.latestCampaignLog || processedCampaign?.campaignLog || campaignLog;

  if (!campaignContext) {
    if (processedCampaignError) {
      return <CampaignErrorView message={processedCampaignError} />;
    }
    return <LoadingSpinner large />;
  }
  return (
    <CampaignGuideContext.Provider value={campaignContext}>
      <ScrollView contentContainerStyle={backgroundStyle}>
        <CampaignLogComponent
          campaignId={campaignId}
          campaignGuide={campaignGuide}
          campaignLog={liveCampaignLog}
          scenarioId={scenarioId}
          standalone={standalone}
          hideChaosBag={hideChaosBag}
          width={width}
          interScenarioId={interScenarioId}
          hideChaosBagButtons={!current}
          processedCampaign={processedCampaign}
        />
      </ScrollView>
    </CampaignGuideContext.Provider>
  );
}
