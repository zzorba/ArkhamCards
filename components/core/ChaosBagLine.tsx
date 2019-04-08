import React from 'react';
import { keys, map, range, sortBy } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import ChaosTokenIcon from './ChaosTokenIcon';
import { CHAOS_TOKEN_ORDER, ChaosBag, ChaosTokenType } from '../../constants';

interface Props {
  chaosBag: ChaosBag;
}

export default function ChaosBagLine({ chaosBag }: Props) {
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
                size={18 * DeviceInfo.getFontScale()}
                color="#222"
              />
              { !isLast && <Text style={styles.comma}>, </Text> }
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
  comma: {
    fontSize: 18,
    fontFamily: 'System',
    color: '#222',
  },
});
