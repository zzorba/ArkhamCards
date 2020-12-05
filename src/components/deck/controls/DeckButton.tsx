import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';
import space from '@styles/space';

interface Props {
  title: string;
  icon: 'plus-thin' | 'dismiss';
  color?: 'red';
  onPress?: () => void;
}

export default function DeckButton({ title, icon, color, onPress }: Props) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <Ripple style={[
      styles.button,
      { backgroundColor: color === 'red' ? colors.warn : colors.D10 },
    ]} onPress={onPress} rippleColor={color === 'red' ? colors.faction.survivor.lightBackground : colors.M}>
      <View style={[styles.row, space.paddingSideXs, space.paddingTopS, space.paddingBottomS]}>
        <View style={[styles.icon, space.marginRightS]}>
          <AppIcon name={icon} size={icon === 'plus-thin' ? 24 : 20} color={colors.background} />
        </View>
        <Text style={[typography.large, { color: colors.background }]}>{ title }</Text>
      </View>
    </Ripple>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    width: 32,
    height: 32,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
