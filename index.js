import React from 'react';
import { Platform } from 'react-native';
import { registerRootComponent } from 'expo';
import crashlytics from '@react-native-firebase/crashlytics';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistCache } from 'apollo-cache-persist';
import { getApps, initializeApp } from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-gesture-handler';
import 'react-native-console-time-polyfill';
import 'reflect-metadata';

globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

import { store, persistor } from './src/application/store';
import createApolloClient from './src/data/apollo/createApolloClient';
import AppNavigator from './src/navigation/AppNavigator';

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

// Enable Crashlytics collection (enabled by default, but explicitly set for clarity)
crashlytics().setCrashlyticsCollectionEnabled(true);

// Initialize Firebase if not already initialized
console.log('Firebase apps before init:', getApps().length);
if (!getApps().length) {
  console.log('Calling initializeApp()');
  initializeApp({
    apiKey: 'AIzaSyDb3uTSlVozaog4jNJB3_1wlESBF80sCX0',
    appId: '1:375702423113:ios:ddc3bfe55bd62d38eda198',
    messagingSenderId: '375702423113',
    projectId: 'arkhamblob',
    storageBucket: 'arkhamblob.appspot.com',
    databaseURL: 'https://arkhamblob.firebaseio.com',
  });
  console.log('initializeApp() completed');
}
console.log('Firebase apps after init:', getApps().length);

// database().setPersistenceEnabled(true);

const [apolloClient, anonClient] = createApolloClient(store);

persistCache({
  cache: apolloClient.cache,
  storage: AsyncStorage,
});


function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        // Enable edge-to-edge on Android
        // You can add any additional loading logic here
        // For now, we'll just mark it as ready
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to ensure everything is initialized
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  const storeProps = { redux: store, persistor: persistor, apollo: apolloClient, anonApollo: anonClient };

  return (
    <AppNavigator store={storeProps} />
  );
}
database().setPersistenceEnabled(true);

registerRootComponent(App);