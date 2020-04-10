import React from 'react';
import { StyleSheet, View } from 'react-native';

import StepBorder from './StepBorder';

interface Props {
  width: number;
  border: boolean;
  children: React.ReactNode | React.ReactNode[];
}

export default function BorderWrapper({ border, children, width }: Props) {
  if (!border) {
    return (
      <>
        { children }
      </>
    );
  }
  return (
    <View style={styles.wrapper}>
      <StepBorder type="top" width={width} margin={16} />
      <View style={styles.innerWrapper}>
        { children }
      </View>
      <StepBorder type="bottom" width={width} margin={16} />
    </View>
  );
}

const styles = StyleSheet.create({
  innerWrapper: {
    paddingBottom: 32,
  },
  wrapper: {
    position: 'relative',
    marginTop: 16,
    marginBottom: 16,
  },
});
