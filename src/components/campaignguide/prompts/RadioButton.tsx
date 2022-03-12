import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import COLORS from '@styles/colors';
import ArkhamIcon from '@icons/ArkhamIcon';
import { ChoiceIcon } from '@data/scenario/types';
import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import EncounterIcon from '@icons/EncounterIcon';

interface Props {
  color: 'light' | 'dark';
  icon: 'per_investigator' | 'radio' | ChoiceIcon | string;
  selected?: boolean;
}

const ICON_SIZE = {
  mental: 22,
  physical: 22,
  resign: 18,
  dismiss: 18,
  accept: 20,
};

export default function RadioButton({ color, icon, selected }: Props) {
  const { colors } = useContext(StyleContext);
  const selectedColor = color === 'light' ? '#FFFBF2' : colors.L20;
  const iconColor = color === 'light' ? COLORS.D30 : colors.D30;
  if (icon === 'radio') {
    const radioColor = color === 'light' ? COLORS.L30 : colors.D20;
    return (
      <View style={[styles.button, styles.radioButton, { borderColor: radioColor }]}>
        { selected && <View style={[styles.radioFillButton, { backgroundColor: radioColor }]} /> }
      </View>
    );
  }
  switch (icon) {
    case 'per_investigator':
    case 'mental':
    case 'physical':
    case 'resign':
    case 'dismiss':
    case 'accept':
      return (
        <View style={[styles.button, { backgroundColor: selected ? selectedColor : '#FFFBF244' }]}>
          { !!selected && (icon === 'per_investigator' ? <ArkhamIcon name={icon} size={22} color={iconColor} /> : <AppIcon name={icon === 'accept' ? 'check' : icon} size={ICON_SIZE[icon]} color={iconColor} />) }
        </View>
      );
    default:
      return (
        <View style={[styles.button, { backgroundColor: selected ? selectedColor : '#FFFBF244' }]}>
          { !!selected && <EncounterIcon encounter_code={icon} size={24} color={iconColor} /> }
        </View>
      );
  }
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    width: 32,
    height: 32,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: COLORS.L30,
  },
  radioFillButton: {
    borderRadius: 12,
    width: 24,
    height: 24,
    backgroundColor: COLORS.L30,
  },
});
