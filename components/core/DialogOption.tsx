import React from 'react';
import { capitalize } from 'lodash';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

interface Props {
  text: string;
  onPress: (text: string) => void;
  selected: boolean;
  noCapitalize?: boolean;
}
export default class DialogOption extends React.Component<Props> {
  _onPress = () => {
    const {
      text,
      onPress,
    } = this.props;
    onPress(text);
  };

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
