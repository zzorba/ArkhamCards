import React, { Component } from 'react';
import {
  StyleSheet, View, Platform, ViewStyle,
} from 'react-native';

const style = StyleSheet.create({
  containerStyle: {
    width: '100%',
    height: 1,
    paddingLeft: 16,
    backgroundColor: 'rgb(255,255,255)',
  },
  dividerStyle: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgb(220,220,223)',
  },
});

interface Props {
  ios?: boolean;
  android?: boolean;
  containerStyle?: ViewStyle;
  dividerStyle?: ViewStyle;
}

class SettingsDividerShort extends Component<Props> {
  render() {
    const {
      containerStyle = {},
      dividerStyle = {},
      android = true,
      ios = true,
    } = this.props;

    return (
      (Platform.OS === 'ios' && ios)
      || (Platform.OS === 'android' && android)
        ? (
          <View style={[style.containerStyle, containerStyle]}>
            <View style={[style.dividerStyle, dividerStyle]} />
          </View>
        ) : null
    );
  }
}

export default SettingsDividerShort;
