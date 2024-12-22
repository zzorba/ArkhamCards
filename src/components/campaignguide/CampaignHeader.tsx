import React, { useContext } from 'react';
import { Text, View, ViewProps } from 'react-native';

import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

export default function CampaignHeader({ title, style }: { title: string; style?: ViewProps['style'] }) {
  const { typography } = useContext(StyleContext);
  return (
    <View style={[space.paddingBottomS, style]}>
      <Text style={[typography.large, typography.center, typography.light]}>
        { `— ${title} —` }
      </Text>
    </View>
  );
}