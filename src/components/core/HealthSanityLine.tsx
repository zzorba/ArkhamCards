import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Card from '@data/types/Card';
import { xs } from '@styles/space';
import HealthSanityNumberIcon from './HealthSanityNumberIcon';

interface Props {
  investigator: Card;
}

export default function HealthSanityLine({ investigator }: Props) {
  return (
    <View style={styles.skillRow}>
      <HealthSanityNumberIcon count={investigator.health} type="health" />
      <HealthSanityNumberIcon count={investigator.sanity} type="sanity" />
    </View>
  );
}

const styles = StyleSheet.create({
  skillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: xs,
    marginRight: xs,
  },
});
