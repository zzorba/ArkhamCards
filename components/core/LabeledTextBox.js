import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import typography from '../../styles/typography';

export default function LabeledTextBox({ label, onPress, value }) {
  return (
    <View style={styles.row}>
      <Text style={typography.label}>{ `${label}:` }</Text>
      <View style={styles.grow}>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.textBox}>
            <TextInput
              style={styles.input}
              value={value}
              editable={false}
              pointerEvents="none"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

LabeledTextBox.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
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
  textBox: {
    height: 24,
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 4,
    borderColor: '#444',
    paddingLeft: 4,
    paddingRight: 4,
  },
  input: {
    fontSize: 16,
    width: '100%',
  },
});
