import { forEach, keys } from 'lodash';

import ArkhamIcon from '../assets/ArkhamIcon';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';

// define your suffixes by yourself..
// here we use active, big, small, very-big..
const icons = {
  elder_sign: [30, COLORS.button, ArkhamIcon],
  intellect: [26, COLORS.button, ArkhamIcon],
  per_investigator: [24, COLORS.button, ArkhamIcon],
  deck: [28, COLORS.button, ArkhamIcon],
  edit: [26, COLORS.button],
  tune: [28, COLORS.button],
  delete: [30, COLORS.button, MaterialCommunityIcons],
  'arrow-left': [30, COLORS.button, MaterialCommunityIcons],
  'chevron-left': [30, COLORS.button, MaterialCommunityIcons],
  'sort-by-alpha': [28, COLORS.button],
  settings: [28, COLORS.button, MaterialCommunityIcons],
  add: [28, COLORS.button],
};

const defaultIconProvider = MaterialIcons;

const iconsMap = {};
const iconsLoaded = new Promise((resolve) => {
  new Promise.all(Object.keys(icons).map(iconName => {
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
