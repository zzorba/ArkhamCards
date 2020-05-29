import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ArkhamIcon from 'icons/ArkhamIcon';
import Card from 'data/Card';
import { m, xs } from 'styles/space';
import typography from 'styles/typography';

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
        <View style={styles.skillIcon}>
          <ArkhamIcon
            name="health"
            size={ICON_SIZE}
            color="#911017"
          />
        </View>
      </View>
      <View style={styles.growth} />
      <View style={styles.skillIconBlock}>
        <Text style={typography.mediumGameFont}>
          { num(investigator.sanity) }
        </Text>
        <View style={styles.skillIcon}>
          <ArkhamIcon
            name="sanity"
            size={ICON_SIZE}
            color="#0c2445"
          />
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
