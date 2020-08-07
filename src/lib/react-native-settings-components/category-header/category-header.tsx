import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Platform, ViewProps, ViewStyle, TextProps, TextStyle,
} from 'react-native';

const style = StyleSheet.create({
  defaultTitleStyle: {
    borderWidth: 0,
    fontWeight: '300',
    color: (Platform.OS === 'ios') ? '#424246' : '#000000',
    fontSize: (Platform.OS === 'ios') ? 13 : 16,
    padding: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
});

interface Props {
  container?: ViewProps;
  containerStyle?: ViewStyle;
  titleProps?: TextProps;
  titleStyle?: TextStyle;
  title: string;
}

class SettingsCategoryHeader extends Component<Props> {
  render() {
    const {
      container = {},
      containerStyle = {},
      titleProps = {},
      titleStyle = {},
      title,
    } = this.props;

    return (
      <View {...container} style={containerStyle}>
        <Text
          {...titleProps}
          style={[style.defaultTitleStyle, titleStyle]}
        >
          {title.toUpperCase()}
        </Text>
      </View>
    );
  }
}


export default SettingsCategoryHeader;
