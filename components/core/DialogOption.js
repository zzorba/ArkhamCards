import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export default class DialogOption extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
    noCapitalize: PropTypes.bool,
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
      noCapitalize,
    } = this.props;
    return (
      <View style={styles.item}>
        <TouchableOpacity onPress={this._onPress}>
          <Text
            style={[styles.itemText, { fontSize: text.length > 30 ? 14 : 22 }]}
            numberOfLines={2}
          >
            { `${noCapitalize ? text : capitalize(text)}${selected ? ' ✓' : ''}` }
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    height: 50 * DeviceInfo.getFontScale(),
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
