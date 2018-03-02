import { Navigation } from 'react-native-navigation';
import React, { Component } from 'react';
import { Provider } from 'react-redux';

import Home from './components/Home'
import ArkhamIcon from './assets/ArkhamIcon';

export default class App {
  constructor() {
    this.populateIcons()
      .then((iconMap) => this.startApp(iconMap))
      .catch(error => console.log(error));
  }

  populateIcons() {
    return new Promise(function (resolve, reject) {
      Promise.all(
        [
          ArkhamIcon.getImageSource('eldersign', 30),
          ArkhamIcon.getImageSource('tentacles', 30),
        ]
      ).then((values) => {
        resolve({
          elderSignIcon: values[0],
          tentaclesIcon: values[1],
        });
      }).catch((error) => {
        console.log(error);
        reject(error);
      }).done();
    });
  }

  startApp(icons) {
    console.log(icons);
    Navigation.startTabBasedApp({
      tabs: [
        {
          label: 'Home',
          screen: 'Home', // this is a registered name for a screen
          title: 'Home',
          icon: icons.elderSignIcon,
        },
        {
          label: 'Settings',
          screen: 'Settings',
          title: 'Settings',
          icon: icons.tentaclesIcon,
        }
      ]
    });
  }
}
