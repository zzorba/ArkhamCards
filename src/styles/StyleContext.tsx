import React from 'react';
import { LIGHT_THEME, ThemeColors } from './theme';

export interface StyleContextType {
  darkMode: boolean;
  colors: ThemeColors;
  gameFont: string;
  fontScale: number;
}

export const StyleContext = React.createContext<StyleContextType>({
  darkMode: false,
  colors: LIGHT_THEME,
  gameFont: 'Teutonic',
  fontScale: 1.0,
});

export default StyleContext;
