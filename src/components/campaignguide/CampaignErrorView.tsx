import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import StyleContext from '@styles/StyleContext';
import space from '@styles/space';

interface Props {
  message: string;
}
export default function CampaignErrorView({ message }: Props) {
  const { backgroundStyle, typography } = useContext(StyleContext);
  return (
    <View style={[styles.wrapper, backgroundStyle, space.paddingSideS, typography.center]}>
      <Text style={typography.text}>
        { message }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
