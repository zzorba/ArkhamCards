import { forEach, keys, map } from 'lodash';
import { Platform } from 'react-native';

import AppIcon from '@icons/AppIcon';
import ArkhamIcon from '@icons/ArkhamIcon';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '@styles/colors';
import { Icon } from 'react-native-vector-icons/Icon';

const icons: {
  [iconName: string]: [number, string, typeof Icon];
} = {
  elder_sign: [30, COLORS.M, ArkhamIcon],
  intellect: [26, COLORS.M, ArkhamIcon],
  per_investigator: [24, COLORS.M, ArkhamIcon],
  auto_fail: [24, COLORS.M, ArkhamIcon],
  cultist: [24, COLORS.M, ArkhamIcon],
  edit: [Platform.OS === 'android' ? 30 : 32, COLORS.M, AppIcon],
  tune: [32, COLORS.M, AppIcon],
  dismiss: [32, COLORS.M, AppIcon],
  undo: [32, COLORS.M, AppIcon],
  'arrow-up-bold': [26, COLORS.M, MaterialCommunityIcons],
  'arrow-left': [30, COLORS.M, MaterialCommunityIcons],
  'chevron-left': [40, COLORS.M, MaterialCommunityIcons],
  'chevron-right': [40, COLORS.M, MaterialCommunityIcons],
  filter: [30, COLORS.M, AppIcon],
  sort: [30, COLORS.M, AppIcon],
  'arrow-back': [24, '#000', MaterialIcons],
  menu: [32, COLORS.M, AppIcon],
  'plus-button': [32, COLORS.M, AppIcon],
  deck: [32, COLORS.M, AppIcon],
  wild: [28, COLORS.M, ArkhamIcon],
  flip_card: [32, COLORS.M, AppIcon],
  share: [32, COLORS.M, AppIcon],
  world: [32, COLORS.M, AppIcon],
  book: [28, COLORS.M, AppIcon],
  log: [28, COLORS.M, AppIcon],
  cards: [28, COLORS.M, AppIcon],
  settings: [28, COLORS.M, AppIcon],
  chaos_bag: [28, COLORS.M, AppIcon],
};

const iconsMap: {
  [key: string]: number;
} = {};

const iconsLoaded = new Promise((resolve) => {
  Promise.all(
    map(icons, ([size, color, Provider], iconName) => {
      return Provider.getImageSource(iconName, size, color);
    })
  ).then(sources => {
    forEach(keys(icons), (iconName, idx) => {
      iconsMap[iconName] = sources[idx];
    });

    // Call resolve (and we are done)
    resolve(true);
  });
});

export {
  iconsMap,
  iconsLoaded,
};
