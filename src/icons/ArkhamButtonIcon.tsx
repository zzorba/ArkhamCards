import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AppIcon from './AppIcon';
import ArkhamIcon from './ArkhamIcon';
import StyleContext from '@styles/StyleContext';
import { ThemeColors } from '@styles/theme';

export type ArkhamButtonIconType = 'world' | 'check' | 'search' | 'edit' | 'expand' | 'deck' | 'card' | 'up' | 'campaign' | 'faq' | 'xp' | 'show' | 'hide' | 'dismiss' | 'confirm' | 'taboo';
interface Props {
  icon: ArkhamButtonIconType;
  color: 'light' | 'dark' | 'faded';
}

function getColor(color: 'light' | 'dark' | 'faded', colors: ThemeColors) {
  switch (color) {
    case 'light': return colors.L20;
    case 'dark': return colors.D20;
    case 'faded': return colors.M;
  }
}

export default function ArkhamButtonIcon({ icon, color }: Props) {
  const { colors, fontScale } = useContext(StyleContext);
  const iconColor = getColor(color, colors);
  switch (icon) {
    case 'world':
      return <View style={styles.worldIcon}><AppIcon name="world" size={24 * fontScale} color={iconColor} /></View>;
    case 'check':
      return <AppIcon name="check-thin" size={22 * fontScale} color={iconColor} />;
    case 'card':
      return <View style={styles.cardIcon}><AppIcon name="cards" size={22 * fontScale} color={iconColor} /></View>;
    case 'deck':
      return <View style={styles.deckIcon}><AppIcon name="deck" size={26 * fontScale} color={iconColor} /></View>;
    case 'search':
      return <AppIcon name="search" size={18 * fontScale} color={iconColor} />;
    case 'campaign':
      return <View style={styles.bookIcon}><AppIcon name="book" size={20 * fontScale} color={iconColor} /></View>;
    case 'edit':
      return <View style={styles.editIcon}><AppIcon name="edit" size={16 * fontScale} color={iconColor} /></View>;
    case 'expand':
      return <AppIcon name="plus" size={18 * fontScale} color={iconColor} />;
    case 'taboo':
      return <AppIcon name="taboo" size={18 * fontScale} color={iconColor} />;
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
      return <AppIcon name="dismiss" size={18 * fontScale} color={iconColor} />;
    case 'confirm':
      return <AppIcon name="check" size={22 * fontScale} color={iconColor} />;
  }
}


const styles = StyleSheet.create({
  worldIcon: {
    marginTop: -4,
  },
  deckIcon: {
    marginTop: -4,
    marginLeft: -2,
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
  bookIcon: {
    marginTop: -3,
  },
});
