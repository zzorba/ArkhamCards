import React from 'react';
import PropTypes from 'prop-types';
import { keys, map, range, sortBy } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ChaosTokenIcon from './ChaosTokenIcon';
import { CHAOS_TOKEN_ORDER } from '../../constants';

export default function ChaosBagLine({ chaosBag }) {
  const bagKeys = sortBy(keys(chaosBag), token => CHAOS_TOKEN_ORDER[token]);
  return (
    <View style={styles.chaosBag}>
      { map(bagKeys, (token, tokenIdx) =>
        map(range(0, chaosBag[token]), idx => {
          const isLast = (idx === (chaosBag[token] - 1)) &&
            (tokenIdx === (bagKeys.length - 1));
          return (
            <View key={`${token}-${idx}`} style={styles.commaView}>
              <ChaosTokenIcon id={token} size={18} />
              { !isLast && <Text style={styles.comma}>,</Text> }
            </View>
          );
        }))
      }
    </View>
  );
}

ChaosBagLine.propTypes = {
  chaosBag: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  chaosBag: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  commaView: {
    flexDirection: 'row',
  },
  comma: {
    fontSize: 18,
  },
});
