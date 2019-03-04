import {
  DeviceInfo as ReactNativeDeviceInfo,
} from 'react-native';

const NOTCH_BOTTOM_PADDING = ReactNativeDeviceInfo.isIPhoneX_deprecated ? 20 : 0;

export const FOOTER_HEIGHT = 64 + NOTCH_BOTTOM_PADDING;
