import React, { useCallback } from 'react';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { LocationSetupProps } from '../LocationSetupView';
import { LocationSetupStep } from '@data/scenario/types';
import ArkhamButton from '@components/core/ArkhamButton';

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
    <ArkhamButton icon="show" title={step.text} onPress={onPress} />
  );
}
