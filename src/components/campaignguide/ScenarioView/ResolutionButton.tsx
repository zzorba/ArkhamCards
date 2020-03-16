import React from 'react';
import {
  Button,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { Resolution } from 'data/scenario/types';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import { ResolutionProps } from '../ResolutionView';

interface Props {
  componentId: string;
  resolution: Resolution;
}

export default class ResolutionButton extends React.Component<Props, {}, ScenarioGuideContextType> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;

  _onPress = () => {
    const { componentId, resolution } = this.props;
    const { campaign, scenarioGuide } = this.context;
    Navigation.push<ResolutionProps>(componentId, {
      component: {
        name: 'Guide.Resolution',
        passProps: {
          campaignId: campaign.id,
          scenarioId: scenarioGuide.scenario.id,
          resolutionId: resolution.id,
        },
        options: {
          topBar: {
            title: {
              text: resolution.id === 'no_resolution' ?
                t`No Resolution` :
                resolution.title,
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
    const { resolution } = this.props;
    return (
      <Button title={resolution.title} onPress={this._onPress} />
    );
  }
}
