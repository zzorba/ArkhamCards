import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AppIcon from './AppIcon';
import ArkhamIcon from './ArkhamIcon';
import StyleContext from '@styles/StyleContext';
import { ThemeColors } from '@styles/theme';

export type ArkhamButtonIconType = 'filter-clear' | 'book' | 'trash' | 'draft' | 'addcard' | 'draw' | 'parallel' | 'date' | 'world' | 'check' | 'search' | 'edit' | 'expand' | 'deck' | 'card' | 'up' | 'campaign' | 'faq' | 'xp' | 'show' | 'hide' | 'dismiss' | 'confirm' | 'taboo';
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
    case 'date':
      return <AppIcon name="date" size={24 * fontScale} color={iconColor} />;
    case 'world':
      return <View style={styles.worldIcon}><AppIcon name="world" size={24 * fontScale} color={iconColor} /></View>;
    case 'check':
      return <AppIcon name="check-thin" size={22 * fontScale} color={iconColor} />;
    case 'card':
      return <View style={styles.cardIcon}><AppIcon name="cards" size={22 * fontScale} color={iconColor} /></View>;
    case 'draw':
      return <View style={styles.deckIcon}><AppIcon name="draw" size={26 * fontScale} color={iconColor} /></View>;
    case 'deck':
    case 'draft':
    case 'addcard':
      return <View style={styles.deckIcon}><AppIcon name={icon} size={26 * fontScale} color={iconColor} /></View>;
    case 'campaign':
      return <View style={styles.bookIcon}><AppIcon name="book" size={24 * fontScale} color={iconColor} /></View>;
    case 'expand':
      return <AppIcon name="plus-button" size={24 * fontScale} color={iconColor} />;
    case 'up':
      return (
        <View style={styles.upIcon}>
          <MaterialCommunityIcons name="arrow-up-bold" size={22 * fontScale} color={iconColor} />
        </View>
      );
    case 'faq':
      return <ArkhamIcon name="wild" size={18 * fontScale} color={iconColor} />;
    case 'book':
      return <AppIcon name={icon} size={22 * fontScale} color={iconColor} />;
    case 'search':
    case 'edit':
    case 'taboo':
    case 'parallel':
    case 'xp':
    case 'show':
    case 'hide':
    case 'dismiss':
    case 'trash':
    case 'confirm':
    case 'filter-clear':
      return <AppIcon name={icon} size={24 * fontScale} color={iconColor} />;
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
  upIcon: {
    marginTop: -2,
  },
  bookIcon: {
    marginTop: -3,
  },
});
