import ArkhamIcon from '../assets/ArkhamIcon';
import AppIcon from '../assets/AppIcon';

// define your suffixes by yourself..
// here we use active, big, small, very-big..
const icons = {
  elder_sign: [30, '#bbb'],
  intellect: [26, '#bbb'],
  per_investigator: [24, '#bbb'],
  tune: [30, '#bbb', AppIcon],
  arrow_back: [30, '#bbb', AppIcon],
}

const defaultIconProvider = ArkhamIcon;

const iconsMap = {};
const iconsLoaded = new Promise((resolve, reject) => {
  new Promise.all(Object.keys(icons).map(iconName => {
    const Provider = icons[iconName][2] || defaultIconProvider;
    const size = icons[iconName][0];
    const color = icons[iconName][1];
    return Provider.getImageSource(iconName, size, color);
  })).then(sources => {
    Object.keys(icons)
      .forEach((iconName, idx) => iconsMap[iconName] = sources[idx])

    // Call resolve (and we are done)
    resolve(true);
  });
});

export {
  iconsMap,
  iconsLoaded
};
