import React from 'react';
import {
  Button,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { Scenario } from 'components/campaign/constants';
import { ScenarioProps } from '../ScenarioView';
import { SingleCampaign } from 'actions/types';

interface State {
  currentStep: string;
}

interface Props {
  componentId: string;
  campaign: SingleCampaign;
  scenario: Scenario;
}

export default class ScenarioButton extends React.Component<Props, State> {
  _onPress = () => {
    const { componentId, scenario, campaign } = this.props;
    Navigation.push<ScenarioProps>(componentId, {
      component: {
        name: 'Guide.Scenario',
        passProps: {
          campaignId: campaign.id,
          scenarioId: scenario.code,
        },
        options: {
          topBar: {
            title: {
              text: scenario.name,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  };

  render() {
    const { scenario } = this.props;
    return (
      <Button
        title={scenario.name}
        onPress={this._onPress}
      />
    );
  }
}
