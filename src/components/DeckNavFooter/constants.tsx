import DeviceInfo from 'react-native-device-info';

import { isBig } from 'styles/space';
const NOTCH_BOTTOM_PADDING = DeviceInfo.hasNotch() ? 20 : 0;

export const FOOTER_HEIGHT = (64 * (isBig ? 1.2 : 1)) + NOTCH_BOTTOM_PADDING;
