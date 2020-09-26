import React, { useContext } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { t } from 'ttag';

import ArkhamIcon from '@icons/ArkhamIcon';
import StyleContext from '@styles/StyleContext';

export function iconSize(fontScale: number) {
  const scaleFactor = ((fontScale - 1) / 2 + 1);
  return 32 * scaleFactor;
}

interface Props {
  count?: number;
  type: 'health' | 'sanity';
}

function label(type: 'health' | 'sanity', count?: number) {
  if (count === null || count === undefined) {
    return type === 'health' ? t`Health: none` : t`Sanity: none`;
  }
  return type === 'health' ? t`Health: ${count}` : t`Sanity: ${count}`;
}

export default function HealthSanityIcon({ type, count }: Props) {
  const { fontScale, colors } = useContext(StyleContext);
  const scaleFactor = ((fontScale - 1) / 2 + 1);
  const ICON_SIZE = 26 * scaleFactor;
  const NUMBER_SIZE = 24 * scaleFactor;
  const style = {
    width: iconSize(fontScale) * 1.4,
    height: iconSize(fontScale),
  };
  return (
    <View style={[styles.wrapper, style]} accessibilityLabel={label(type, count)}>
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
