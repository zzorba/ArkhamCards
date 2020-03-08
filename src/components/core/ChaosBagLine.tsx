import React from 'react';
import { keys, map, range, sortBy } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ChaosTokenIcon from './ChaosTokenIcon';
import { CHAOS_TOKEN_ORDER, ChaosBag, ChaosTokenType } from 'constants';
import { iconSizeScale } from 'styles/space';
import typography from 'styles/typography';

interface Props {
  chaosBag: ChaosBag;
  fontScale: number;
}

export default function ChaosBagLine({ chaosBag, fontScale }: Props) {
  const bagKeys = sortBy(
    keys(chaosBag),
    (token: ChaosTokenType) => CHAOS_TOKEN_ORDER[token]);
  return (
    <View style={styles.row}>
      { map(bagKeys, (token: ChaosTokenType, tokenIdx: number) => (
        map(range(0, chaosBag[token] || 0), idx => {
          const isLast = (idx === ((chaosBag[token] || 0) - 1)) &&
            (tokenIdx === (bagKeys.length - 1));
          return (
            <View key={`${token}-${idx}`} style={styles.commaView}>
              <ChaosTokenIcon
                icon={token}
                size={18 * iconSizeScale * fontScale}
                color="#222"
              />
              { !isLast && <Text style={typography.text}>, </Text> }
            </View>
          );
        })
      )) }
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  commaView: {
    flexDirection: 'row',
  },
});
