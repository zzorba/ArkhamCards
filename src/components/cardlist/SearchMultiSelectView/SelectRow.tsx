import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Switch from '@components/core/Switch';
import space from '@styles/space';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';

interface Props {
  value: string;
  selected: boolean;
  onSelectChanged: (value: string, selected: boolean) => void;
}

export default function SelectRow({ value, selected, onSelectChanged }: Props) {
  const { typography, borderStyle } = useContext(StyleContext);
  const onCheckPress = () => {
    onSelectChanged(value, !selected);
  };
  return (
    <View style={[styles.row, borderStyle, space.paddingRightS]}>
      <Text style={[styles.title, typography.black, space.marginLeftS]}>
        { value }
      </Text>
      <Switch
        value={selected}
        onValueChange={onCheckPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'System',
    flex: 1,
  },
});
