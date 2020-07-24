import React from 'react';
import { Platform, StyleSheet, Text, TextProps, TextStyle } from 'react-native';

import COLORS from '@styles/colors';

interface Props extends TextProps {
  style?: TextStyle;
  children: React.ReactNode;
}
export default class DialogTitle extends React.PureComponent<Props> {
  static displayName = 'DialogTitle';

  render() {
    const { style, children, ...otherProps } = this.props;
    return (
      <Text style={[styles.text, style]} {...otherProps}>
        {children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  text: Platform.select({
    ios: {
      color: COLORS.darkText,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '600'
    },
    default: {
      color: COLORS.darkText,
      fontWeight: '500',
      fontSize: 18,
    },
  }),
});
