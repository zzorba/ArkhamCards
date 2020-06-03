import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import COLORS from 'styles/colors';
import typography from 'styles/typography';
import space from 'styles/space';

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

export default class PickerStyleButton extends React.Component<Props> {
  renderWidget() {
    const { widget } = this.props;
    switch (widget) {
      case 'shuffle':
        return (
          <View style={space.marginRightS}>
            <MaterialCommunityIcons
              name="shuffle-variant"
              size={24}
              color="#000"
            />
          </View>
        );
      case 'nav':
        return (
          <View style={space.marginRightXs}>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={30}
              color={COLORS.darkTextColor}
            />
          </View>
        );
      case 'delete':
        return (
          <View style={space.marginRightS}>
            <MaterialIcons
              name="delete"
              size={26}
              color={COLORS.darkTextColor}
            />
          </View>
        );
      default:
        return null;
    }
  }
  renderContent() {
    const {
      colors,
      disabled,
      title,
      value,
      noBorder,
      settingsStyle,
    } = this.props;
    return (
      <View style={[style.defaultContainerStyle, {
        backgroundColor: colors ? colors.backgroundColor : COLORS.backgroundColor,
        borderBottomWidth: noBorder ? undefined : StyleSheet.hairlineWidth,
      }]}>
        <Text style={[
          style.defaultTitleStyle,
          space.paddingLeftM,
          space.paddingRightS,
          settingsStyle ? {} :
            {
              ...typography.mediumGameFont,
              fontWeight: '600',
            },
          { color: colors ? colors.textColor : COLORS.darkTextColor },
        ]}>
          { title }
        </Text>
        { !!value && (
          <Text
            style={[
              style.defaultValueStyle,
              space.paddingLeftS,
              space.paddingRightM,
              typography.label,
              {
                color: colors ? colors.textColor : COLORS.darkTextColor,
                fontWeight: '400',
              },
            ]}
          >
            { value }
          </Text>
        ) }
        { !disabled && this.renderWidget() }
      </View>
    );
  }

  _onPress = () => {
    const { onPress, id } = this.props;
    onPress(id);
  };

  render() {
    const { disabled } = this.props;
    if (disabled) {
      return this.renderContent();
    }
    return (
      <TouchableOpacity onPress={this._onPress}>
        { this.renderContent() }
      </TouchableOpacity>
    );
  }
}

const style = StyleSheet.create({
  defaultContainerStyle: {
    padding: 0,
    minHeight: 50,
    backgroundColor: COLORS.backgroundColor,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#888',
  },
  defaultTitleStyle: {
    flex: 1,
    fontSize: 16,
  },
  defaultValueStyle: {
    color: COLORS.lightTextColor,
    fontSize: 14,
    flex: 0,
  },
});
