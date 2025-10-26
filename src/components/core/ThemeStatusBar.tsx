import React, { useContext } from 'react';
import { StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import StyleContext from '@styles/StyleContext';

export default function ThemeStatusBar() {
  const { colors, darkMode } = useContext(StyleContext);
  const isFocused = useIsFocused();

  return isFocused ? (
    <StatusBar
      backgroundColor={colors.background}
      barStyle={darkMode ? 'light-content' : 'dark-content'}
    />
  ) : null;
}
