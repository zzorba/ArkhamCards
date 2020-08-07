import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Platform, ViewProps, ViewStyle, TextStyle,
} from 'react-native';
import { TextProps } from 'react-native-svg';

const style = StyleSheet.create({
  defaultTitleStyle: {
    borderWidth: 0,
    color: Platform.OS === 'ios' ? '#424246' : '#111',
    fontSize: 10,
    padding: 16,
    paddingTop: 1,
    paddingBottom: 8,
  },
});

interface Props {
  container?: ViewProps;
  containerStyle?: ViewStyle;
  titleProps?: TextProps;
  titleStyle?: TextStyle;
  title: string;
}
class SettingsTextLabel extends Component<Props> {
  static defaultProps = {
    container: {},
    containerStyle: {},
    titleProps: {},
    titleStyle: {},
  };

  render() {
    const {
      container,
      containerStyle,
      titleProps,
      titleStyle,
      title,
    } = this.props;

    return (
      <View {...container} style={containerStyle}>
        <Text {...titleProps} style={[style.defaultTitleStyle, titleStyle]}>
          {title}
        </Text>
      </View>
    );
  }
}

export default SettingsTextLabel;
