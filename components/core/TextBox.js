import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  TextInput,
  View,
  ViewPropTypes,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import typography from '../../styles/typography';

export default function TextBox({ value, multiline, style = {}, textStyle = {}, ...otherProps }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#fff', '#eee']}
        style={[
          styles.textBox,
          style,
          multiline ? {} : { paddingTop: Platform.OS === 'ios' ? 4 : 2 },
        ]}
      >
        <TextInput
          autoCorrect={false}
          underlineColorAndroid="transparent"
          style={[typography.text, styles.input, textStyle]}
          value={value}
          multiline={multiline}
          {...otherProps}
        />
      </LinearGradient>
    </View>
  );
}

TextBox.propTypes = {
  value: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
  textStyle: PropTypes.any,
  multiline: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#a8a8a8',
    overflow: 'hidden',
  },
  textBox: {
    width: '100%',
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: Platform.OS === 'ios' ? 4 : 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    padding: 0,
    color: '#222',
    width: '100%',
  },
});
