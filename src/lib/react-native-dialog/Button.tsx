import React from 'react';
import { Platform, StyleSheet, Text, TextProps, TouchableOpacity } from 'react-native';

import COLORS from '@styles/colors';

const COLOR = Platform.OS === 'ios' ? COLORS.navButton : '#169689';

interface Props extends TextProps {
  label: string;
  color?: string;
  bold?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export default class DialogButton extends React.PureComponent<Props> {
  static displayName = 'DialogButton';

  render() {
    const {
      label,
      color = COLOR,
      disabled = false,
      bold,
      onPress,
      style,
      ...otherProps
    } = this.props;
    const fontWeight = bold ? '600' : 'normal';
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        disabled={disabled}
      >
        <Text
          style={[styles.text, { color: color, fontWeight: fontWeight }, style]}
          {...otherProps}
        >
          { Platform.OS === 'ios' ? label : label.toUpperCase() }
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: Platform.select({
    ios: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    default: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
  text: Platform.select({
    ios: {
      textAlign: 'center',
      fontSize: 17,
      backgroundColor: 'transparent',
    },
    default: {
      textAlign: 'center',
      backgroundColor: 'transparent',
      padding: 8,
      fontSize: 14,
    },
  }),
});
