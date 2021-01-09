import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  title: string;
  color?: string;
  inverted?: boolean;
  crossedOut?: boolean;
}

export default function DeckBubbleHeader({ title, color, inverted, crossedOut }: Props) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <View style={[space.marginTopS, space.marginBottomS, styles.header, { backgroundColor: color || (inverted ? colors.D20 : colors.L20) }]}>
      <Text style={[typography.subHeaderText, inverted ? typography.inverted : undefined, crossedOut ? styles.crossedOut : undefined]}>
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
  crossedOut: {
    textDecorationLine: 'line-through',
  },
});
