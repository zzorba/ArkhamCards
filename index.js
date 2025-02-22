import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistCache } from 'apollo-cache-persist';
import { Navigation } from 'react-native-navigation';
import Crashes from 'appcenter-crashes';
import database from '@react-native-firebase/database';
import 'react-native-sqlite-storage';
import 'react-native-gesture-handler';
import 'react-native-console-time-polyfill';
import 'reflect-metadata';

import { registerScreens } from './src/app/screens';
import { store, persistor } from './src/app/store';
import App from './src/app/App';
import MyProvider from './src/app/MyProvider';
import { ENABLE_ARKHAM_CARDS_ACCOUNT } from './src/app_constants';
import createApolloClient from './src/data/apollo/createApolloClient';
import TrackPlayer from 'react-native-track-player';


if (ENABLE_ARKHAM_CARDS_ACCOUNT) {
  database().setPersistenceEnabled(true);

}

const [apolloClient, anonClient] = createApolloClient(store);

persistCache({
  cache: apolloClient.cache,
  storage: AsyncStorage,
});

function shouldProcess() {
  return !__DEV__;
}
Crashes.setListener({
  shouldProcess,
});

TrackPlayer.registerPlaybackService(() => require('./src/lib/audio/audioService'));


/* eslint-disable @typescript-eslint/no-unused-vars */
let app = null;
Navigation.events().registerAppLaunchedListener(() => {
  // SQLite.enablePromise(true);
  registerScreens(MyProvider, { redux: store, persistor: persistor, apollo: apolloClient, anonApollo: anonClient });
  app = new App(store);
});

