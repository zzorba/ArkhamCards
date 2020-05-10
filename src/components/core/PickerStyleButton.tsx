import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import COLORS from 'styles/colors';
import typography from 'styles/typography';
import space from 'styles/space';

interface Props {
  title: string;
  value: string;
  id: string;
  onPress: (id: string) => void;
  disabled?: boolean;
  colors?: {
    backgroundColor: string;
    textColor: string;
  };
  widget?: React.ReactNode;
  noBorder?: boolean;
}

export default class PickerStyleButton extends React.Component<Props> {
  renderContent() {
    const { colors, disabled, title, value, widget, noBorder } = this.props;
    return (
      <View style={[style.defaultContainerStyle, {
        backgroundColor: colors ? colors.backgroundColor : COLORS.backgroundColor,
        borderBottomWidth: noBorder ? undefined : StyleSheet.hairlineWidth,
      }]}>
        <Text style={[
          style.defaultTitleStyle,
          space.paddingLeftM,
          space.paddingRightS,
          typography.mediumGameFont,
          {
            color: colors ? colors.textColor : COLORS.black,
            fontWeight: '600',
          },
        ]}>
          { title }
        </Text>
        <Text
          style={[
            style.defaultValueStyle,
            space.paddingLeftS,
            space.paddingRightM,
            typography.label,
            {
              color: colors ? colors.textColor : COLORS.black,
              fontWeight: '400',
            },
          ]}
        >
          { value }
        </Text>
        { !disabled && (
          widget && <View>{ widget }</View>
        ) }
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
