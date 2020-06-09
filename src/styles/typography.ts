import { Platform, StyleSheet, TextStyle } from 'react-native';

import { isBig, m, s } from './space';
import COLORS from './colors';
const sizeScale = 1;

export const SMALL_FONT_SIZE = 12 * sizeScale;

export default StyleSheet.create({
  header: {
    fontFamily: 'System',
    fontSize: 24 * sizeScale,
    lineHeight: 32 * sizeScale,
    fontWeight: '600',
    color: COLORS.darkTextColor,
  },
  cardText: {
    fontFamily: 'System',
    fontSize: isBig ? 18 : 14,
    lineHeight: isBig ? 22 : 18,
  },
  text: {
    fontFamily: 'System',
    fontSize: 18 * sizeScale,
    lineHeight: 22 * sizeScale,
    color: COLORS.darkTextColor,
  },
  small: {
    fontFamily: 'System',
    fontSize: SMALL_FONT_SIZE,
    lineHeight: 18 * sizeScale,
    color: COLORS.darkTextColor,
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
    color: '#444',
  },
  label: {
    fontFamily: 'System',
    fontSize: 16 * sizeScale,
    marginRight: 8 * sizeScale,
    color: COLORS.darkTextColor,
  },
  bigLabel: {
    fontFamily: 'System',
    fontSize: 22 * sizeScale,
    lineHeight: 28 * sizeScale,
    color: COLORS.darkTextColor,
  },
  bold: {
    fontWeight: '700',
    color: COLORS.darkTextColor,
  },
  gameFont: {
    fontFamily: 'Teutonic',
    fontSize: 18 * sizeScale,
    lineHeight: 26 * sizeScale,
    color: COLORS.darkTextColor,
  },
  mediumGameFont: {
    fontFamily: 'Teutonic',
    fontSize: 24 * sizeScale,
    lineHeight: 30 * sizeScale,
    color: COLORS.darkTextColor,
  },
  bigGameFont: {
    fontFamily: 'Teutonic',
    fontSize: 28 * sizeScale,
    lineHeight: 36 * sizeScale,
    color: COLORS.darkTextColor,
  },
  dialogLabel: Platform.select({
    ios: {
      fontSize: 13 * sizeScale,
      color: 'black',
    },
    android: {
      fontSize: 16 * sizeScale,
      color: '#33383D',
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
    color: COLORS.darkGray,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
});
