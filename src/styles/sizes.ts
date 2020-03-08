import {
  Dimensions,
  Platform,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const TINY_PHONE = (Platform.OS === 'ios' && Dimensions.get('window').width < 375);
export const CARD_RATIO = 7.0 / 5.0;

export const NOTCH_BOTTOM_PADDING = DeviceInfo.hasNotch() ? 20 : 0;
export const HEADER_HEIGHT = Platform.OS === 'ios' ? 64 : 80;
export const TABBAR_HEIGHT = (Platform.OS === 'ios' ? 64 : 80) + NOTCH_BOTTOM_PADDING;
