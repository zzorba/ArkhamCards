import React from 'react';
import { capitalize } from 'lodash';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  text: string;
  fontScale: number;
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
      fontScale,
      selected,
      noCapitalize,
    } = this.props;
    return (
      <View style={[styles.item, { height: 50 * fontScale }]}>
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
