import React, { useContext } from 'react';
import {
  Platform,
  Switch,
  SwitchProps,
} from 'react-native';

import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';

interface Props extends SwitchProps {
  customColor?: string;
  customTrackColor?: string;
}

export default function CustomSwitch({ customColor, customTrackColor, ...otherProps }: Props) {
  const { colors } = useContext(StyleContext);
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
      trackColor={customTrackColor ? {
        false: customTrackColor,
        true: customTrackColor,
      } : undefined}
      ios_backgroundColor={colors.background}
      {...otherProps}
    />
  );
}
