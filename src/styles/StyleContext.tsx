import React from 'react';

import { LIGHT_THEME, ThemeColors } from './theme';
import typography from '@styles/typography';

export interface StyleContextType {
  darkMode: boolean;
  colors: ThemeColors;
  gameFont: string;
  fontScale: number;
  typography: typeof typography;
}

export const DEFAULLT_STYLE_CONTEXT = {
  darkMode: false,
  colors: LIGHT_THEME,
  gameFont: 'Teutonic',
  fontScale: 1,
  typography,
};

export const StyleContext = React.createContext<StyleContextType>(DEFAULLT_STYLE_CONTEXT);

export default StyleContext;
