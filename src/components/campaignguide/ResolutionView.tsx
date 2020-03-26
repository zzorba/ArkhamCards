import React from 'react';
import {
  ScrollView,
} from 'react-native';

import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';
import ResolutionComponent from './ResolutionComponent';
import withCampaignDataContext, { CampaignDataInputProps } from './withCampaignDataContext';

interface Props {
  resolutionId: string;
}

export type ResolutionProps = Props & CampaignDataInputProps;

class ResolutionView extends React.Component<Props> {
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
              <ResolutionComponent
                resolution={resolution}
                mainResolution
              />
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
