import {
  Platform,
  PlatformColor,
  DynamicColorIOS,
} from 'react-native';

const darkText = Platform.OS === 'ios' ? PlatformColor('labelColor') : '#111';
const lightText = Platform.OS === 'ios' ? PlatformColor('secondaryLabelColor') : '#444';

export default {
  darkText,
  lightText,
  veryLightText: Platform.OS === 'ios' ? PlatformColor('tertiaryLabelColor'): '#888',
  background: Platform.OS === 'ios' ? PlatformColor('systemBackgroundColor') : 'white',
  lightBackground: Platform.OS === 'ios' ? PlatformColor('systemFillColor') : '#ccc',
  veryLightBackground: Platform.OS === 'ios' ? PlatformColor('secondarySystemFillColor') : '#eee',
  veryVeryLightBackground: Platform.OS === 'ios' ? PlatformColor('tertiarySystemFillColor') : '#f4f4f4',
  divider: Platform.OS === 'ios' ? PlatformColor('separatorColor') : '#bdbdbd',
  faction: {
    mystic: {
      text: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#4331b9', dark: '#af89fa' }) : '#4331b9',
      background: '#4331b9',
      darkBackground: '#4331b9',
      pastelBackground: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#d47400', dark: '#46018f' }) : '#d47400',
      light: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#a198dc', dark: '#6104c4' }) : '#a198dc',
    },
    seeker: {
      text: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#de7e00', dark: '#fcb447' }) : '#de7e00',
      background: '#ec8426',
      darkBackground: '#ec8426',
      pastelBackground: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#fbe6d4', dark: '#cf6b0e' }) : '#f7cea8',
      light: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#f7cea8', dark: '#de6f09' }) : '#f7cea8',
    },
    guardian: {
      text: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#1072c2', dark: '#62cefc' }) : '#1072c2',
      background: '#2b80c5',
      darkBackground: '#2b80c5',
      pastelBackground: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#d5e6f3', dark: '#004880' }) : '#d5e6f3',
      light: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#aacce8', dark: '#0062ad' }) : '#aacce8',
    },
    rogue: {
      text: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#107116', dark: '#4fe356' }) : '#107116',
      background: '#107116',
      darkBackground: '#107116',
      pastelBackground: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#cfe3d0', dark: '#015906' }) : '#cfe3d0',
      light: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#9fc6a2', dark: '#008207' }) : '#9fc6a2', 
    },
    survivor: {
      text: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#cc3038', dark: '#ff6b73' }) : '#cc3038',
      background: '#cc3038',
      darkBackground: '#cc3038',
      pastelBackground: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#f5d6d7', dark: '#7a0105' }) : '#f5d6d7', 
      light: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#ebacaf', dark: '#b30006' }) : '#ebacaf',
    },
    neutral: {
      text: darkText,
      background: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#444', dark: '#888' }) : '#444',
      darkBackground: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#444', dark: '#888' }) : '#444',
      pastelBackground: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#e6e6e6', dark: '#292929' }) : '#e6e6e6',
      light: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#ccc', dark: '#404040' }) : '#ccc',
    },
    dual: {
      text: '#868600',
      background: '#9a9a00',
      darkBackground: '#c0c000',
      pastelBackground: '#f2f2cc',
      light: '#e6e699',
    },
    dead: {
      text: '#704214',
      background: '#704214',
      darkBackground: '#5a3510',
      pastelBackground: '#d4c6b9',
      light: '#b8a18a',
    },
    mythos: {
      text: darkText,
      background: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#000', dark: '#444' }) : '#000',
      darkBackground: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#000', dark: '#444' }) : '#000',
      pastelBackground: '#000000',
      light: '#000000',
    },
  },
  skill: {
    willpower: {
      default: '#003961',
      light: '#506A85',
    },
    intellect: {
      default: '#4e1a45',
      light: '#7B5373',
    },
    combat: {
      default: '#661e09',
      light: '#8D5648',
    },
    agility: {
      default: '#00543a',
      light: '#417F6C',
    },
    wild: {
      default: '#635120',
      light: '#8A7D5A',
    },
  },
  scenarioGreen: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#2E5344', dark: '#1fab73' }) : '#2E5344',
  veryLightBlue: '#cce4ff',
  lightBlue: '#007AFF',
  darkBlue: 'rgb(0, 78, 100)',
  white: 'rgb(247, 247, 255)',
  red: '#D84144',
  lightGray: 'rgb(230, 230, 230)',
  gray: 'rgb(201, 201, 201)',
  darkGray: 'rgb(120, 120, 120)',
  lightGreen: 'rgb(114, 221, 82)',
  yellow: 'rgb(255, 204, 0)',
  taboo: Platform.OS === 'ios' ? DynamicColorIOS({ light: 'purple', dark: PlatformColor('systemPurple') }) : 'purple',
  green: '#498D35',
  button: Platform.OS === 'ios' ? '#bbb' : '#000',
  navButton: Platform.OS === 'ios' ? PlatformColor('linkColor') : '#000',
  black: '#000',
  switchTrackColor: Platform.OS === 'ios' ? { false: '#bbb', true: '#222' } : undefined,
  settingsBackground: Platform.OS === 'ios' ? '#e3e6ed' : 'rgb(247, 247, 255)',
  monza: '#C70039',

  toggleButton: Platform.OS === 'ios' ? 
    DynamicColorIOS({
      light: '#f6f6f6',
      dark: '#363636',
    }) : '#f6f6f6',

  selectedToggleButton: Platform.OS === 'ios' ? 
    DynamicColorIOS({
      light: '#dddddd',
      dark: '#111',
    }) : '#dddddd',
};
