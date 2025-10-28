import React, { useContext } from 'react';
import { Platform, View, Text } from 'react-native';

import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface HeaderTitleProps {
  title: string;
  subtitle?: string;
  color?: string;
}

export default function HeaderTitle({ title, subtitle, color }: HeaderTitleProps) {
  const { typography, colors } = useContext(StyleContext);
  return (
    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: Platform.OS === 'ios' ? 'center' : 'flex-start' }}>
      <Text style={[
        typography.header,
        { color: color ?? colors.darkText, textAlign: Platform.OS === 'ios' ? 'center' : 'left' },
      ]} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
      {!!subtitle && (
        <Text style={[
          space.marginBottomS,
          typography.small,
          typography.italic,
          { color: color ?? colors.darkText, textAlign: Platform.OS === 'ios' ? 'center' : 'left' },
        ]} numberOfLines={1} ellipsizeMode="tail">
          {subtitle}
        </Text>
      )}
    </View>
  );
}