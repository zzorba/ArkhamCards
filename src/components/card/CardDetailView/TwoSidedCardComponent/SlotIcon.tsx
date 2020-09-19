import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ArkhamIcon from '@icons/ArkhamIcon';
import { SlotCodeType } from '@app_constants';
import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';

interface Props {
  slot: string;
}

function Icon({ slot }: Props) {
  const { colors } = useContext(StyleContext);
  switch (slot) {
    case 'hand x2':
      return <ArkhamIcon name="hand-x2" size={22} color={colors.D30} />
    case 'arcane x2':
      return <ArkhamIcon name="arcane-x2" size={22} color={colors.D30} />
    case 'accessory':
    case 'body':
    case 'ally':
    case 'arcane':
    case 'hand':
      return <ArkhamIcon name={slot} size={22} color={colors.D30} />
    case 'tarot':
      return <AppIcon name="card" size={22} color={colors.D30} />
    default:
      return <Text>{slot}</Text>;
  }
}
export default function SlotIcon({ slot }: Props) {
  const { colors } = useContext(StyleContext);
  return (
    <View style={[styles.wrapper, { backgroundColor: colors.L20 }]}>
      <Icon slot={slot.toLowerCase()} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
