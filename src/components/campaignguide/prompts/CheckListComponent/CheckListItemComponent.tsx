import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import Switch from 'components/core/Switch';
import typography from 'styles/typography';

interface Props {
  code: string;
  name: string;
  selected: boolean;
  onChoiceToggle: (code: string) => void;
  editable: boolean;
}

export default class CheckListItemComponent extends React.Component<Props> {
  _toggle = () => {
    const {
      onChoiceToggle,
      code,
    } = this.props;
    onChoiceToggle(code);
  };

  render() {
    const {
      name,
      editable,
      selected,
    } = this.props;
    if (!editable && !selected) {
      return null;
    }
    return (
      <View style={styles.row}>
        <Text style={[typography.gameFont, styles.nameText]}>
          { name }
        </Text>
        { editable ? (
          <Switch
            onValueChange={this._toggle}
            value={selected}
          />
        ) : (
          <MaterialCommunityIcons name="check" size={18} color="#222" />
        ) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  nameText: {
    fontWeight: '700',
  },
  row: {
    borderBottomWidth: 1,
    borderColor: '#888',
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
