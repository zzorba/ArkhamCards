import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

import StyleContext, { StyleContextType } from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';

interface Props extends TouchableOpacityProps {
  value: boolean;
  onValueChange: (checked: boolean) => void;
  accessibilityLabel?: string;
}
export default class ArkhamSwitch extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _onPress = () => {
    const { value, onValueChange } = this.props;
    onValueChange(!value);
  }
  render() {
    const { value, onValueChange, accessibilityLabel, disabled, ...props } = this.props;
    const { colors } = this.context;
    return (
      <TouchableOpacity
        onPress={this._onPress}
        accessibilityRole="switch"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ checked: value }}
        disabled={disabled} {...props}
      >
        <View style={styles.icon}>
          <AppIcon size={28} name="check-circle" color={disabled ? colors.L20 : colors.L10} />
          { !!value && (
            <View style={styles.check}>
              <AppIcon size={20} name="check" color={disabled ? colors.L20 : colors.M} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  check: {
    position: 'absolute',
    top: 2,
    right: 3,
  },
});

