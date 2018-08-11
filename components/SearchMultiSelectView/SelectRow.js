import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import capitalize from 'capitalize';

import Switch from '../core/Switch';

export default class SelectRow extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    onSelectChanged: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._onCheckPress = this.onCheckPress.bind(this);
  }

  onCheckPress() {
    const {
      value,
      selected,
      onSelectChanged,
    } = this.props;
    onSelectChanged(value, !selected);
  }

  render() {
    const {
      value,
      selected,
    } = this.props;

    return (
      <View style={styles.row}>
        <Text style={styles.title}>
          { capitalize(value) }
        </Text>
        <Switch
          value={selected}
          onValueChange={this._onCheckPress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
    paddingRight: 8,
  },
  title: {
    marginLeft: 8,
    fontSize: 20,
    fontFamily: 'System',
    flex: 1,
  },
});
