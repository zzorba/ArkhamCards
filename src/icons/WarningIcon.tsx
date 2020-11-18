import React, { useContext } from 'react';
import { View } from 'react-native';

import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';

interface Props {
  size: number;
}
export default function WarningIcon({ size }: Props) {
  const { colors } = useContext(StyleContext);
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.warn }}>
      <AppIcon name="warning" size={size - 1} color={colors.D30} />
    </View>
  );
}