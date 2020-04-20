import React from 'react';
import { map } from 'lodash';

import { ProcessedCampaign } from 'data/scenario';
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
      <>
        { map(processedCampaign.scenarios, (scenario, idx) => (
          <ScenarioButton
            key={idx}
            fontScale={fontScale}
            componentId={componentId}
            scenario={scenario}
            campaignId={campaignId}
          />
        )) }
      </>
    );
  }
}
