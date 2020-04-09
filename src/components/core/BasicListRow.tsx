import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export default function BasicListRow({ children }: Props) {
  return (
    <View style={[styles.labeledRow, styles.border]}>
      <View style={styles.row}>
        { children }
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  buttonWrapper: {
    padding: 8,
  },
  message: {
    padding: 16,
  },
  labeledRow: {
    flexDirection: 'column',
    padding: 8,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#bdbdbd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
  },
});
