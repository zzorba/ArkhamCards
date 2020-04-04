import React from 'react';
import { ScrollView } from 'react-native';
import { map } from 'lodash';

import { SingleCampaign } from 'actions/types';
import { ProcessedCampaign } from 'data/scenario/CampaignGuide';
import ScenarioButton from './ScenarioButton';

interface Props {
  componentId: string;
  fontScale: number;
  campaign: SingleCampaign;
  processedCampaign: ProcessedCampaign;
}

export default class ScenarioListTab extends React.Component<Props> {
  render() {
    const { fontScale, componentId, campaign, processedCampaign } = this.props;
    return (
      <ScrollView>
        { map(processedCampaign.scenarios, (scenario, idx) => (
          <ScenarioButton
            key={idx}
            fontScale={fontScale}
            componentId={componentId}
            scenario={scenario}
            campaign={campaign}
          />
        )) }
      </ScrollView>
    );
  }
}
