import React, { useContext, useMemo } from 'react';
import { StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import StyleContext from '@styles/StyleContext';
import COLORS from '@styles/colors';
import Card from '@data/types/Card';

interface Props {
  investigator?: Card;
  mode?: 'view' | 'edit' | 'upgrade';
}

export default function InvestigatorStatusBar({ investigator, mode = 'view' }: Props) {
  const { colors, darkMode } = useContext(StyleContext);
  const isFocused = useIsFocused();

  const factionColor = useMemo(() => {
    return investigator ? colors.faction[investigator.factionCode()].background : colors.background;
  }, [investigator, colors]);

  const backgroundColors = {
    view: factionColor,
    edit: darkMode ? COLORS.D20 : COLORS.D10,
    upgrade: colors.upgrade,
  };

  const statusBarStyles: { [key: string]: 'light' | 'dark' } = {
    view: 'light',
    edit: 'light',
    upgrade: 'dark',
  };

  const backgroundColor = backgroundColors[mode];
  const barStyle = statusBarStyles[mode] === 'light' ? 'light-content' : 'dark-content';

  return isFocused ? (
    <StatusBar
      backgroundColor={backgroundColor}
      barStyle={barStyle}
    />
  ) : null;
}
