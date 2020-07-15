import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Switch from '@components/core/Switch';
import space from '@styles/space';
import COLORS from '@styles/colors';

interface Props {
  value: string;
  selected: boolean;
  onSelectChanged: (value: string, selected: boolean) => void;
}

export default class SelectRow extends React.Component<Props> {
  _onCheckPress = () => {
    const {
      value,
      selected,
      onSelectChanged,
    } = this.props;
    onSelectChanged(value, !selected);
  };

  render() {
    const {
      value,
      selected,
    } = this.props;

    return (
      <View style={[styles.row, space.paddingRightS]}>
        <Text style={[styles.title, space.marginLeftS]}>
          { value }
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
    borderColor: COLORS.divider,
  },
  title: {
    fontSize: 20,
    fontFamily: 'System',
    flex: 1,
    color: COLORS.darkText,
  },
});
