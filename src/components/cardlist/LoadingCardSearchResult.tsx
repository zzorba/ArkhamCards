import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import StyleContext from '@styles/StyleContext';
import { rowHeight } from './CardSearchResult/constants';
import ArkhamLoadingSpinner from '@components/core/ArkhamLoadingSpinner';

export default function LoadingCardSearchResult({ noBorder }: { noBorder?: boolean }) {
  const { borderStyle, fontScale } = useContext(StyleContext);
  return (
    <View style={[borderStyle, styles.loadingRow, { height: rowHeight(fontScale) }, noBorder ? undefined : { borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <ArkhamLoadingSpinner autoPlay loop size="tiny" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
