import React, { useContext } from 'react';
import { Text, View } from 'react-native';

import StyleContext from '@styles/StyleContext';
import space from '@styles/space';

interface Props {
  title: string;
  color?: 'light' | 'dark';
  normalCase?: boolean;
}

export default function CardDetailSectionHeader({ title, color = 'light', normalCase }: Props) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <View style={space.marginTopS}>
      <Text style={[typography.large, { color: color === 'light' ? colors.M : colors.D20 }, typography.center, !normalCase ? typography.uppercase : undefined]}>
        { `— ${title} —` }
      </Text>
    </View>
  );
}