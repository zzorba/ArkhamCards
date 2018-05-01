import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

export default function TextBox({ value, ...otherProps }) {
  return (
    <View style={styles.textBox}>
      <TextInput style={styles.input} value={value} {...otherProps} />
    </View>
  );
}

TextBox.propTypes = {
  value: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
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
