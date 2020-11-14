import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  title: string;
  color?: string;
}

export default function DeckBubbleHeader({ title, color }: Props) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <View style={[space.marginTopS, space.marginBottomS, styles.header, { backgroundColor: color || colors.L20 }]}>
      <Text style={typography.subHeaderText}>
        { title }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderRadius: 16,
    minHeight: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
