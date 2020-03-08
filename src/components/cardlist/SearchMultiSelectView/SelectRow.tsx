import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Switch from 'components/core/Switch';

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
      <View style={styles.row}>
        <Text style={styles.title}>
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
