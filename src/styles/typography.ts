import { Platform, StyleSheet, TextStyle } from 'react-native';

import COLORS from './colors';

export interface TypographyColors {
  D10: string;
  D30: string;
  L30: string;
  L20: string;
  lightText: string;
  darkText: string;
}

export interface Typography {
  searchLabel: TextStyle;
  smallLabel: TextStyle;
  small: TextStyle;
  tiny: TextStyle;
  menuText: TextStyle;
  large: TextStyle;
  header: TextStyle;
  button: TextStyle;
  subHeaderText: TextStyle;
  text: TextStyle;
  regular: TextStyle;
  bold: TextStyle;
  boldItalic: TextStyle;
  italic: TextStyle;
  gameFont: TextStyle;
  mediumGameFont: TextStyle;
  bigGameFont: TextStyle;
  dialogLabel: TextStyle;
  left: TextStyle;
  right: TextStyle;
  center: TextStyle;
  strike: TextStyle;
  underline: TextStyle;
  uppercase: TextStyle;
  white: TextStyle;
  error: TextStyle;
  dark: TextStyle;
  light: TextStyle;
  inverted: TextStyle;
}

export default function(fontScale: number, colors: TypographyColors, gameFont: string): Typography {
  return StyleSheet.create({
    searchLabel: {
      fontFamily: 'Alegreya-Regular',
      fontSize: 16 * fontScale,
      lineHeight: 20 * fontScale,
      color: colors.L20,
    },
    smallLabel: {
      fontFamily: 'Alegreya-Regular',
      fontSize: 14 * fontScale,
      lineHeight: 18 * fontScale,
      letterSpacing: 0.3,
      color: colors.lightText,
    },
    small: {
      fontFamily: 'Alegreya-Regular',
      fontSize: 16 * fontScale,
      lineHeight: 18 * fontScale,
      color: colors.darkText,
    },
    tiny: {
      fontFamily: 'Alegreya-Regular',
      fontSize: 12 * fontScale,
      lineHeight: 14 * fontScale,
      color: colors.darkText,
    },
    large: {
      fontFamily: 'Alegreya-Medium',
      fontSize: 20 * fontScale,
      lineHeight: 24 * fontScale,
      color: colors.darkText,
    },
    header: {
      fontFamily: 'Alegreya-Bold',
      fontSize: 24 * fontScale,
      lineHeight: 32 * fontScale,
      color: colors.darkText,
    },
    button: {
      fontFamily: 'Alegreya-Regular',
      fontSize: 18 * fontScale,
      lineHeight: 20 * fontScale,
      color: colors.L30,
    },
    subHeaderText: {
      fontFamily: 'Alegreya-Medium',
      // fontVariant: ['small-caps'],
      fontSize: 18 * fontScale,
      lineHeight: 22 * fontScale,
      color: colors.D10,
    },
    menuText: {
      fontFamily: 'Alegreya-Medium',
      fontSize: 18 * fontScale,
      lineHeight: 20 * fontScale,
      color: colors.D30,
    },
    text: {
      fontFamily: 'Alegreya-Regular',
      fontSize: 18 * fontScale,
      lineHeight: 22 * fontScale,
      color: colors.darkText,
    },
    regular: {
      fontFamily: 'Alegreya-Regular',
      fontWeight: '400',
    },
    bold: {
      fontFamily: 'Alegreya-Bold',
      fontWeight: '700',
      color: colors.darkText,
    },
    boldItalic: {
      fontFamily: 'Alegreya-ExtraBoldItalic',
      fontWeight: '700',
      color: colors.darkText,
    },
    italic: {
      fontFamily: 'Alegreya-Italic',
    },
    gameFont: {
      fontFamily: gameFont,
      fontSize: 18 * fontScale,
      lineHeight: 26 * fontScale,
      color: colors.darkText,
    },
    mediumGameFont: {
      fontFamily: gameFont,
      fontSize: 24 * fontScale,
      lineHeight: 30 * fontScale,
      color: colors.darkText,
    },
    bigGameFont: {
      fontFamily: gameFont,
      fontSize: 28 * fontScale,
      lineHeight: 36 * fontScale,
      color: colors.darkText,
    },
    dialogLabel: Platform.select({
      ios: {
        fontSize: 13 * fontScale,
        color: colors.darkText,
      },
      android: {
        fontSize: 16 * fontScale,
        color: colors.darkText,
      },
    }) as TextStyle,
    left: {
      textAlign: 'left',
    },
    right: {
      textAlign: 'right',
    },
    center: {
      textAlign: 'center',
    },
    strike: {
      textDecorationLine: 'line-through',
    },
    underline: {
      textDecorationLine: 'underline',
    },
    uppercase: {
      textTransform: 'uppercase',
    },
    inverted: {
      color: colors.L30,
    },
    white: {
      color: COLORS.white,
    },
    error: {
      color: COLORS.red,
    },
    dark: {
      color: colors.darkText,
    },
    light: {
      color: colors.lightText,
    },
  });
}
