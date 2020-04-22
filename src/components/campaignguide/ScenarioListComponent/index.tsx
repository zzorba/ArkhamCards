import React from 'react';
import { map } from 'lodash';

import { ProcessedCampaign } from 'data/scenario';
import ScenarioButton from './ScenarioButton';
import AddSideScenarioButton from './AddSideScenarioButton';
import { CampaignGuideContextType } from 'components/campaignguide/CampaignGuideContext';


interface Props {
  componentId: string;
  fontScale: number;
  campaignId: number;
  processedCampaign: ProcessedCampaign;
  campaignData: CampaignGuideContextType;
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
    } = this.props;
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
        <AddSideScenarioButton
          componentId={componentId}
          campaignId={campaignId}
          processedCampaign={processedCampaign}
          campaignGuide={campaignGuide}
          campaignState={campaignState}
        />
      </>
    );
  }
}
