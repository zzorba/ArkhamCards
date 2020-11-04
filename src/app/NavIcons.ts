import { ReactNode } from 'react';
import { forEach, keys } from 'lodash';

import AppIcon from '@icons/AppIcon';
import ArkhamIcon from '@icons/ArkhamIcon';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '@styles/colors';

// define your suffixes by yourself..
// here we use active, big, small, very-big..
const icons: {
  [iconName: string]: [number, string, ReactNode?];
} = {
  elder_sign: [30, COLORS.M, ArkhamIcon],
  intellect: [26, COLORS.M, ArkhamIcon],
  per_investigator: [24, COLORS.M, ArkhamIcon],
  auto_fail: [24, COLORS.M, ArkhamIcon],
  edit: [26, COLORS.M],
  tune: [28, COLORS.M, AppIcon],
  'content-copy': [28, COLORS.M, MaterialCommunityIcons],
  delete: [30, COLORS.M, MaterialCommunityIcons],
  close: [30, COLORS.M, MaterialCommunityIcons],
  replay: [30, COLORS.M, MaterialCommunityIcons],
  undo: [30, COLORS.M, MaterialCommunityIcons],
  'arrow-up-bold': [26, COLORS.M, MaterialCommunityIcons],
  'arrow-left': [30, COLORS.M, MaterialCommunityIcons],
  'chevron-left': [40, COLORS.M, MaterialCommunityIcons],
  'chevron-right': [40, COLORS.M, MaterialCommunityIcons],
  sort: [28, COLORS.M, AppIcon],
  'arrow-back': [24, '#000'],
  menu: [28, COLORS.M, MaterialCommunityIcons],
  cards: [30, COLORS.M, AppIcon],
  settings: [30, COLORS.M, AppIcon],
  add: [28, COLORS.M],
  deck: [28, COLORS.M, AppIcon],
  wild: [28, COLORS.M, ArkhamIcon],
  flip_card: [28, COLORS.M, AppIcon],
  book: [28, COLORS.M, AppIcon],
  share: [28, COLORS.M, AppIcon],
  web: [28, COLORS.M, MaterialCommunityIcons],
};

const defaultIconProvider = MaterialIcons;

const iconsMap: {
  [key: string]: number;
} = {};

const iconsLoaded = new Promise((resolve) => {
  Promise.all(Object.keys(icons).map(iconName => {
    const Provider = icons[iconName][2] || defaultIconProvider;
    const size = icons[iconName][0];
    const color = icons[iconName][1];
    return Provider.getImageSource(iconName, size, color);
  })).then(sources => {
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
