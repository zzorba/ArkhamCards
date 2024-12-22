import React, { useContext, useMemo } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { t } from 'ttag';

import CardIcon from '@icons/CardIcon';
import StyleContext from '@styles/StyleContext';
import ArkhamIcon from '@icons/ArkhamIcon';

export function iconSize(fontScale: number) {
  const scaleFactor = ((fontScale - 1) / 2 + 1);
  return 32 * scaleFactor;
}

interface Props {
  count?: number;
  type: 'health' | 'sanity';
  perInvestigator?: boolean;
}

function label(type: 'health' | 'sanity', theCount?: number) {
  if (theCount === null || theCount === undefined) {
    return type === 'health' ? t`Health: none` : t`Sanity: none`;
  }

  const count = theCount === -2 ? '*' : `${theCount}`;
  return type === 'health' ? t`Health: ${count}` : t`Sanity: ${count}`;
}

function getNumber(count?: number) {
  if (count === null || count === undefined) {
    return 'numNull';
  }
  if (count === -2) {
    return 'star';
  }
  return `num${count}`;
}

function getSize(count: number | undefined, perInvestigator: boolean | undefined) {
  if (perInvestigator) {
    return 16;
  }
  return count === -2 ? 20 : 24;
}

export default function HealthSanityIcon({ type, count, perInvestigator }: Props) {
  const { fontScale, colors } = useContext(StyleContext);
  const scaleFactor = ((fontScale - 1) / 2 + 1);
  const ICON_SIZE = 26 * scaleFactor;
  const NUMBER_SIZE = getSize(count, perInvestigator) * scaleFactor;
  const style = useMemo(() => {
    return {
      width: iconSize(fontScale) * (type === 'sanity' ? 1.4 : 0.8),
      height: iconSize(fontScale),
    };
  }, [type, fontScale]);
  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={[styles.wrapper, style]} accessibilityLabel={label(type, count)}>
        <View style={[styles.icon, type === 'health' ? styles.healthIcon : styles.sanityIcon, style]}>
          <CardIcon
            name={type}
            size={ICON_SIZE * (type === 'health' ? 1.05 : 1)}
            color={colors[type]}
          />
        </View>
        <View style={[styles.icon, type === 'health' ? styles.healthText : styles.sanityText, style]}>
          <CardIcon
            name={`${getNumber(count)}-fill`}
            size={NUMBER_SIZE}
            color="white"
          />
        </View>
        <View style={[styles.icon, type === 'health' ? styles.healthText : styles.sanityText, style]}>
          <CardIcon
            name={`${getNumber(count)}-outline`}
            size={NUMBER_SIZE}
            color={colors[type]}
          />
        </View>
      </View>
      { !!perInvestigator && (
        <View>
          <ArkhamIcon size={NUMBER_SIZE} color={colors[type]} name="per_investigator" />
        </View>
      )}
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
    left: 0,
    top: -3,
  },
  sanityText: {
    top: -3,
  },
});
