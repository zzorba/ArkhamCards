import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import StyleContext, { StyleContextType } from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';

interface Props {
  value: boolean;
  onValueChange: (checked: boolean) => void;
}
export default class ArkhamSwitch extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _onPress = () => {
    const { value, onValueChange } = this.props;
    onValueChange(!value);
  }
  render() {
    const { value } = this.props;
    const { colors } = this.context;
    return  (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.icon}>
          <AppIcon size={28} name="check-circle" color={colors.L10} />
          { !!value && (
            <View style={styles.check}>
              <AppIcon size={20} name="check" color={colors.M} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
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

