import React, { useContext } from 'react';
import { Text, View } from 'react-native';

import StyleContext from '@styles/StyleContext';
import space from '@styles/space';

interface Props {
  title: string;
}

export default function CardDetailSectionHeader({ title }: Props) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <View style={space.marginTopS}>
      <Text style={[typography.large, { color: colors.M }, typography.center, typography.uppercase]}>{ `— ${title} —` }</Text>
    </View>
  );
}