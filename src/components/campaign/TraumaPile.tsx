import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { range, map } from 'lodash';
import { t } from 'ttag';

import { TraumaAndCardData } from '@actions/types';
import HealthSanityIcon from '@components/core/HealthSanityIcon';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import Card from '@data/types/Card';

interface Props {
  trauma: TraumaAndCardData;
  investigator: Card;
}

const HEART_WIDTH = 15;
const HEART_OVERLAP = 0.55;
const BRAIN_WIDTH = 22;
const BRAIN_OVERLAP = 0.50;

function IconPile({ physical, mental }: { physical: number; mental: number }) {
  return (
    <>
      { (physical > 0) && (
        <View style={[
          space.marginLeftXs,
          {
            width: (physical > 1 ? HEART_WIDTH * (1 - HEART_OVERLAP) + HEART_WIDTH * HEART_OVERLAP * (physical) : HEART_WIDTH),
            position: 'relative',
          },
        ]}>
          <HealthSanityIcon type="health" size={18} />
          { map(range(1, physical), p => (
            <View key={`p_${p}`} style={{ position: 'absolute', left: HEART_OVERLAP * HEART_WIDTH * p, top: 0 }}>
              <HealthSanityIcon type="health" size={18} />
            </View>
          )) }
        </View>
      ) }
      { (mental > 0) && (
        <View style={[
          space.marginLeftXs,
          {
            width: (mental > 1 ? BRAIN_WIDTH * (1 - BRAIN_OVERLAP) + BRAIN_WIDTH * BRAIN_OVERLAP * (mental) : BRAIN_WIDTH),
            position: 'relative',
          },
        ]}>
          <HealthSanityIcon type="sanity" size={18} />
          { map(range(1, mental), m => (
            <View key={`m_${m}`} style={{ position: 'absolute', left: BRAIN_OVERLAP * BRAIN_WIDTH * m, top: 0 }}>
              <HealthSanityIcon type="sanity" size={18} />
            </View>
          )) }
        </View>
      ) }
    </>
  );
}


export default function TraumaPile({ trauma, investigator }: Props) {
  const { typography } = useContext(StyleContext);
  const physical = (trauma.physical || 0);
  const mental = (trauma.mental || 0);
  if (investigator.killed(trauma)) {
    return <Text style={[typography.smallLabel, typography.italic, typography.dark, typography.dark]}>{t`Killed`}</Text>;
  }
  if (investigator.insane(trauma)) {
    return <Text style={[typography.smallLabel, typography.italic, typography.dark, typography.dark]}>{t`Insane`}</Text>;
  }
  if (physical + mental === 0) {
    return null;
  }
  return (
    <IconPile
      physical={physical}
      mental={mental}
    />
  );
}
