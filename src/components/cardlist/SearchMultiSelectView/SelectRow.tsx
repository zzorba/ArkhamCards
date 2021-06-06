import React, { useCallback, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { capitalize } from 'lodash';

import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import ArkhamIcon from '@icons/ArkhamIcon';

interface Props {
  value: string;
  selected: boolean;
  onSelectChanged: (value: string, selected: boolean) => void;
  capitalize?: boolean;
}

export default function SelectRow({ value, selected, onSelectChanged, capitalize: capitalizeValue }: Props) {
  const { typography, borderStyle, fontScale, colors } = useContext(StyleContext);
  const onCheckPress = useCallback(() => {
    onSelectChanged(value, !selected);
  }, [value, onSelectChanged, selected]);
  const has_per_investigator = value.indexOf('[per_investigator]') !== -1;
  const text = value.replace('[per_investigator] ', '');

  return (
    <View style={[styles.row, borderStyle, space.paddingRightS, { height: 24 * fontScale + 32 }]}>
      <Text style={[typography.large, typography.dark, space.marginLeftS]}>
        { has_per_investigator ? <ArkhamIcon name="per_investigator" size={24 * fontScale} color={colors.darkText} /> : ''}
        { has_per_investigator ? ' ' : '' }
        { capitalizeValue ? capitalize(text) : text }
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
});
