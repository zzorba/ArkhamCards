import PropTypes from "prop-types";
import React from 'react';
import { Platform, StyleSheet, Text, TextProps, TextStyle } from 'react-native';

interface Props extends TextProps {
  style?: TextStyle | TextStyle[];
  children: string;
}

export default class DialogDescription extends React.PureComponent<Props> {
  static displayName = 'DialogDescription';

  render() {
    const { style, children, ...otherProps } = this.props;
    return (
      <Text style={[styles.text, ...(Array.isArray(style) ? style : [style])]} {...otherProps}>
        { children }
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  text: Platform.select({
    ios: {
      textAlign: 'center',
      color: 'black',
      fontSize: 13,
      marginTop: 4,
    },
    default: {
      color: '#33383D',
      fontSize: 16,
      marginTop: 10,
    },
  })
});
