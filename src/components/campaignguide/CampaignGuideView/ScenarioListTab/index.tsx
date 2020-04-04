import React from 'react';
import { ScrollView } from 'react-native';
import { map } from 'lodash';

import { ProcessedCampaign } from 'data/scenario/CampaignGuide';
import ScenarioButton from './ScenarioButton';

interface Props {
  componentId: string;
  fontScale: number;
  campaignId: number;
  processedCampaign: ProcessedCampaign;
}

export default class ScenarioListTab extends React.Component<Props> {
  render() {
    const { fontScale, componentId, campaignId, processedCampaign } = this.props;
    return (
      <ScrollView>
        { map(processedCampaign.scenarios, (scenario, idx) => (
          <ScenarioButton
            key={idx}
            fontScale={fontScale}
            componentId={componentId}
            scenario={scenario}
            campaignId={campaignId}
          />
        )) }
      </ScrollView>
    );
  }
}
