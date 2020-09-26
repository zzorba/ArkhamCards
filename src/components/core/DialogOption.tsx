import React from 'react';
import { capitalize } from 'lodash';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface Props {
  text: string;
  onPress: (text: string) => void;
  selected: boolean;
  noCapitalize?: boolean;
}

export default class DialogOption extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  static options() {
    return ({
      overlay: {
        interceptTouchOutside: true,
      },
    });
  }

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
    const { fontScale, borderStyle } = this.context;
    return (
      <View style={[styles.item, borderStyle, { height: 50 * fontScale }]}>
        <TouchableOpacity onPress={this._onPress} testID={`Sort-${text}`}>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemText: {
    color: 'rgb(0,122,255)',
    textAlign: 'center',
    lineHeight: 50,
    fontSize: 22,
    fontWeight: '400',
  },
});
