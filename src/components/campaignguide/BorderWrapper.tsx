import React from 'react';
import { StyleSheet, View } from 'react-native';

import StepBorder from './StepBorder';
import { l, m } from '@styles/space';

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
    paddingBottom: l,
  },
  wrapper: {
    position: 'relative',
    marginTop: m,
    marginBottom: m,
  },
});
