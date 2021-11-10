import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { range, map } from 'lodash';
import { c, t } from 'ttag';

import { TraumaAndCardData } from '@actions/types';
import HealthSanityIcon from '@components/core/HealthSanityIcon';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import Card from '@data/types/Card';
import { TINY_PHONE } from '@styles/sizes';


interface Props {
  trauma: TraumaAndCardData;
  investigator: Card;
  whiteText?: boolean;
  hideNone?: boolean;
}

export function TraumaIconPile({ physical, mental, whiteText }: { physical: number; mental: number; whiteText?: boolean }) {
  const textColorStyle = whiteText ? { color: '#FFF' } : undefined;
  const { typography } = useContext(StyleContext);
  if (physical + mental > (TINY_PHONE ? 2 : 3)) {
    // compact mode;
    return (
      <View style={styles.row}>
        { (physical > 0) && <HealthSanityIcon type="health" size={24} /> }
        { (physical > 1) && <Text style={[typography.subHeaderText, space.marginRightS, textColorStyle]}>×{physical}</Text> }
        { (mental > 0) && <HealthSanityIcon type="sanity" size={24} /> }
        { (mental > 1) && <Text style={[space.marginLeftXs, typography.subHeaderText, textColorStyle]}>×{mental}</Text> }
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

export default function TraumaSummary({ trauma, investigator, whiteText, hideNone }: Props) {
  const { typography } = useContext(StyleContext);
  const physical = (trauma.physical || 0);
  const mental = (trauma.mental || 0);
  const textColorStyle = whiteText ? { color: '#FFF' } : undefined;
  if (investigator.killed(trauma)) {
    return <Text style={[typography.subHeaderText, textColorStyle]}>{t`Killed`}</Text>;
  }
  if (investigator.insane(trauma)) {
    return <Text style={[typography.subHeaderText, textColorStyle]}>{t`Insane`}</Text>;
  }
  if (physical + mental === 0) {
    if (whiteText || hideNone) {
      return null;
    }
    return <Text style={typography.subHeaderText}>{c('trauma').t`None`}</Text>;
  }
  return <TraumaIconPile physical={physical} mental={mental} whiteText={whiteText} />
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
