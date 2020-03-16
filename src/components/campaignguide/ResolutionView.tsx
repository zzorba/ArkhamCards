import React from 'react';
import {
  ScrollView,
} from 'react-native';

import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';
import ResolutionComponent from './ResolutionComponent';
import withCampaignDataContext, { CampaignDataInputProps } from './withCampaignDataContext';
import { Resolution } from 'data/scenario/types';

interface Props {
  resolutionId: string;
}

export type ResolutionProps = Props & CampaignDataInputProps;

class ResolutionView extends React.Component<Props> {
  renderResolution(resolution: Resolution) {
    return (
      <ResolutionComponent
        resolution={resolution}
      />
    );
  }

  render() {
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioGuide }: ScenarioGuideContextType) => {
          const { resolutionId } = this.props;
          const resolution = scenarioGuide.resolution(resolutionId);
          if (!resolution) {
            return null;
          }
          return (
            <ScrollView>
              { this.renderResolution(resolution) }
            </ScrollView>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}

export default withCampaignDataContext<Props>(
  ResolutionView
);
