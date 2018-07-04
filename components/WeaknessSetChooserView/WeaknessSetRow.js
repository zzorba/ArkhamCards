import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

export default class WeaknessSetRow extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    set: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      navigator,
      set,
    } = this.props;
    navigator.push({
      screen: 'Weakness.Detail',
      passProps: {
        id: set.id,
      },
    });
  }

  render() {
    const {
      set,
    } = this.props;
    return (
      <TouchableOpacity style={styles.row} onPress={this._onPress}>
        <Text>{ set.name }</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    height: 56,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
});
