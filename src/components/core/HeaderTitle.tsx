import React, { useContext } from 'react';
import { View, Text } from 'react-native';

import StyleContext from '@styles/StyleContext';

interface HeaderTitleProps {
  title: string;
  subtitle?: string;
  color?: string;
}

export default function HeaderTitle({ title, subtitle, color }: HeaderTitleProps) {
  const { typography, colors } = useContext(StyleContext);

  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={[
        typography.header,
        { color: color ?? colors.darkText, textAlign: 'center' },
      ]}>
        {title}
      </Text>
      {!!subtitle && (
        <Text style={[
          typography.subHeaderText,
          { color: color ?? colors.darkText, textAlign: 'center' },
        ]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}