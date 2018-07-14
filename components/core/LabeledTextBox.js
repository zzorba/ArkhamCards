import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native';

import TextBox from './TextBox';
import typography from '../../styles/typography';

export default function LabeledTextBox({ label, onPress, value, placeholder, style = {} }) {
  return (
    <View style={[styles.row, style]}>
      <Text style={typography.label}>{ `${label}:` }</Text>
      <View style={styles.grow}>
        <TouchableOpacity onPress={onPress}>
          <TextBox
            value={value}
            editable={false}
            placeholder={placeholder}
            pointerEvents="none"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

LabeledTextBox.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  style: ViewPropTypes.style,
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  grow: {
    flex: 1,
  },
});
