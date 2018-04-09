import { forEach, keys } from 'lodash';

import ArkhamIcon from '../assets/ArkhamIcon';
import AppIcon from '../assets/AppIcon';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

// define your suffixes by yourself..
// here we use active, big, small, very-big..
const icons = {
  elder_sign: [30, '#bbb', ArkhamIcon],
  intellect: [26, '#bbb', ArkhamIcon],
  per_investigator: [24, '#bbb', ArkhamIcon],
  edit: [26, '#bbb'],
  tune: [28, '#bbb'],
  arrow_back: [30, '#bbb'],
  'sort-by-alpha': [28, '#bbb'],
  add: [28, '#bbb'],
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
