import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CardIcon from '@icons/CardIcon';
import StyleContext from '@styles/StyleContext';
import space, { xs } from '@styles/space';

interface Props {
  slot: string;
  size?: 'small';
}

function Icon({ slot, inverted, color, scale }: { slot: string; inverted?: boolean; scale: number; color: string }) {
  switch (slot) {
    case 'hand x2':
      return <CardIcon name={`hand_x2${inverted ? '_inverted' : ''}`} size={20 * scale} color={color} />;
    case 'arcane x2':
      return <CardIcon name={`arcane_x2${inverted ? '_inverted' : ''}`} size={28 * scale} color={color} />;
    case 'accessory':
      return <View style={space.marginLeftXs}><CardIcon name={`accessory${inverted ? '_inverted' : ''}`} size={28 * scale} color={color} /></View>;
    case 'ally':
      return <View style={space.marginLeftXs}><CardIcon name={`ally${inverted ? '_inverted' : ''}`} size={24 * scale} color={color} /></View>;
    case 'arcane':
      return <View style={{ marginLeft: 1 }}><CardIcon name={`arcane${inverted ? '_inverted' : ''}`} size={26 * scale} color={color} /></View>;
    case 'body':
      return <CardIcon name={`body${inverted ? '_inverted' : ''}`} size={26 * scale} color={color} />;
    case 'hand':
      return <CardIcon name={`hand${inverted ? '_inverted' : ''}`} size={22 * scale} color={color} />;
    case 'tarot':
      return <CardIcon name={`tarot${inverted ? '_inverted' : ''}`} size={26 * scale} color={color} />;
    default:
      return <Text>{slot}</Text>;
  }
}
export default function SlotIcon({ slot, size }: Props) {
  const { colors } = useContext(StyleContext);
  const sizeStyle = size === 'small' ? { width: 38 * 0.75, height: 38 * 0.75 } : { width: 38, height: 38 };
  return (
    <View style={[styles.wrapper, sizeStyle, { backgroundColor: colors.L10 }]}>
      <View style={[styles.icon, sizeStyle]}>
        <Icon slot={slot.toLowerCase()} color={colors.D30} scale={size === 'small' ? 0.75 : 1.0} />
      </View>
      <View style={[styles.icon, sizeStyle]}>
        <Icon slot={slot.toLowerCase()} color={colors.L30} scale={size === 'small' ? 0.75 : 1.0} inverted />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 19,
    marginLeft: xs,
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
