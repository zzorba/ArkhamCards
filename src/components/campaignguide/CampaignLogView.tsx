import React, { useContext, useEffect, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { find, findLast } from 'lodash';
import { t } from 'ttag';

import { NavigationProps } from '@components/nav/types';
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
import { Navigation } from 'react-native-navigation';

export interface CampaignLogProps {
  campaignId: CampaignId;
  campaignGuide: CampaignGuide;
  campaignLog: GuidedCampaignLog;
  scenarioId?: string;
  standalone?: boolean;
  hideChaosBag?: boolean;
  processedCampaign?: ProcessedCampaign;
}

type Props = CampaignLogProps & NavigationProps;

export default function CampaignLogView({
  campaignId,
  campaignGuide,
  scenarioId,
  campaignLog,
  componentId,
  standalone,
  processedCampaign: initialProcessedCampaign,
  hideChaosBag = false,
}: Props) {
  const { backgroundStyle, width } = useContext(StyleContext);
  const [campaignContext, scenarioContext, processedCampaign, processedCampaignError] = useScenarioGuideContext(campaignId, scenarioId, false, standalone, initialProcessedCampaign);

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
      Navigation.mergeOptions(componentId, {
        topBar: {
          title: {
            text: t`Campaign Log`,
          },
          subtitle: {
            text: t`After completion of ${scenarionName}`,
          },
          backButton: {
            title: t`Back`,
          },
        },
      });
    }
  }, [current, componentId, scenarionName]);
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
          componentId={componentId}
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
