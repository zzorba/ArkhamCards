import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Card from '@data/Card';
import { xs } from '@styles/space';
import HealthSanityIcon from './HealthSanityIcon';

interface Props {
  investigator: Card;
}

export default function HealthSanityLine({ investigator }: Props) {
  return (
    <View style={styles.skillRow}>
      <HealthSanityIcon count={investigator.health} type="health" />
      <HealthSanityIcon count={investigator.sanity} type="sanity" />
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
