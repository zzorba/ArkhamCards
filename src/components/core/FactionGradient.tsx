import React, { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { FACTION_DARK_GRADIENTS, FACTION_LIGHT_GRADIENTS, FactionCodeType } from 'constants';

interface Props {
  faction_code: FactionCodeType | 'dead';
  style?: ViewStyle;
  children?: ReactNode;
  dark?: boolean;
}

export default function FactionGradient({
  faction_code,
  style,
  children,
  dark,
}: Props) {
  const colors = dark ?
    FACTION_DARK_GRADIENTS[faction_code] :
    FACTION_LIGHT_GRADIENTS[faction_code];
  return (
    <LinearGradient colors={colors} style={style}>
      { children }
    </LinearGradient>
  );
}
