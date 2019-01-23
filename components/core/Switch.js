import React from 'react';
import {
  Platform,
  Switch,
} from 'react-native';

import { COLORS } from '../../styles/colors';

export default function CustomSwitch(props) {
  return (
    <Switch
      thumbColor={Platform.OS === 'android' ? COLORS.lightBlue : null}
      trackColor={COLORS.switchTrackColor}
      {...props}
    />
  );
}
