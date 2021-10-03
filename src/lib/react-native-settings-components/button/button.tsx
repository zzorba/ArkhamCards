import React, { useContext } from 'react';
import {
  StyleSheet, Text, TextProps, TextStyle, TouchableOpacity, View, ViewProps, ViewStyle,
} from 'react-native';

import StyleContext from '@styles/StyleContext';

const style = StyleSheet.create({
  defaultContainerStyle: {
    padding: 0,
    minHeight: 50,
    position: 'relative',
  },
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  defaultTitleStyle: {
    flex: 0,
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 16,
  },
  defaultDescriptionStyle: {
    flex: 0,
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 12,
  },
  defaultRightIconWrapperStyle: {
    flex: 0,
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
  rightIconWrapperStyle?: ViewStyle;
  rightIcon?: React.ReactNode;
  disabled?: boolean
  onPress?: () => void;
}

function SettingsButton({
  containerProps = {},
  containerStyle = {},
  disabledOverlayStyle = {},
  title,
  titleProps = {},
  titleStyle = {},
  descriptionProps = {},
  descriptionStyle = {},
  description,
  rightIconWrapperStyle = {},
  rightIcon = null,
  disabled = false,
  onPress,
}: Props) {
  const { backgroundStyle, disabledStyle } = useContext(StyleContext);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      {...containerProps}
      style={[style.defaultContainerStyle, backgroundStyle, containerStyle]}
      onPress={onPress}
    >
      <View style={style.wrapper}>
        <View style={style.titleWrapper}>
          <Text
            {...titleProps}
            style={[style.defaultTitleStyle, titleStyle]}
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
        </View>
        {rightIcon ? (
          <View
            style={[style.defaultRightIconWrapperStyle, rightIconWrapperStyle]}
          >
            { rightIcon }
          </View>
        ) : null}
        {(disabled) ? (
          <View
            style={[style.defaultDisabledOverlayStyle, disabledStyle, (disabledOverlayStyle) ? disabledOverlayStyle : null]}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default SettingsButton;
