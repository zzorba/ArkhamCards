import React from 'react';
import { Platform, StyleSheet, Switch, Text, View, SwitchProps, TextStyle } from 'react-native';

import COLORS from '@styles/colors';

interface Props extends SwitchProps {
  label?: string;
  labelStyle?: TextStyle;
}

export default class DialogSwitch extends React.PureComponent<Props> {
  static displayName = 'DialogSwitch';

  render() {
    const { label, labelStyle, ...otherProps } = this.props;
    return (
      <View style={styles.switchWrapper}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
        <Switch {...otherProps} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  switchWrapper: Platform.select({
    ios: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 20,
      marginBottom: 14,
      paddingHorizontal: 8,
    },
    default: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 10,
      marginBottom: 20,
    },
  }),
  label: Platform.select({
    ios: {
      flex: 1,
      paddingRight: 8,
      fontSize: 13,
      color: COLORS.darkText,
    },
    default: {
      flex: 1,
      paddingRight: 8,
      fontSize: 16,
      color: COLORS.darkText,
    },
  }),
});
