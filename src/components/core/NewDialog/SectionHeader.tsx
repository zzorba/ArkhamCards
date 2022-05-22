import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import StyleContext from '@styles/StyleContext';
import { s } from '@styles/space';

interface Props {
  text: string;
  paddingTop?: number,
  paddingBottom?: number;
}
export default function SectionHeader({ text, paddingBottom = s, paddingTop }: Props) {
  const { typography } = useContext(StyleContext);
  return (
    <View style={[styles.row, { paddingBottom, paddingTop }]}>
      <Text style={[typography.menuText, typography.center, styles.text]}>
        { text }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    flex: 1,
  },
});
