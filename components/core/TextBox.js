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

export default function TextBox({ value, style, textStyle = {}, ...otherProps }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#fff', '#eee']}
        style={style ? [styles.textBox, style] : styles.textBox}
      >
        <TextInput
          autoCorrect={false}
          underlineColorAndroid="transparent"
          style={[typography.text, styles.input, textStyle]}
          value={value}
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
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#a8a8a8',
    overflow: 'hidden',
  },
  textBox: {
    height: 30,
    width: '100%',
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: Platform.OS === 'ios' ? 4 : 2,
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
