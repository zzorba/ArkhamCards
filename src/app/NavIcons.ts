import { ReactNode } from 'react';
import { forEach, keys } from 'lodash';

import AppIcon from 'icons/AppIcon';
import ArkhamIcon from 'icons/ArkhamIcon';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { COLORS } from 'styles/colors';

// define your suffixes by yourself..
// here we use active, big, small, very-big..
const icons: {
  [iconName: string]: [number, string, ReactNode?];
} = {
  elder_sign: [30, COLORS.button, ArkhamIcon],
  intellect: [26, COLORS.button, ArkhamIcon],
  per_investigator: [24, COLORS.button, ArkhamIcon],
  auto_fail: [24, COLORS.button, ArkhamIcon],
  edit: [26, COLORS.button],
  tune: [28, COLORS.button],
  'content-copy': [28, COLORS.button, MaterialCommunityIcons],
  delete: [30, COLORS.button, MaterialCommunityIcons],
  close: [30, COLORS.button, MaterialCommunityIcons],
  replay: [30, COLORS.button, MaterialCommunityIcons],
  undo: [30, COLORS.button, MaterialCommunityIcons],
  'arrow-up-bold': [26, COLORS.button, MaterialCommunityIcons],
  'arrow-left': [30, COLORS.button, MaterialCommunityIcons],
  'chevron-left': [40, COLORS.button, MaterialCommunityIcons],
  'chevron-right': [40, COLORS.button, MaterialCommunityIcons],
  'sort-by-alpha': [28, COLORS.button],
  menu: [28, COLORS.button, MaterialCommunityIcons],
  cards: [28, COLORS.button, AppIcon],
  settings: [28, COLORS.button, MaterialCommunityIcons],
  add: [28, COLORS.button],
  deck: [28, COLORS.button, AppIcon],
  faq: [28, COLORS.button, AppIcon],
  flip_card: [28, COLORS.button, AppIcon],
  book: [26, COLORS.button, AppIcon],
  share: [28, COLORS.button, AppIcon],
  web: [28, COLORS.button, MaterialCommunityIcons],
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
