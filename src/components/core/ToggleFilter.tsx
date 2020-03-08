import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import ArkhamIcon from 'icons/ArkhamIcon';
import Switch from 'components/core/Switch';
import typography from 'styles/typography';
import { s, xs } from 'styles/space';

const ICON_SIZE = 28;

interface Props {
  label?: string;
  icon?: string;
  setting: string;
  value: boolean;
  onChange: (setting: string, value: boolean) => void;
  style?: ViewStyle;
}

export default class ToggleFilter extends React.Component<Props> {
  _onToggle = () => {
    const {
      onChange,
      setting,
      value,
    } = this.props;
    onChange(setting, !value);
  }

  renderLabel() {
    const {
      label,
      icon,
    } = this.props;
    if (icon) {
      return (
        <View style={styles.icon}>
          <ArkhamIcon name={icon} size={ICON_SIZE} color="#000000" />
        </View>
      );
    }
    return (
      <Text style={[typography.text, styles.labelText]}>{ label }</Text>
    );
  }

  render() {
    const {
      style,
    } = this.props;
    return (
      <View style={[styles.row, style]}>
        <View style={styles.label}>
          { this.renderLabel() }
        </View>
        <Switch
          value={this.props.value}
          onValueChange={this._onToggle}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: s + xs,
    paddingBottom: xs,
  },
  icon: {
    width: 28,
  },
  label: {
    paddingLeft: s,
    paddingRight: xs,
  },
  labelText: {
    fontWeight: '400',
    minWidth: 28,
  },
});
