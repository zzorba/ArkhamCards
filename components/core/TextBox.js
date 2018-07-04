import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  TextInput,
  View,
  ViewPropTypes,
} from 'react-native';

export default function TextBox({ value, style, ...otherProps }) {
  return (
    <View style={style ? [styles.textBox, style] : styles.textBox}>
      <TextInput
        underlineColorAndroid="transparent"
        style={styles.input}
        value={value}
        {...otherProps}
      />
    </View>
  );
}

TextBox.propTypes = {
  value: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
};

const styles = StyleSheet.create({
  textBox: {
    height: 26,
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 4,
    borderColor: '#444',
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: Platform.OS === 'ios' ? 4 : 2,
    paddingBottom: Platform.OS === 'ios' ? 4 : 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    padding: 0,
    fontFamily: 'System',
    fontSize: 16,
    color: '#222',
    width: '100%',
  },
});
