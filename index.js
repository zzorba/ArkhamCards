import * as Sentry from '@sentry/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistCache } from 'apollo-cache-persist';
import { Navigation } from 'react-native-navigation';
import database from '@react-native-firebase/database';
import 'react-native-sqlite-storage';
import 'react-native-gesture-handler';
import 'react-native-console-time-polyfill';
import 'reflect-metadata';

import { registerScreens } from './src/app/screens';
import { store, persistor } from './src/app/store';
import App from './src/app/App';
import MyProvider from './src/app/MyProvider';
import createApolloClient from './src/data/apollo/createApolloClient';
import TrackPlayer from 'react-native-track-player';


Sentry.init({
  dsn: 'https://fdad4da29224c7fd11ee224a94b1ba0c@o4509060598530048.ingest.us.sentry.io/4509060599316480',
  integrations: [
    Sentry.reactNativeNavigationIntegration({
      navigation: Navigation,
      enableTabsInstrumentation: true,
    }),
  ],
  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

database().setPersistenceEnabled(true);

const [apolloClient, anonClient] = createApolloClient(store);

persistCache({
  cache: apolloClient.cache,
  storage: AsyncStorage,
});

TrackPlayer.registerPlaybackService(() => require('./src/lib/audio/audioService'));

/* eslint-disable @typescript-eslint/no-unused-vars */
let app = null;


Navigation.events().registerAppLaunchedListener(() => {
  // SQLite.enablePromise(true);
  registerScreens(MyProvider, { redux: store, persistor: persistor, apollo: apolloClient, anonApollo: anonClient });
  app = new App(store);
});

