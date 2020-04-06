import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { LocationSetupProps } from '../LocationSetupView';
import { LocationSetupStep } from 'data/scenario/types';

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
              text: step.title,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    })
  };

  render() {
    const { step } = this.props;
    return (
      <View style={styles.buttonWrapper}>
        <Button title={step.title} onPress={this._press} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonWrapper: {
    padding: 8,
  },
});
