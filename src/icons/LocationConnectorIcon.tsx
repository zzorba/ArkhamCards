import React from 'react';
import { View, StyleSheet } from 'react-native';

import AppIcon from './AppIcon';

interface Props {
  connector: string;
  size: number;
}
function SymbolIcon({ connector, size }: Props): JSX.Element | null {
  switch (connector) {
    case 'blue_triangle':
      return <AppIcon name="triangle" color="rgb(37,63,95)" size={size} />;
    case 'orange_heart':
      return <AppIcon name="heart" color="rgb(173,88,39)" size={size} />;
    case 'green_diamond':
      return <AppIcon name="diamond" color="rgb(66,114,50)" size={size} />;
    case 'green_clover':
      return <AppIcon name="clover" color="rgb(83,116,90)" size={size} />;
    case 'red_square':
      return <AppIcon name="square" color="rgb(136,22,36)" size={size} />;
    case 'purple_moon':
      return <AppIcon name="moon" color="rgb(89,39,61)" size={size} />;
    default:
      return null;
  }
}

export default function LocationConnectorIcon({ connector, size }: Props) {
  return (
    <View style={[styles.icon, { width: size, height: size }]} key={connector}>
      <View style={[styles.iconBackground, { width: size - 2, height: size - 2, borderRadius: (size / 2) - 1 }]} />
      <SymbolIcon connector={connector} size={size} />
    </View>
  );
}


const styles = StyleSheet.create({
  icon: {
    position: 'relative',
  },
  iconBackground: {
    position: 'absolute',
    top: 1,
    left: 1,
    backgroundColor: 'white',
  },
});
