import React from 'react';
import { StyleSheet, View } from 'react-native';

import LoadingSpinner from '../LoadingSpinner';

interface Props {
  message: string;
}
export default function SpinnerLine({ message }: Props) {
  return (
    <View style={styles.row}>
      <LoadingSpinner inline arkham message={message} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
