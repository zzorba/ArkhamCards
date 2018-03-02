import { Provider } from 'react-redux';
import { registerScreens } from './app/screens';
import configureStore from './app/store';
import App from './App';

import ArkhamIcon from './assets/ArkhamIcon';

const { store, persistor } = configureStore({});
registerScreens(store, Provider);

// Get this party started!
const app = new App();
