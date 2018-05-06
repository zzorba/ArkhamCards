import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default class DialogOption extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      text,
      onPress,
    } = this.props;
    onPress(text);
  }

  render() {
    const {
      text,
      selected,
    } = this.props;
    return (
      <View style={styles.item}>
        <TouchableOpacity onPress={this._onPress}>
          <Text style={styles.itemText}>
            { `${capitalize(text)}${selected ? ' ✓' : ''}` }
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    height: 50,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#eeeeee',
  },
  itemText: {
    color: 'rgb(0,122,255)',
    textAlign: 'center',
    lineHeight: 50,
    fontSize: 22,
    fontWeight: '400',
  },
});
