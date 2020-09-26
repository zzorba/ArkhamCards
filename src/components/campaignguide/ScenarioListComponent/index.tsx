import React, { useContext } from 'react';
import { View } from 'react-native';
import { map } from 'lodash';

import { ProcessedCampaign } from '@data/scenario';
import ScenarioButton from './ScenarioButton';
import AddSideScenarioButton from './AddSideScenarioButton';
import { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  componentId: string;
  campaignId: number;
  processedCampaign: ProcessedCampaign;
  campaignData: CampaignGuideContextType;
  showLinkedScenario?: (scenarioId: string) => void;
}

export default function ScenarioListTab({
  componentId,
  campaignId,
  processedCampaign,
  campaignData: {
    campaignGuide,
    campaignState,
  },
  showLinkedScenario,
}: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  return (
    <View style={[space.paddingBottomL, backgroundStyle]}>
      { map(processedCampaign.scenarios, (scenario, idx) => (
        <ScenarioButton
          key={idx}
          componentId={componentId}
          scenario={scenario}
          campaignId={campaignId}
          campaignGuide={campaignGuide}
          showLinkedScenario={showLinkedScenario}
          linked={processedCampaign.campaignLog.linked}
        />
      )) }
      <AddSideScenarioButton
        componentId={componentId}
        campaignId={campaignId}
        processedCampaign={processedCampaign}
        campaignGuide={campaignGuide}
        campaignState={campaignState}
      />
    </View>
  );
}
