import React from 'react';
import {
  Platform,
  Switch,
  SwitchProps,
} from 'react-native';

import { COLORS } from 'styles/colors';

export default function CustomSwitch(props: SwitchProps) {
  return (
    <Switch
      thumbColor={Platform.OS === 'android' ? COLORS.lightBlue : undefined}
      trackColor={COLORS.switchTrackColor}
      ios_backgroundColor="#FFF"
      {...props}
    />
  );
}
