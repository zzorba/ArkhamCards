import React, { useContext } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import ArkhamIcon from '@icons/ArkhamIcon';
import StyleContext from '@styles/StyleContext';

export function costIconSize(fontScale: number) {
  const scaleFactor = ((fontScale - 1) / 2 + 1);
  return 32 * scaleFactor;
}

interface Props {
  count?: number;
  type: 'health' | 'sanity';
}

export default function HealthSanityIcon({ type, count }: Props) {
  const { fontScale, colors } = useContext(StyleContext);
  const scaleFactor = ((fontScale - 1) / 2 + 1);
  const ICON_SIZE = 32 * scaleFactor;
  const NUMBER_SIZE = 28 * scaleFactor;
  const style = {
    width: costIconSize(fontScale) * 1.4,
    height: costIconSize(fontScale),
  };
  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.icon, type === 'health' ? styles.healthIcon : styles.sanityIcon, style]}>
        <ArkhamIcon
          name={type}
          size={ICON_SIZE * (type === 'health' ? 1.05 : 1)}
          color={colors[type]}
        />
      </View>
      <View style={[styles.icon, type === 'health' ? styles.healthText : styles.sanityText, style]}>
        <ArkhamIcon
          name={`num${typeof count === 'number' ? count : 'Null'}-fill`}
          size={NUMBER_SIZE}
          color="white"
        />
      </View>
      <View style={[styles.icon, type === 'health' ? styles.healthText : styles.sanityText, style]}>
        <ArkhamIcon
          name={`num${typeof count === 'number' ? count : 'Null'}-outline`}
          size={NUMBER_SIZE}
          color={colors[type]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthIcon: {
    top: -2,
  },
  sanityIcon: {

  },
  healthText: {
    left: -2,
    top: -3,
  },
  sanityText: {
    top: -3,
  },
});
