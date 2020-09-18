import { Platform, StyleSheet, TextStyle } from 'react-native';

import { isBig, m, s } from './space';
import COLORS from './colors';
const sizeScale = 1;

export const SMALL_FONT_SIZE = 14 * sizeScale;

export default StyleSheet.create({
  header: {
    fontFamily: 'System',
    fontSize: 24 * sizeScale,
    lineHeight: 32 * sizeScale,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  cardText: {
    fontFamily: 'System',
    fontSize: isBig ? 18 : 14,
    lineHeight: isBig ? 22 : 18,
    color: COLORS.darkText,
  },
  searchLabel: {
    fontFamily: 'Alegreya-Regular',
    fontSize: 16 * sizeScale,
    lineHeight: 20 * sizeScale,
    color: COLORS.L20,
  },
  cardName: {
    fontFamily: 'Alegreya-Medium',
    fontSize: 20 * sizeScale,
    lineHeight: 24 * sizeScale,
    color: COLORS.darkText,
  },
  cardSubName: {
    fontFamily: 'Alegreya-Italic',
    fontSize: 14 * sizeScale,
    lineHeight: 18 * sizeScale,
    color: COLORS.lightText,
  },
  cardNumber: {
    fontFamily: 'Alegreya-Regular',
    fontSize: 14 * sizeScale,
    lineHeight: 14 * sizeScale,
    color: COLORS.darkText,
  },
  cardSmall: {
    fontFamily: 'Alegreya-Regular',
    fontSize: 10 * sizeScale,
    lineHeight: 14 * sizeScale,
    color: COLORS.darkText,
  },
  cardButton: {
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
  small: {
    fontFamily: 'Alegreya-Regular',
    fontSize: SMALL_FONT_SIZE,
    lineHeight: 18 * sizeScale,
    color: COLORS.darkText,
  },
  italic: {
    fontWeight: '300',
    fontStyle: 'italic',
  },
  smallLabel: {
    fontFamily: 'System',
    fontSize: 12 * sizeScale,
    lineHeight: 18 * sizeScale,
    letterSpacing: 0.3,
    color: COLORS.lightText,
  },
  categoryHeader: {
    fontFamily: 'System',
    fontSize: 12 * sizeScale,
    lineHeight: 18 * sizeScale,
    letterSpacing: 0.3,
    color: COLORS.darkText,
  },
  label: {
    fontFamily: 'System',
    fontSize: 16 * sizeScale,
    marginRight: 8 * sizeScale,
    color: COLORS.darkText,
  },
  bigLabel: {
    fontFamily: 'System',
    fontSize: 22 * sizeScale,
    lineHeight: 28 * sizeScale,
    color: COLORS.darkText,
  },
  bold: {
    fontWeight: '700',
    color: COLORS.darkText,
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
  strike: {
    textDecorationLine: 'line-through',
  },
  center: {
    textAlign: 'center',
  },
  error: {
    color: COLORS.red,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  settingsLabel: {
    flex: 1,
    paddingLeft: m,
    paddingRight: s,
    fontSize: 16,
  },
  settingsValue: {
    color: COLORS.darkGray,
    fontSize: 14,
    flex: 0,
    paddingLeft: s,
    paddingRight: m,
  },
  darkGray: {
    color: COLORS.lightText,
  },
  white: {
    color: COLORS.white,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  black: {
    color: COLORS.darkText,
  },
});
