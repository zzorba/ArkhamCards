import DeviceInfo from 'react-native-device-info';

const NOTCH_BOTTOM_PADDING = DeviceInfo.hasNotch() ? 20 : 0;

export const FOOTER_HEIGHT = 64 + NOTCH_BOTTOM_PADDING;
