import React, { useContext } from 'react';
import {
  StyleSheet, Text, View, ViewProps, ViewStyle, TextProps, TextStyle, SwitchProps,
} from 'react-native';

import StyleContext from '@styles/StyleContext';
import ArkhamSwitch from '@components/core/ArkhamSwitch';

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
  switchProps?: SwitchProps;
}
export default function SettingsSwitch({
  containerProps = {},
  containerStyle = {},
  disabledOverlayStyle = {},
  titleProps = {},
  titleStyle = {},
  descriptionProps = {},
  descriptionStyle = {},
  description,
  switchWrapperProps = {},
  switchWrapperStyle = {},
  disabled = false,
  switchProps = {},
  trackColor,
  title,
  value,
  onValueChange,
}: Props) {
  const { backgroundStyle, colors, disabledStyle } = useContext(StyleContext);
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
        <ArkhamSwitch
          value={value}
          trackColor={trackColor}
          // @ts-ignore
          onValueChange={onValueChange}
          disabled={disabled}
          {...switchProps}
        />
      </View>
    </View>
  );
}
