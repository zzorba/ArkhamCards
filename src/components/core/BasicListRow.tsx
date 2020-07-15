import React from 'react';
import { StyleSheet, View } from 'react-native';

import space from '@styles/space';
import COLORS from '@styles/colors';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export default function BasicListRow({ children }: Props) {
  return (
    <View style={[styles.labeledRow, space.paddingS, styles.border]}>
      <View style={[styles.row, space.paddingSideS]}>
        { children }
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  labeledRow: {
    flexDirection: 'column',
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
