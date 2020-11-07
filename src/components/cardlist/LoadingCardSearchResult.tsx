import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import StyleContext from '@styles/StyleContext';
import { rowHeight } from './CardSearchResult/constants';

export default function LoadingCardSearchResult() {
  const { borderStyle, colors, fontScale } = useContext(StyleContext);
  return (
    <View style={[borderStyle, styles.loadingRow, { height: rowHeight(fontScale) }]}>
      <ActivityIndicator color={colors.lightText} animating size="small" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
