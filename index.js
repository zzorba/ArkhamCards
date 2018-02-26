import { AppRegistry } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import { registerScreens } from './app/screens';
import store from './app/store';

registerScreens(store, Provider);

Navigation.startTabBasedApp({
  tabs: [
    {
      label: 'Home',
      screen: 'Home', // this is a registered name for a screen
      title: 'Home',
      icon: require('./img/home.png'),
    },
    {
      label: 'Settings',
      screen: 'Settings',
      title: 'Settings',
      icon: require('./img/home.png'),
    }
  ]
});
