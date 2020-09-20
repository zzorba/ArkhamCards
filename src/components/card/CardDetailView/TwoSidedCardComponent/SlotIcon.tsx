import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ArkhamIcon from '@icons/ArkhamIcon';
import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';

interface Props {
  slot: string;
}

function Icon({ slot, inverted, color }: { slot: string; inverted?: boolean; color: string }) {
  switch (slot) {
    case 'hand x2':
      return <ArkhamIcon name={`hand_x2${inverted ? '_inverted' : ''}`} size={20} color={color} />;
    case 'arcane x2':
      return <ArkhamIcon name={`arcane_x2${inverted ? '_inverted' : ''}`} size={28} color={color} />;
    case 'accessory':
      return <View style={space.marginLeftXs}><ArkhamIcon name={`accessory${inverted ? '_inverted' : ''}`} size={28} color={color} /></View>;
    case 'ally':
      return <View style={space.marginLeftXs}><ArkhamIcon name={`ally${inverted ? '_inverted' : ''}`} size={24} color={color} /></View>;
    case 'arcane':
      return <View style={{ marginLeft: 1 }}><ArkhamIcon name={`arcane${inverted ? '_inverted' : ''}`} size={26} color={color} /></View>;
    case 'body':
      return <ArkhamIcon name={`body${inverted ? '_inverted' : ''}`} size={26} color={color} />;
    case 'hand':
      return <ArkhamIcon name={`${slot}${inverted ? '_inverted' : ''}`} size={22} color={color} />;
    case 'tarot':
      return <AppIcon name="cards" size={22} color={color} />;
    default:
      return <Text>{slot}</Text>;
  }
}
export default function SlotIcon({ slot }: Props) {
  const { colors } = useContext(StyleContext);
  return (
    <View style={[styles.wrapper, { backgroundColor: colors.L10 }]}>
      <View style={styles.icon}>
        <Icon slot={slot.toLowerCase()} color={colors.D30} />
      </View>
      <View style={styles.icon}>
        <Icon slot={slot.toLowerCase()} color={colors.L30} inverted />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 38,
    height: 38,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
