import { Platform, StyleSheet, TextStyle } from 'react-native';

import COLORS from './colors';
const sizeScale = 1;

export interface TypographyColors {
  D10: string;
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
}

export default function(colors: TypographyColors, gameFont: string): Typography {
  return StyleSheet.create({
    searchLabel: {
      fontFamily: 'Alegreya-Regular',
      fontSize: 16 * sizeScale,
      lineHeight: 20 * sizeScale,
      color: colors.L20,
    },
    smallLabel: {
      fontFamily: 'Alegreya-Regular',
      fontSize: 14 * sizeScale,
      lineHeight: 18 * sizeScale,
      letterSpacing: 0.3,
      color: colors.lightText,
    },
    small: {
      fontFamily: 'Alegreya-Regular',
      fontSize: 14 * sizeScale,
      lineHeight: 18 * sizeScale,
      color: colors.darkText,
    },
    tiny: {
      fontFamily: 'Alegreya-Regular',
      fontSize: 12 * sizeScale,
      lineHeight: 14 * sizeScale,
      color: colors.darkText,
    },
    large: {
      fontFamily: 'Alegreya-Medium',
      fontSize: 20 * sizeScale,
      lineHeight: 24 * sizeScale,
      color: colors.darkText,
    },
    header: {
      fontFamily: 'Alegreya-Bold',
      fontSize: 24 * sizeScale,
      lineHeight: 32 * sizeScale,
      color: colors.darkText,
    },
    button: {
      fontFamily: 'Alegreya-Regular',
      fontSize: 18 * sizeScale,
      lineHeight: 22 * sizeScale,
      color: colors.L30,
    },
    subHeaderText: {
      fontFamily: 'Alegreya-Medium',
      // fontVariant: ['small-caps'],
      fontSize: 18 * sizeScale,
      lineHeight: 22 * sizeScale,
      color: colors.D10,
    },
    text: {
      fontFamily: 'Alegreya-Regular',
      fontSize: 18 * sizeScale,
      lineHeight: 22 * sizeScale,
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
      fontSize: 18 * sizeScale,
      lineHeight: 26 * sizeScale,
      color: colors.darkText,
    },
    mediumGameFont: {
      fontFamily: gameFont,
      fontSize: 24 * sizeScale,
      lineHeight: 30 * sizeScale,
      color: colors.darkText,
    },
    bigGameFont: {
      fontFamily: gameFont,
      fontSize: 28 * sizeScale,
      lineHeight: 36 * sizeScale,
      color: colors.darkText,
    },
    dialogLabel: Platform.select({
      ios: {
        fontSize: 13 * sizeScale,
        color: colors.darkText,
      },
      android: {
        fontSize: 16 * sizeScale,
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
