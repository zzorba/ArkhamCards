import { Platform, StyleSheet } from 'react-native';

export const isBig = (Platform.OS === 'ios' && Platform.isPad);
const sizeScale = isBig ? 2 : 1;

export const xs = 4 * sizeScale;
export const s = 8 * sizeScale;
export const m = 16 * sizeScale;
export const l = 32 * sizeScale;

export const l = 32;
export const m = 16;
export const s = 8;

export default StyleSheet.create({
  marginLeftS: {
    marginLeft: s,
  },
  marginLeftM: {
    marginLeft: m,
  },
  marginLeftL: {
    marginLeft: l,
  },
  paddingLeftS: {
    paddingLeft: s,
  },
  paddingLeftM: {
    paddingLeft: m,
  },
  paddingLeftL: {
    paddingLeft: l,
  },
  marginBottomS: {
    marginBottom: s,
  },
  marginBottomM: {
    marginBottom: m,
  },
  marginBottomL: {
    marginBottom: l,
  },
});
