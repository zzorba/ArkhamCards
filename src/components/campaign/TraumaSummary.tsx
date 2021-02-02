import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { range, map } from 'lodash';
import { c, t } from 'ttag';

import { TraumaAndCardData } from '@actions/types';
import HealthSanityIcon from '@components/core/HealthSanityIcon';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import Card from '@data/Card';


interface Props {
  trauma: TraumaAndCardData;
  investigator: Card;
}

export default function TraumaSummary({ trauma, investigator }: Props) {
  const { typography } = useContext(StyleContext);
  const physical = (trauma.physical || 0);
  const mental = (trauma.mental || 0);
  if (investigator.eliminated(trauma)) {
    if (trauma.killed || physical >= (investigator.health || 0)) {
      return <Text style={typography.gameFont}>{t`Killed`}</Text>;
    }
    return <Text style={typography.gameFont}>{t`Insane`}</Text>;
  }
  if (physical + mental === 0) {
    return <Text style={typography.gameFont}>{c('trauma').t`None`}</Text>;
  }
  if (physical + mental > 3) {
    // compact mode;
    return (
      <View style={styles.row}>
        { (physical > 0) && <HealthSanityIcon type="health" size={24} /> }
        { (physical > 1) && <Text style={[typography.gameFont, space.marginRightS]}>×{physical}</Text> }
        { (mental > 0) && <HealthSanityIcon type="sanity" size={24} /> }
        { (mental > 1) && <Text style={[space.marginLeftXs, typography.gameFont]}>×{mental}</Text> }
      </View>
    );
  }
  return (
    <View style={styles.row}>
      { (physical > 0) && map(range(0, physical), idx => <HealthSanityIcon key={idx} type="health" size={24} />) }
      { (mental > 0) && map(range(0, mental), idx => <HealthSanityIcon key={idx} type="sanity" size={24} />) }
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
