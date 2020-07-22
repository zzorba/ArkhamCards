import React from 'react';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { LocationSetupProps } from '../LocationSetupView';
import { LocationSetupStep } from '@data/scenario/types';

interface Props {
  step: LocationSetupStep;
  componentId: string;
}

export default class LocationSetupButton extends React.Component<Props> {
  _press = () => {
    const {
      componentId,
      step,
    } = this.props;
    Navigation.push<LocationSetupProps>(componentId, {
      component: {
        name: 'Guide.LocationSetup',
        passProps: {
          step,
        },
        options: {
          topBar: {
            title: {
              text: step.text,
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
    const { step } = this.props;
    return (
      <BasicButton title={step.text} onPress={this._press} />
    );
  }
}
