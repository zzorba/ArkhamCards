import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { isBig } from '@styles/space';
const NOTCH_BOTTOM_PADDING = DeviceInfo.hasNotch() ? 20 : 0;

export const FOOTER_HEIGHT = (64 * (isBig ? 1.2 : 1)) + NOTCH_BOTTOM_PADDING;

export const LOW_MEMORY_DEVICE = (
  Platform.OS === 'android' &&
  parseInt(DeviceInfo.getSystemVersion().split('.')[0], 10) < 9
);

export function isAndroidVersion(version: number) {
  return Platform.OS === 'android' && parseInt(DeviceInfo.getSystemVersion().split(',')[0], 10) >= version;
}
