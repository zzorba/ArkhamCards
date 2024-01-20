import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import Animated from 'react-native-reanimated';

import arkhamIconConfig from '../../assets/arkhamicons-config.json';

import arkhamSlimIconConfig from '../../assets/arkhamslim.json';

/* eslint-disable no-undef */
const ArkhamIcon = createIconSetFromIcoMoon(arkhamIconConfig);
export const ArkhamSlimIcon = createIconSetFromIcoMoon(arkhamSlimIconConfig);

export default ArkhamIcon;

export const AnimatedArkhamIcon = Animated.createAnimatedComponent(ArkhamIcon);
