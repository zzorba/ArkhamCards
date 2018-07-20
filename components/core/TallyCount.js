import React from 'react';
import PropTypes from 'prop-types';
import { map, range } from 'lodash';
import {
  Text,
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native';

import AppIcon from '../../assets/AppIcon';
import typography from '../../styles/typography';
const REMAINDER = [
  'one',
  'two',
  'three',
  'four',
];

export default function TallyCount({ count, size = 24, color='#222222', style }) {
  const remainder = (count % 5);
  if (count === 0) {
    return (
      <View style={[styles.row, style]}>
        <Text style={typography.text}>0</Text>
      </View>
    );
  }
  return (
    <View style={[styles.row, style]}>
      { map(range(0, Math.floor(count / 5)), idx => (
        <AppIcon key={idx} name="five" size={size} color={color} />
      )) }
      { remainder > 0 && <AppIcon name={REMAINDER[remainder - 1]} size={size} color={color} /> }
    </View>
  );
}

TallyCount.propTypes = {
  count: PropTypes.number.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  style: ViewPropTypes.style,
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
  },
});
