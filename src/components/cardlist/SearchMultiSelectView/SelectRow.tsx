import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import ArkhamSwitch from '@components/core/ArkhamSwitch';

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
      <Text style={[typography.large, typography.dark, space.marginLeftS]}>
        { value }
      </Text>
      <ArkhamSwitch
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
});
