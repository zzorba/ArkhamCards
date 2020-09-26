import { Platform, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const isTablet = (Platform.OS === 'ios' && DeviceInfo.isTablet());
export const isBig = false;
export const sizeScale = isTablet ? 1.5 : 1;
export const iconSizeScale = 1;

export const xs = 4 * sizeScale;
export const s = 8 * sizeScale;
export const m = 16 * sizeScale;
export const l = 32 * sizeScale;

export default StyleSheet.create({
  button: {
    padding: s,
  },
  paddingRightXs: {
    paddingRight: xs,
  },
  paddingSideXs: {
    paddingLeft: xs,
    paddingRight: xs,
  },
  paddingSideS: {
    paddingLeft: s,
    paddingRight: s,
  },
  paddingSideM: {
    paddingLeft: m,
    paddingRight: m,
  },
  paddingXs: {
    padding: xs,
  },
  paddingS: {
    padding: s,
  },
  paddingTopM: {
    paddingTop: m,
  },
  paddingBottomM: {
    paddingBottom: m,
  },
  paddingTopL: {
    paddingTop: l,
  },
  marginSideL: {
    marginLeft: l,
    marginRight: l,
  },
  marginTopXs: {
    marginTop: xs,
  },
  paddingM: {
    padding: m,
  },
  marginRightXs: {
    marginRight: xs,
  },
  paddingBottomS: {
    paddingBottom: s,
  },
  marginBottomXs: {
    marginBottom: xs,
  },
  marginSideM: {
    marginLeft: m,
    marginRight: m,
  },
  paddingSideL: {
    paddingLeft: l,
    paddingRight: l,
  },
  marginS: {
    margin: s,
  },
  marginSideXs: {
    marginLeft: xs,
    marginRight: xs,
  },
  marginSideS: {
    marginLeft: s,
    marginRight: s,
  },
  marginTopM: {
    marginTop: m,
  },
  marginTopS: {
    marginTop: s,
  },
  marginLeftXs: {
    marginLeft: xs,
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
  marginRightM: {
    marginRight: m,
  },
  paddingLeftS: {
    paddingLeft: s,
  },
  paddingRightS: {
    paddingRight: s,
  },
  paddingLeftM: {
    paddingLeft: m,
  },
  paddingRightM: {
    paddingRight: m,
  },
  paddingTopS: {
    paddingTop: s,
  },
  paddingTopXs: {
    paddingTop: xs,
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
  marginRightS: {
    marginRight: s,
  },
  paddingBottomL: {
    paddingBottom: l,
  },
});
