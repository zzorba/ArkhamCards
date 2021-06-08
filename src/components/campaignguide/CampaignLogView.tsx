import React, { useContext } from 'react';
import { ScrollView } from 'react-native';

import { NavigationProps } from '@components/nav/types';
import CampaignGuide from '@data/scenario/CampaignGuide';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import CampaignLogComponent from './CampaignLogComponent';
import StyleContext from '@styles/StyleContext';
import { CampaignId } from '@actions/types';
import { useScenarioGuideContext } from './withScenarioGuideContext';

export interface CampaignLogProps {
  campaignId: CampaignId;
  campaignGuide: CampaignGuide;
  campaignLog: GuidedCampaignLog;
  scenarioId?: string;
  standalone?: boolean;
  hideChaosBag?: boolean;
}

type Props = CampaignLogProps & NavigationProps;

export default function CampaignLogView({
  campaignId,
  campaignGuide,
  scenarioId,
  campaignLog,
  componentId,
  standalone,
  hideChaosBag = false,
}: Props) {
  const { backgroundStyle, width } = useContext(StyleContext);
  const [, scenarioContext] = useScenarioGuideContext(campaignId, scenarioId, false, standalone);
  const liveCampaignLog = scenarioContext?.processedScenario?.latestCampaignLog || campaignLog;
  return (
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
      />
    </ScrollView>
  );
}
