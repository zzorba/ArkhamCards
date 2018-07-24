import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Switch,
  Text,
  View,
  ViewPropTypes,
} from 'react-native';

import ArkhamIcon from '../../assets/ArkhamIcon';

const ICON_SIZE = 32;

export default class ToggleFilter extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    icon: PropTypes.string,
    setting: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    style: ViewPropTypes.style,
  };

  constructor(props) {
    super(props);

    this._onToggle = this.onToggle.bind(this);
  }

  onToggle() {
    const {
      onChange,
      setting,
    } = this.props;
    onChange(setting);
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
      <Text style={styles.labelText}>{ label }</Text>
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
          onTintColor="#222222"
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
    paddingRight: 12,
    paddingBottom: 4,
  },
  icon: {
    width: 28,
  },
  label: {
    paddingLeft: 8,
    paddingRight: 4,
  },
  labelText: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '400',
    minWidth: 28,
  },
});
