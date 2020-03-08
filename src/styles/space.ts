import { Platform, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const isBig = (Platform.OS === 'ios' && DeviceInfo.isTablet());
export const sizeScale = isBig ? 1.5 : 1;
export const iconSizeScale = isBig ? 1.4 : 1;

export const xs = 4 * sizeScale;
export const s = 8 * sizeScale;
export const m = 16 * sizeScale;
export const l = 32 * sizeScale;

export default StyleSheet.create({
  marginTopM: {
    marginTop: m,
  },
  marginTopS: {
    marginTop: s,
  },
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
