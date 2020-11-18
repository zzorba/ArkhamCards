import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  title: string;
  first?: boolean;
}
export default function DeckSlotHeader({ title, first }: Props) {
  const { colors, typography, borderStyle } = useContext(StyleContext);
  return (
    <View style={[first ? space.marginTopS : space.marginTopM, styles.row, borderStyle]}>
      <Text style={[typography.small, typography.italic, { color: colors.M }]}>
        { title }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
