import createIconSetFromIcoMoon from '@react-native-vector-icons/icomoon';
import Animated from 'react-native-reanimated';

import arkhamIconConfig from '../../assets/arkhamicons-config.json';

import arkhamSlimIconConfig from '../../assets/arkhamslim.json';

// Extract glyph map from IcoMoon config
// Replaces the removed getRawGlyphMap() function from react-native-vector-icons
function extractGlyphMap(config: any): Record<string, number> {
  const glyphMap: Record<string, number> = {};

  if (config.icons && Array.isArray(config.icons)) {
    config.icons.forEach((icon: any) => {
      if (icon.properties && icon.properties.name && icon.properties.code) {
        glyphMap[icon.properties.name] = icon.properties.code;
      }
    });
  }

  return glyphMap;
}

/* eslint-disable no-undef */
const ArkhamIcon = createIconSetFromIcoMoon(arkhamIconConfig);
export const ArkhamSlimIcon = createIconSetFromIcoMoon(arkhamSlimIconConfig);

// Export glyph maps for direct access to icon codes
export const arkhamIconGlyphs = extractGlyphMap(arkhamIconConfig);
export const arkhamSlimIconGlyphs = extractGlyphMap(arkhamSlimIconConfig);

export default ArkhamIcon;

export const AnimatedArkhamIcon = Animated.createAnimatedComponent(ArkhamIcon);
