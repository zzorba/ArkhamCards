import React from 'react';
import PropTypes from 'prop-types';
import { keys, map, partition, range, sortBy } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ChaosTokenIcon from './ChaosTokenIcon';
import { CHAOS_TOKEN_ORDER } from '../../constants';

export default function ChaosBagLine({ chaosBag }) {
  const bagKeys = sortBy(keys(chaosBag), token => CHAOS_TOKEN_ORDER[token]);
  const [specialTokens, normalTokens] = partition(bagKeys, key => {
    return (
      key === 'skull' ||
      key === 'cultist' ||
      key === 'tablet' ||
      key === 'elder_thing' ||
      key === 'elder_sign' ||
      key === 'auto_fail'
    );
  });
  return (
    <View style={styles.chaosBag}>
      <View style={styles.row}>
        { map(normalTokens, (token, tokenIdx) => (
          map(range(0, chaosBag[token]), idx => {
            const isLast = (idx === (chaosBag[token] - 1)) &&
              (tokenIdx === (normalTokens.length - 1));
            return (
              <View key={`${token}-${idx}`} style={styles.commaView}>
                <ChaosTokenIcon id={token} size={18} />
                { !isLast && <Text style={styles.comma}>,</Text> }
              </View>
            );
          })
        )) }
      </View>
      <View style={styles.row}>
        { map(specialTokens, (token, tokenIdx) => (
          map(range(0, chaosBag[token]), idx => {
            const isLast = (idx === (chaosBag[token] - 1)) &&
              (tokenIdx === (specialTokens.length - 1));
            return (
              <View key={`${token}-${idx}`} style={styles.commaView}>
                <ChaosTokenIcon id={token} size={18} />
                { !isLast && <Text style={styles.comma}>,</Text> }
              </View>
            );
          })
        )) }
      </View>
    </View>
  );
}

ChaosBagLine.propTypes = {
  chaosBag: PropTypes.object.isRequired,
};

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
  },
});
