import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  title: string;
  value?: string;
  id: string;
  onPress: (id: string) => void;
  disabled?: boolean;
  colors?: {
    backgroundColor: string;
    textColor: string;
  };
  widget?: 'shuffle' | 'nav' | 'delete';
  noBorder?: boolean;
  settingsStyle?: boolean;
}

export default function PickerStyleButton({
  title,
  value,
  id,
  onPress,
  disabled,
  colors: pickerColors,
  widget,
  noBorder,
  settingsStyle,
}: Props) {
  const { borderStyle, typography, colors } = useContext(StyleContext);
  const widgetIcon = useMemo(() => {
    switch (widget) {
      case 'shuffle':
        return (
          <View style={space.marginRightS}>
            <MaterialCommunityIcons
              name="shuffle-variant"
              size={24}
              color={pickerColors ? pickerColors.textColor : colors.darkText}
            />
          </View>
        );
      case 'nav':
        return (
          <MaterialIcons
            name="keyboard-arrow-right"
            size={30}
            color={pickerColors ? pickerColors.textColor : colors.darkText}
          />
        );
      case 'delete':
        return (
          <View style={space.marginRightS}>
            <MaterialIcons
              name="delete"
              size={26}
              color={pickerColors ? pickerColors.textColor : colors.darkText}
            />
          </View>
        );
      default:
        return null;
    }
  }, [widget, colors, pickerColors]);

  const content = useMemo(() => {
    return (
      <View style={[
        style.defaultContainerStyle,
        borderStyle,
        {
          backgroundColor: pickerColors ? pickerColors.backgroundColor : 'transparent',
          borderBottomWidth: noBorder ? undefined : StyleSheet.hairlineWidth,
        },
      ]}>
        <View style={[
          style.textColumn,
          space.paddingLeftM,
          !disabled && widget ? space.paddingRightXs : space.paddingRightM,
        ]}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[
              style.defaultTitleStyle,
              space.paddingRightS,
              settingsStyle ? typography.text :
                {
                  ...typography.mediumGameFont,
                  fontWeight: '600',
                },
              { color: pickerColors ? pickerColors.textColor : colors.darkText },
            ]}
          >
            { title }
          </Text>
          { !!value && (
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[
                style.defaultValueStyle,
                typography.large,
                {
                  color: pickerColors ? pickerColors.textColor : colors.darkText,
                  fontWeight: '400',
                  flex: 4,
                  textAlign: 'right',
                },
              ]}
            >
              { value }
            </Text>
          ) }
          { !disabled && widgetIcon }
        </View>
      </View>
    );
  }, [colors, pickerColors, disabled, borderStyle, typography, title, value, noBorder, settingsStyle, widget, widgetIcon]);

  const handleOnPress = useCallback(() => {
    onPress(id);
  }, [onPress, id]);

  if (disabled) {
    return content;
  }
  return (
    <TouchableOpacity onPress={handleOnPress}>
      { content }
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  defaultContainerStyle: {
    padding: 0,
    minHeight: 50,
    backgroundColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'row',
  },
  defaultTitleStyle: {
    fontSize: 16,
    minWidth: 100,
  },
  defaultValueStyle: {
    fontSize: 14,
  },
  textColumn: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: s,
    paddingBottom: s,
  },
});
