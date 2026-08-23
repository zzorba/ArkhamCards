import createIconSetFromIcoMoon from '@expo/vector-icons/createIconSetFromIcoMoon';

// @ts-ignore
import bloodIconConfig from '../../assets/blood.json';

const BloodIcon = createIconSetFromIcoMoon(bloodIconConfig, 'blood', 'blood.ttf');
export default BloodIcon;
