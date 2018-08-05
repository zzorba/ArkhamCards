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

export default function LabeledTextBox({
  label,
  onPress,
  value,
  placeholder,
  column,
  style = {},
}) {
  const viewStyle = column ? styles.column : styles.row;
  return (
    <View style={[viewStyle, style]}>
      <Text style={column ? typography.smallLabel : typography.label}>
        { column ? label.toUpperCase() : `${label}:` }
      </Text>
      <TouchableOpacity onPress={onPress} style={column ? {} : styles.grow}>
        <TextBox
          value={value}
          editable={false}
          placeholder={placeholder}
          pointerEvents="none"
        />
      </TouchableOpacity>
    </View>
  );
}

LabeledTextBox.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  style: ViewPropTypes.style,
  column: PropTypes.bool,
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  grow: {
    flex: 1,
  },
});
