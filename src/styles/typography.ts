import { ColorValue, Platform, StyleSheet, TextStyle } from 'react-native';

import COLORS from './colors';

export interface TypographyColors {
  D10: ColorValue;
  D30: ColorValue;
  L30: ColorValue;
  L20: ColorValue;
  L10: ColorValue;
  lightText: ColorValue;
  darkText: ColorValue;
}

export interface Typography {
  cursive: TextStyle;
  searchLabel: TextStyle;
  smallLabel: TextStyle;
  smallButtonLabel: TextStyle;
  small: TextStyle;
  tiny: TextStyle;
  menuText: TextStyle;
  cardName: TextStyle;
  cardTraits: TextStyle;
  counter: TextStyle;
  large: TextStyle;
  header: TextStyle;
  button: TextStyle;
  subHeaderText: TextStyle;
  text: TextStyle;
  regular: TextStyle;
  bold: TextStyle;
  boldItalic: TextStyle;
  italic: TextStyle;
  simpleTitleFont: TextStyle;
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
  black: TextStyle;
  white: TextStyle;
  error: TextStyle;
  dark: TextStyle;
  light: TextStyle;
  inverted: TextStyle;
  invertedLight: TextStyle,
}

const ITALIC_FONT_STYLE = Platform.OS === 'ios' ? 'italic' : undefined;
export default function(
  fontScale: number,
  colors: TypographyColors,
  italicFont: string,
  boldItalicFont: string,
  gameFont: string,
  lang: string
): Typography {
  return StyleSheet.create({
    cursive: {
      fontFamily: 'Caveat',
      fontSize: Math.ceil(22 * fontScale),
      lineHeight: Math.ceil(24 * fontScale),
      color: colors.D30,
    },
    searchLabel: {
      fontFamily: 'Alegreya-Regular',
      fontSize: Math.ceil(16 * fontScale),
      lineHeight: Math.ceil(20 * fontScale),
      color: colors.L20,
    },
    smallLabel: {
      fontFamily: 'Alegreya-Regular',
      fontSize: Math.ceil(14 * fontScale),
      lineHeight: Math.ceil(18 * fontScale),
      letterSpacing: 0.3,
      color: colors.lightText,
    },
    smallButtonLabel: {
      fontFamily: italicFont,
      fontStyle: ITALIC_FONT_STYLE,
      fontSize: Math.ceil(14 * fontScale),
      lineHeight: Math.ceil((lang === 'zh' ? 17 : 16) * fontScale),
      letterSpacing: 0.3,
      color: colors.lightText,
    },
    small: {
      fontFamily: 'Alegreya-Regular',
      fontSize: Math.ceil(16 * fontScale),
      lineHeight: Math.ceil(18 * fontScale),
      color: colors.darkText,
    },
    cardTraits: {
      fontFamily: italicFont,
      fontStyle: ITALIC_FONT_STYLE,
      fontSize: Math.ceil(16 * fontScale),
      lineHeight: Math.ceil(18 * fontScale),
      color: colors.lightText,
      includeFontPadding: false,
    },
    tiny: {
      fontFamily: 'Alegreya-Regular',
      fontSize: Math.ceil(12 * fontScale),
      lineHeight: Math.ceil((lang === 'zh' ? 16 : 14) * fontScale),
      color: colors.darkText,
    },
    cardName: {
      fontFamily: 'Alegreya-Medium',
      fontSize: Math.ceil(20 * fontScale),
      lineHeight: Math.ceil((lang === 'zh' ? 24 : 22) * fontScale),
      color: colors.darkText,
      textAlignVertical: 'center',
    },
    large: {
      fontFamily: 'Alegreya-Medium',
      fontSize: Math.ceil(18 * fontScale),
      lineHeight: Math.ceil((lang === 'zh' ? 22 : 20) * fontScale),
      color: colors.darkText,
    },
    counter: {
      fontFamily: 'Alegreya-Medium',
      fontSize: Math.ceil(24 * fontScale),
      lineHeight: Math.ceil((lang === 'zh' ? 28 : 26) * fontScale),
      color: colors.D10,
    },
    header: {
      fontFamily: 'Alegreya-Medium',
      fontSize: Math.ceil(22 * fontScale),
      lineHeight: Math.ceil((lang === 'zh' ? 26 : 24) * fontScale),
      color: colors.darkText,
    },
    button: {
      fontFamily: 'Alegreya-Regular',
      fontSize: Math.ceil(18 * fontScale),
      lineHeight: Math.ceil((lang === 'zh' ? 22 : 20) * fontScale),
      color: colors.L30,
    },
    subHeaderText: {
      fontFamily: 'Alegreya-Medium',
      // fontVariant: ['small-caps'],
      fontSize: Math.ceil(18 * fontScale),
      lineHeight: Math.ceil(22 * fontScale),
      color: colors.D10,
    },
    menuText: {
      fontFamily: 'Alegreya-Medium',
      fontSize: Math.ceil(18 * fontScale),
      lineHeight: Math.ceil(20 * fontScale),
      color: colors.D30,
    },
    text: {
      fontFamily: 'Alegreya-Regular',
      fontSize: Math.ceil(18 * fontScale),
      lineHeight: Math.ceil(22 * fontScale),
      color: colors.darkText,
    },
    regular: {
      fontFamily: 'Alegreya-Regular',
      fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    },
    bold: {
      fontFamily: 'Alegreya-Bold',
      fontWeight: Platform.OS === 'ios' ? '700' : undefined,
      color: colors.darkText,
    },
    boldItalic: {
      fontFamily: boldItalicFont,
      fontStyle: ITALIC_FONT_STYLE,
      fontWeight: Platform.OS === 'ios' ? '700' : undefined,
      color: colors.darkText,
    },
    italic: {
      fontFamily: italicFont,
      fontStyle: ITALIC_FONT_STYLE,
    },
    gameFont: {
      fontFamily: gameFont,
      fontSize: Math.ceil(18 * fontScale),
      lineHeight: Math.ceil(26 * fontScale),
      color: colors.darkText,
    },
    mediumGameFont: {
      fontFamily: gameFont,
      fontSize: Math.ceil(24 * fontScale),
      lineHeight: Math.ceil(30 * fontScale),
      color: colors.darkText,
    },
    simpleTitleFont: {
      fontFamily: 'Alegreya-Medium',
      fontSize: Math.ceil(28 * fontScale),
      lineHeight: Math.ceil(36 * fontScale),
      color: colors.darkText,
    },
    bigGameFont: {
      fontFamily: gameFont,
      fontSize: Math.ceil(28 * fontScale),
      lineHeight: Math.ceil(36 * fontScale),
      color: colors.darkText,
    },
    dialogLabel: Platform.select({
      ios: {
        fontSize: Math.ceil(13 * fontScale),
        color: colors.darkText,
      },
      android: {
        fontSize: Math.ceil(16 * fontScale),
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
    invertedLight: {
      color: colors.L10,
    },
    white: {
      color: COLORS.white,
    },
    black: {
      color: COLORS.black,
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
