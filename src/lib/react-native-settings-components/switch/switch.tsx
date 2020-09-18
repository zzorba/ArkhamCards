import React, { Component } from 'react';
import {
  StyleSheet, Switch, Text, View, ViewProps, ViewStyle, TextProps, TextStyle, SwitchProps,
} from 'react-native';

import COLORS from '@styles/colors';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

const style = StyleSheet.create({
  defaultContainerStyle: {
    padding: 0,
    minHeight: 50,
    alignItems: 'center',
    flexDirection: 'row',
  },
  defaultTitleStyle: {
    flex: 0,
    paddingLeft: 16,
    paddingRight: 8,
    fontSize: 16,
  },
  defaultDescriptionStyle: {
    flex: 0,
    paddingLeft: 16,
    paddingRight: 8,
    fontSize: 12,
  },
  defaultSwitchWrapperStyle: {
    flex: 0,
    flexDirection: 'row',
    paddingLeft: 8,
    paddingRight: 16,
  },
  defaultDisabledOverlayStyle: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  titleWrapper: { flex: 1, position: 'relative' },
});

interface Props {
  containerProps?: ViewProps;
  containerStyle?: ViewStyle;
  disabledOverlayStyle?: ViewStyle;
  titleProps?: TextProps;
  titleStyle?: TextStyle;
  title: string;
  descriptionProps?: TextProps;
  descriptionStyle?: TextStyle;
  description?: string;
  switchWrapperProps?: ViewProps;
  switchWrapperStyle?: ViewStyle;
  value: boolean;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
  trackColor?: {
    true: string;
    false: string;
  };
  switchProps: SwitchProps;
}
class SettingsSwitch extends Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  static defaultProps = {
    containerProps: {},
    containerStyle: {},
    disabledOverlayStyle: {},
    titleProps: {},
    titleStyle: {},
    descriptionProps: {},
    descriptionStyle: {},
    description: null,
    switchWrapperProps: {},
    switchWrapperStyle: {},
    disabled: false,
    switchProps: {},
    trackColor: null,
  };

  render() {
    const {
      containerProps, containerStyle, titleProps, titleStyle, title, disabled, switchProps,
      disabledOverlayStyle, switchWrapperProps, switchWrapperStyle, value,
      trackColor, onValueChange, descriptionProps, descriptionStyle, description,
    } = this.props;
    const { backgroundStyle, colors, disabledStyle } = this.context;
    return (
      <View {...containerProps} style={[style.defaultContainerStyle, backgroundStyle, containerStyle]}>
        <View style={style.titleWrapper}>
          <Text
            {...titleProps}
            style={[style.defaultTitleStyle, { color: colors.darkText }, titleStyle]}
          >
            {title}
          </Text>
          {description ? (
            <Text
              {...descriptionProps}
              style={[style.defaultDescriptionStyle, descriptionStyle]}
            >
              {description}
            </Text>
          ) : null}
          {(disabled) ? (
            <View
              style={[style.defaultDisabledOverlayStyle, disabledStyle, (disabled) ? disabledOverlayStyle : null]}
            />
          ) : null}
        </View>
        <View
          {...switchWrapperProps}
          style={[style.defaultSwitchWrapperStyle, switchWrapperStyle]}
        >
          <Switch
            value={value}
            trackColor={trackColor}
            onValueChange={onValueChange}
            disabled={disabled}
            {...switchProps}
          />
        </View>
      </View>
    );
  }
}

export default SettingsSwitch;
