import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import withStyles, { StylesProps } from '@components/core/withStyles';
import COLORS from '@styles/colors';
import typography from '@styles/typography';
import space, { s } from '@styles/space';

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

class PickerStyleButton extends React.Component<Props & StylesProps> {
  renderWidget() {
    const { widget, colors } = this.props;
    switch (widget) {
      case 'shuffle':
        return (
          <View style={space.marginRightS}>
            <MaterialCommunityIcons
              name="shuffle-variant"
              size={24}
              color={colors ? colors.textColor : COLORS.darkText}
            />
          </View>
        );
      case 'nav':
        return (
          <MaterialIcons
            name="keyboard-arrow-right"
            size={30}
            color={colors ? colors.textColor : COLORS.darkText}
          />
        );
      case 'delete':
        return (
          <View style={space.marginRightS}>
            <MaterialIcons
              name="delete"
              size={26}
              color={colors ? colors.textColor : COLORS.darkText}
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
      widget,
      gameFont,
    } = this.props;
    return (
      <View style={[style.defaultContainerStyle, {
        backgroundColor: colors ? colors.backgroundColor : 'transparent',
        borderBottomWidth: noBorder ? undefined : StyleSheet.hairlineWidth,
      }]}>
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
              settingsStyle ? {} :
                {
                  ...typography.mediumGameFont,
                  fontFamily: gameFont,
                  fontWeight: '600',
                },
              { color: colors ? colors.textColor : COLORS.darkText },
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
                typography.label,
                {
                  color: colors ? colors.textColor : COLORS.darkText,
                  fontWeight: '400',
                  flex: 4,
                  textAlign: 'right',
                },
              ]}
            >
              { value }
            </Text>
          ) }
        { !disabled && this.renderWidget() }
        </View>
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

export default withStyles(PickerStyleButton);

const style = StyleSheet.create({
  defaultContainerStyle: {
    padding: 0,
    minHeight: 50,
    backgroundColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: COLORS.divider,
  },
  defaultTitleStyle: {
    fontSize: 16,
    minWidth: 100,
  },
  defaultValueStyle: {
    color: COLORS.lightText,
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
