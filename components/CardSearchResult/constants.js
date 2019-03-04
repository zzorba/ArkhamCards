import DeviceInfo from 'react-native-device-info';

import { isBig } from '../../styles/space';
import { TINY_PHONE } from '../../styles/sizes';

export const HALF_FONT_SCALE = (DeviceInfo.getFontScale() - 1) / 2 + 1;
export const ROW_HEIGHT = (isBig ? 72 : 48) * DeviceInfo.getFontScale();
export const ICON_SIZE = (isBig ? 44 : 28) * HALF_FONT_SCALE;
export const BUTTON_PADDING = 12;
export const BUTTON_WIDTH = 18 * DeviceInfo.getFontScale() + 22;
export const TOGGLE_BUTTON_MODE = TINY_PHONE || DeviceInfo.getFontScale() > 1.5;

export default {
  ROW_HEIGHT,
  ICON_SIZE,
  BUTTON_WIDTH,
  BUTTON_PADDING,
  TOGGLE_BUTTON_MODE,
};
