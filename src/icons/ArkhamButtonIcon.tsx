import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AppIcon from './AppIcon';
import ArkhamIcon from './ArkhamIcon';
import StyleContext from '@styles/StyleContext';

export type ArkhamButtonIconType = 'search' | 'edit' | 'expand' | 'deck' | 'card' | 'up' | 'campaign' | 'faq' | 'xp' | 'show' | 'hide' | 'dismiss' | 'confirm';
interface Props {
  icon: ArkhamButtonIconType;
  color: 'light' | 'dark';
}

export default function ArkhamButtonIcon({ icon, color }: Props) {
  const { colors, fontScale } = useContext(StyleContext);
  const iconColor = color === 'light' ? colors.L20 : colors.D20;
  switch (icon) {
    case 'card':
      return <View style={styles.cardIcon}><AppIcon name="cards" size={22 * fontScale} color={iconColor} /></View>;
    case 'deck':
      return <View style={styles.deckIcon}><AppIcon name="deck" size={24 * fontScale} color={iconColor} /></View>;
    case 'search':
      return <AppIcon name="search" size={18 * fontScale} color={iconColor} />;
    case 'campaign':
      return <AppIcon name="book" size={18 * fontScale} color={iconColor} />;
    case 'edit':
      return <View style={styles.editIcon}><AppIcon name="edit" size={16 * fontScale} color={iconColor} /></View>;
    case 'expand':
      return <AppIcon name="plus" size={18 * fontScale} color={iconColor} />;
    case 'up':
      return (
        <View style={styles.upIcon}>
          <MaterialCommunityIcons name="arrow-up-bold" size={22 * fontScale} color={iconColor} />
        </View>
      );
    case 'faq':
      return <ArkhamIcon name="wild" size={18 * fontScale} color={iconColor} />;
    case 'xp':
      return <AppIcon name="xp" size={22 * fontScale} color={iconColor} />;
    case 'show':
      return <AppIcon name="show" size={22 * fontScale} color={iconColor} />;
    case 'hide':
      return <AppIcon name="hide" size={22 * fontScale} color={iconColor} />;
    case 'dismiss':
      return <AppIcon name="hide" size={22 * fontScale} color={iconColor} />;
    case 'confirm':
      return <AppIcon name="check" size={22 * fontScale} color={iconColor} />;
  }
}


const styles = StyleSheet.create({
  deckIcon: {
    marginTop: -4,
  },
  cardIcon: {
    marginTop: -2,
    marginRight: -4,
  },
  editIcon: {
    marginLeft: 2,
  },
  upIcon: {
    marginTop: -2,
  },
});
