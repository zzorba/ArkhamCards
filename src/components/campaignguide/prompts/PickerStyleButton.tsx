import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from 'styles/colors';
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
}

export default class PickerStyleButton extends React.Component<Props> {
  renderContent() {
    const { colors, disabled, title, value, widget } = this.props;
    return (
      <View style={[style.defaultContainerStyle, {
        backgroundColor: colors ? colors.backgroundColor : COLORS.white,
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
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
  },
  defaultTitleStyle: {
    flex: 1,
    fontSize: 16,
  },
  defaultValueStyle: {
    color: 'rgb(160,160,160)',
    fontSize: 14,
    flex: 0,
  },
});
