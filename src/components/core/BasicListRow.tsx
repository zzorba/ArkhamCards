import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export default function BasicListRow({ children }: Props) {
  const { borderStyle } = useContext(StyleContext);
  return (
    <View style={[styles.labeledRow, space.paddingS, borderStyle]}>
      <View style={[styles.row, space.paddingSideS]}>
        { children }
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  labeledRow: {
    flexDirection: 'column',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
