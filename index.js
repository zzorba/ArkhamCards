import React from 'react';
import { AppRegistry } from 'react-native';
import * as Sentry from '@sentry/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistCache } from 'apollo-cache-persist';
import database from '@react-native-firebase/database';
import 'react-native-sqlite-storage';
import 'react-native-gesture-handler';
import 'react-native-console-time-polyfill';
import 'reflect-metadata';

import { store, persistor } from './src/app/store';
import MyProvider from './src/app/MyProvider';
import createApolloClient from './src/data/apollo/createApolloClient';
import TrackPlayer from 'react-native-track-player';
import AppNavigator from './src/navigation/AppNavigator';

Sentry.init({
  dsn: 'https://fdad4da29224c7fd11ee224a94b1ba0c@o4509060598530048.ingest.us.sentry.io/4509060599316480',
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

function App() {
  const storeProps = { redux: store, persistor: persistor, apollo: apolloClient, anonApollo: anonClient };

  return (
    <AppNavigator store={storeProps} />
  );
}

AppRegistry.registerComponent('arkhamcards', () => App);