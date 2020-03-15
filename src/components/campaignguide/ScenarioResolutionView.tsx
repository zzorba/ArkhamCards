import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import { t} from 'ttag';

import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';
import ResolutionComponent from './ResolutionComponent';
import withCampaignDataContext from './withCampaignDataContext';
import { Resolution } from 'data/scenario/types';

interface Props {
  resolutionId: string;
}

class ScenarioResolutionView extends React.Component<Props> {
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
        return this.renderResolution(resolution);
      }}
      </ScenarioGuideContext.Consumer>
    )
  }
}

export default withCampaignDataContext<Props>(
  ScenarioResolutionView
);

const styles = StyleSheet.create({
  wrapper: {
    marginLeft: 16,
    marginRight: 16,
  },
})
