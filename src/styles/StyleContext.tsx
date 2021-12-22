import React from 'react';
import { Platform, ViewStyle } from 'react-native';

import { LIGHT_THEME, ThemeColors } from './theme';
import typography, { Typography } from '@styles/typography';

export interface StyleContextType {
  darkMode: boolean;
  colors: ThemeColors;
  italicFont: string;
  gameFont: string;
  fontScale: number;
  typography: Typography;
  backgroundStyle: ViewStyle;
  borderStyle: ViewStyle;
  disabledStyle: ViewStyle;
  shadow: {
    small: ViewStyle;
    medium: ViewStyle;
    large: ViewStyle;
    drop: ViewStyle,
  };
  width: number;
  height: number;
  justifyContent: boolean;
}

export const DEFAULT_STYLE_CONTEXT: StyleContextType = {
  darkMode: false,
  justifyContent: true,
  width: 100,
  height: 100,
  colors: LIGHT_THEME,
  italicFont: 'Alegreya-Italic',
  gameFont: 'Teutonic',
  fontScale: 1,
  typography: typography(1.0, LIGHT_THEME, 'Alegreya-Italic', 'Alegreya-ExtraBold-Italic', 'Teutonic', 'en'),
  backgroundStyle: {
    backgroundColor: LIGHT_THEME.background,
  },
  borderStyle: {
    borderColor: LIGHT_THEME.divider,
  },
  disabledStyle: {
    backgroundColor: LIGHT_THEME.disableOverlay,
  },
  shadow: {
    large: Platform.select({
      android: {
        elevation: 6,
      },
      default: {
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        shadowColor: 'black',
        shadowOpacity: 0.25,
      },
    }),
    medium: Platform.select({
      android: {
        elevation: 4,
      },
      default: {
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowColor: 'black',
        shadowOpacity: 0.25,
      },
    }),
    small: Platform.select({
      android: {
        elevation: 2,
      },
      default: {
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        shadowColor: 'black',
        shadowOpacity: 0.25,
      },
    }),
    drop: Platform.select({
      android: {
        elevation: 8,
      },
      default: {
        shadowOffset: { width: 0, height: 12 },
        shadowRadius: 12,
        shadowColor: 'black',
        shadowOpacity: 0.6,
      },
    }),
  },
};

export const StyleContext = React.createContext<StyleContextType>(DEFAULT_STYLE_CONTEXT);

export default StyleContext;
