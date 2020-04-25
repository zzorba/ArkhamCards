import React from 'react';
import { View } from 'react-native';
import { map } from 'lodash';

import { ProcessedCampaign } from 'data/scenario';
import ScenarioButton from './ScenarioButton';
import AddSideScenarioButton from './AddSideScenarioButton';
import { CampaignGuideContextType } from 'components/campaignguide/CampaignGuideContext';
import space from 'styles/space';

interface Props {
  componentId: string;
  fontScale: number;
  campaignId: number;
  processedCampaign: ProcessedCampaign;
  campaignData: CampaignGuideContextType;
  showLinkedScenario?: (
    scenarioId: string
  ) => void;
}

export default class ScenarioListTab extends React.Component<Props> {
  render() {
    const {
      fontScale,
      componentId,
      campaignId,
      processedCampaign,
      campaignData: {
        campaignGuide,
        campaignState,
      },
      showLinkedScenario,
    } = this.props;
    return (
      <View style={space.marginBottomL}>
        { map(processedCampaign.scenarios, (scenario, idx) => (
          <ScenarioButton
            key={idx}
            fontScale={fontScale}
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
}
