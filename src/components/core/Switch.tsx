import React from 'react';
import {
  Platform,
  Switch,
  SwitchProps,
} from 'react-native';

import COLORS from 'styles/colors';

interface Props extends SwitchProps {
  customColor?: string;
  customTrackColor?: string;
}

export default function CustomSwitch({ customColor, customTrackColor, ...otherProps }: Props) {
  if (Platform.OS === 'android') {
    return (
      <Switch
        thumbColor={customColor || COLORS.lightBlue}
        trackColor={customTrackColor ? {
          false: customTrackColor,
          true: customTrackColor,
        } : undefined}
        {...otherProps}
      />
    );
  }
  return (
    <Switch
      //trackColor={COLORS.switchTrackColor}
      //ios_backgroundColor={COLORS.background}
      {...otherProps}
    />
  );
}
