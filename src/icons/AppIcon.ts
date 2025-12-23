import createIconSetFromIcoMoon from '@expo/vector-icons/createIconSetFromIcoMoon';

// @ts-ignore
import appIconConfig from '../../assets/app.json';

const AppIcon = createIconSetFromIcoMoon(appIconConfig, 'app', 'app.ttf');
export default AppIcon;
