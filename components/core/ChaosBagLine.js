import React from 'react';
import PropTypes from 'prop-types';
import { keys, map, range, sortBy } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import ChaosTokenIcon from './ChaosTokenIcon';
import { CHAOS_TOKEN_ORDER } from '../../constants';

export default function ChaosBagLine({ chaosBag }) {
  const bagKeys = sortBy(keys(chaosBag), token => CHAOS_TOKEN_ORDER[token]);
  return (
    <View style={styles.row}>
      { map(bagKeys, (token, tokenIdx) => (
        map(range(0, chaosBag[token]), idx => {
          const isLast = (idx === (chaosBag[token] - 1)) &&
            (tokenIdx === (bagKeys.length - 1));
          return (
            <View key={`${token}-${idx}`} style={styles.commaView}>
              <ChaosTokenIcon
                id={token}
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
    fontFamily: 'System',
    color: '#222',
  },
});
