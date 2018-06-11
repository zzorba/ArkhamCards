import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

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
          { value }
        </Text>
        <Switch
          value={selected}
          onValueChange={this._onCheckPress}
          onTintColor="#222222"
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
    paddingRight: 8,
  },
  title: {
    marginLeft: 8,
    fontSize: 20,
    fontFamily: 'System',
    flex: 1,
  },
});
