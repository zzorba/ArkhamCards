import { Platform, StyleSheet, TextStyle } from 'react-native';

import { isBig, m, s } from './space';
import COLORS from './colors';
const sizeScale = 1;

export default StyleSheet.create({
  searchLabel: {
    fontFamily: 'Alegreya-Regular',
    fontSize: 16 * sizeScale,
    lineHeight: 20 * sizeScale,
    color: COLORS.L20,
  },
  smallLabel: {
    fontFamily: 'Alegreya-Regular',
    fontSize: 14 * sizeScale,
    lineHeight: 18 * sizeScale,
    letterSpacing: 0.3,
    color: COLORS.lightText,
  },
  small: {
    fontFamily: 'Alegreya-Regular',
    fontSize: 14 * sizeScale,
    lineHeight: 18 * sizeScale,
    color: COLORS.darkText,
  },
  large: {
    fontFamily: 'Alegreya-Medium',
    fontSize: 20 * sizeScale,
    lineHeight: 24 * sizeScale,
    color: COLORS.darkText,
  },
  header: {
    fontFamily: 'Alegreya-Bold',
    fontSize: 24 * sizeScale,
    lineHeight: 32 * sizeScale,
    color: COLORS.darkText,
  },
  button: {
    fontFamily: 'Alegreya-Regular',
    fontSize: 18 * sizeScale,
    lineHeight: 22 * sizeScale,
    color: COLORS.L30,
  },
  subHeaderText: {
    fontFamily: 'Alegreya-Medium',
    // fontVariant: ['small-caps'],
    fontSize: 18 * sizeScale,
    lineHeight: 22 * sizeScale,
    color: COLORS.D10,
  },
  text: {
    fontFamily: 'Alegreya-Regular',
    fontSize: 18 * sizeScale,
    lineHeight: 22 * sizeScale,
    color: COLORS.darkText,
  },
  regular: {
    fontFamily: 'Alegreya-Regular',
    fontWeight: '400',
  },
  bold: {
    fontFamily: 'Alegreya-Bold',
    fontWeight: '700',
    color: COLORS.darkText,
  },
  boldItalic: {
    fontFamily: 'Alegreya-ExtraBoldItalic',
    fontWeight: '700',
    color: COLORS.darkText,
  },
  italic: {
    fontFamily: 'Alegreya-Italic',
  },
  gameFont: {
    fontFamily: 'Teutonic',
    fontSize: 18 * sizeScale,
    lineHeight: 26 * sizeScale,
    color: COLORS.darkText,
  },
  mediumGameFont: {
    fontFamily: 'Teutonic',
    fontSize: 24 * sizeScale,
    lineHeight: 30 * sizeScale,
    color: COLORS.darkText,
  },
  bigGameFont: {
    fontFamily: 'Teutonic',
    fontSize: 28 * sizeScale,
    lineHeight: 36 * sizeScale,
    color: COLORS.darkText,
  },
  dialogLabel: Platform.select({
    ios: {
      fontSize: 13 * sizeScale,
      color: COLORS.darkText,
    },
    android: {
      fontSize: 16 * sizeScale,
      color: COLORS.darkText,
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
    color: COLORS.darkText,
  },
  light: {
    color: COLORS.lightText,
  },
});
