import React from 'react';

import { LIGHT_THEME, ThemeColors } from './theme';
import typography, { Typography } from '@styles/typography';
import { ViewStyle } from 'react-native';

export interface StyleContextType {
  darkMode: boolean;
  colors: ThemeColors;
  gameFont: string;
  fontScale: number;
  typography: Typography;
  backgroundStyle: ViewStyle;
  borderStyle: ViewStyle;
  disabledStyle: ViewStyle;
}

export const DEFAULLT_STYLE_CONTEXT = {
  darkMode: false,
  colors: LIGHT_THEME,
  gameFont: 'Teutonic',
  fontScale: 1,
  typography: typography(1.0, LIGHT_THEME, 'Teutonic'),
  backgroundStyle: {
    backgroundColor: LIGHT_THEME.background,
  },
  borderStyle: {
    borderColor: LIGHT_THEME.divider,
  },
  disabledStyle: {
    backgroundColor: LIGHT_THEME.disableOverlay,
  },
};

export const StyleContext = React.createContext<StyleContextType>(DEFAULLT_STYLE_CONTEXT);

export default StyleContext;
