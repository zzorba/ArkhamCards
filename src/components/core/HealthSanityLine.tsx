import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ArkhamIcon from '@icons/ArkhamIcon';
import Card from '@data/Card';
import { m, xs } from '@styles/space';
import typography from '@styles/typography';

interface Props {
  investigator: Card;
  fontScale: number;
}

function num(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return '-';
  }
  if (value < 0) {
    return 'X';
  }
  return value;
}

export default function HealthSanityLine({ investigator, fontScale }: Props) {
  const ICON_SIZE = fontScale * 22;
  return (
    <View style={styles.skillRow}>
      <View style={styles.skillIconBlock}>
        <Text style={typography.mediumGameFont}>
          { num(investigator.health) }
        </Text>
        <View style={[styles.skillIcon, { width: ICON_SIZE * 0.75 }]}>
          <View style={styles.icon}>
            <ArkhamIcon
              name="health_inverted"
              size={ICON_SIZE}
              color="#FFF"
            />
          </View>
          <View style={styles.icon}>
            <ArkhamIcon
              name="health"
              size={ICON_SIZE}
              color="#911017"
            />
          </View>
        </View>
      </View>
      <View style={styles.growth} />
      <View style={styles.skillIconBlock}>
        <Text style={typography.mediumGameFont}>
          { num(investigator.sanity) }
        </Text>
        <View style={[styles.skillIcon, { width: ICON_SIZE * 1.2 }]}>
          <View style={styles.icon}>
            <ArkhamIcon
              name="sanity_inverted"
              size={ICON_SIZE}
              color="#FFF"
            />
          </View>
          <View style={styles.icon}>
            <ArkhamIcon
              name="sanity"
              size={ICON_SIZE}
              color="#0c2445"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  skillIconBlock: {
    flexDirection: 'row',
  },
  skillIcon: {
    marginLeft: 4,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: xs,
    marginRight: xs,
  },
  growth: {
    width: m,
  },
});
