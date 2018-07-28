import {
  DeviceInfo,
} from 'react-native';
const NOTCH_BOTTOM_PADDING = DeviceInfo.isIPhoneX_deprecated ? 20 : 0;

export const FOOTER_HEIGHT = 64 + NOTCH_BOTTOM_PADDING;
