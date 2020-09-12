import { Animated } from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';

import arkhamIconConfig from '../../assets/arkhamicons-config.json';

/* eslint-disable no-undef */
const ArkhamIcon = createIconSetFromIcoMoon(arkhamIconConfig);

export default ArkhamIcon;

export const AnimatedArkhamIcon = Animated.createAnimatedComponent(ArkhamIcon);
