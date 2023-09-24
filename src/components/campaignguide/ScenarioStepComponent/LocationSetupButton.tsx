import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { LocationSetupProps } from '../LocationSetupView';
import { LocationSetupStep } from '@data/scenario/types';
import ArkhamButton from '@components/core/ArkhamButton';
import DeckButton from '@components/deck/controls/DeckButton';
import space from '@styles/space';

interface Props {
  step: LocationSetupStep;
  componentId: string;
}

export default function LocationSetupButton({ componentId, step }: Props) {
  const onPress = useCallback(() => {
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
  }, [componentId, step]);
  return (
    <View style={space.marginSideM}>
      <DeckButton
        icon="show"
        color="dark_gray"
        title={step.text}
        detail={step.description}
        onPress={onPress}
      />
    </View>
  );
}
