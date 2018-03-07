import { Provider } from 'react-redux';
import { registerScreens } from './app/screens';
import configureStore from './app/store';
import App from './App';

const { store /* , persistor */ } = configureStore({});
registerScreens(store, Provider);

/* eslint-disable no-unused-vars */
const app = new App();
