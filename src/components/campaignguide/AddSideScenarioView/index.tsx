import React from 'react';
import { ScrollView } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { find, flatMap } from 'lodash';

import SideScenarioButton from './SideScenarioButton';
import { NavigationProps } from 'components/nav/types';
import CampaignGuideContext, { CampaignGuideContextType } from 'components/campaignguide/CampaignGuideContext';
import withCampaignGuideContext, { CampaignGuideInputProps, CampaignGuideProps } from 'components/campaignguide/withCampaignGuideContext';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { ScenarioId } from 'data/scenario';
import { Scenario } from 'data/scenario/types';

export interface AddSideScenarioProps extends CampaignGuideInputProps {
  latestScenarioId: ScenarioId;
}

type Props = NavigationProps & DimensionsProps & AddSideScenarioProps & CampaignGuideProps;

class AddSideScenarioView extends React.Component<Props> {
  static contextType = CampaignGuideContext;
  context!: CampaignGuideContextType;

  _onPress = (scenario: Scenario) => {
    const { componentId, latestScenarioId } = this.props;
    this.context.campaignState.startOfficialSideScenario(
      scenario.id,
      latestScenarioId.encodedScenarioId,
    );
    Navigation.pop(componentId);
  };

  render() {
    const {
      fontScale,
      campaignData: {
        campaignGuide,
        campaignState,
      },
    } = this.props;
    const processedCampaign = campaignGuide.processAllScenarios(campaignState);
    return (
      <ScrollView>
        { flatMap(campaignGuide.sideScenarios(), scenario => {
          const alreadyPlayed = !!find(
            processedCampaign.scenarios,
            playedScenario => playedScenario.id.scenarioId === scenario.id
          );
          if (alreadyPlayed) {
            // Already played this one.
            return [];
          }
          return (
            <SideScenarioButton
              key={scenario.id}
              scenario={scenario}
              onPress={this._onPress}
              fontScale={fontScale}
            />
          );
        }) }
      </ScrollView>
    );
  }
}

export default withCampaignGuideContext(
  withDimensions(AddSideScenarioView)
);
