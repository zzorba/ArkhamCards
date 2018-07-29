import {
  DeviceInfo,
} from 'react-native';

export const CARD_RATIO = 7.0 / 5.0;

export const NOTCH_BOTTOM_PADDING = DeviceInfo.isIPhoneX_deprecated ? 20 : 0;
export const HEADER_HEIGHT = 64;
export const TABBAR_HEIGHT = 64 + NOTCH_BOTTOM_PADDING;
