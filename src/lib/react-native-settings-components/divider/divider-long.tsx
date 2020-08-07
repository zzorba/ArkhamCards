import React, { Component } from 'react';
import {
  StyleSheet, View, Platform, ViewStyle,
} from 'react-native';

const style = StyleSheet.create({
  dividerStyle: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgb(220,220,223)',
  },
});

interface Props {
  ios?: boolean;
  android?: boolean;
  dividerStyle?: ViewStyle;
}

class SettingsDividerLong extends Component<Props> {
  render() {
    const { dividerStyle = {}, ios = true, android = true } = this.props;

    return (
      (Platform.OS === 'ios' && ios)
      || (Platform.OS === 'android' && android)
    ) ? <View style={[style.dividerStyle, dividerStyle]} /> : null;
  }
}

export default SettingsDividerLong;
