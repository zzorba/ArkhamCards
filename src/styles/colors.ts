import {
  Platform,
  DynamicColorIOS,
} from 'react-native';

const darkText = Platform.OS === 'ios' ? 
  DynamicColorIOS({
    light: '#111',
    dark: '#ddd',
  }) : '#111';

const lightText = Platform.OS === 'ios' ? 
  DynamicColorIOS({
    light: '#444',
    dark: '#aaa',
  }): '#444';

  export default {
  darkText,
  lightText,
  veryLightText: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#888', dark: '#888' }) : '#888',
  background: Platform.OS === 'ios' ? DynamicColorIOS({ light: 'white', dark: '#111' }) : 'white',
  lightBackground: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#ccc', dark: '#444' }) : '#ccc',
  veryLightBackground: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#eee', dark: '#222' }) : '#eee',
  veryVeryLightBackgound: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#f4f4f4', dark: '#040404' }) : '#f4f4f4',
  divider: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#bdbdbd', dark: '#444' }) : '#bdbdbd',
  faction: {
    mystic: {
      primary: '#4331b9',
      background: '#4331b9',
      dark: '#4331b9',
      veryLight: '#d9d6f1',
      light: '#a198dc',
    },
    seeker: {
      primary: '#ec8426',
      background: '#ec8426',
      dark: '#ec8426',
      veryLight: '#fbe6d4',
      light: '#f7cea8',
    },
    guardian: {
      primary: '#2b80c5',
      background: '#2b80c5',
      dark: '#2b80c5',
      veryLight: '#d5e6f3',
      light: '#aacce8',
    },
    rogue: {
      primary: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#107116', dark: '#1bb525' }) : '#107116',
      background: '#107116',
      dark: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#107116', dark: '#cfe3d0' }) : '#107116',
      veryLight: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#cfe3d0', dark: '#107116' }) : '#cfe3d0',
      light: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#9fc6a2', dark: '#08450d' }) : '#9fc6a2',
    },
    survivor: {
      primary: '#cc3038',
      background: '#cc3038',
      dark: '#cc3038',
      veryLight: '#f5d6d7',
      light: '#ebacaf',
    },
    neutral: {
      primary: darkText,
      background: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#444444', dark: '#bbb' }) : '#444',
      dark: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#444444', dark: '#bbb' }) : '#444',
      veryLight: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#e6e6e6', dark: '060606' }) : '#e6e6e6',
      light: Platform.OS === 'ios' ? DynamicColorIOS({ light: '#cccccc', dark: '#444' }) : '#ccc',
    },
    dual: {
      primary: '#868600',
      background: '#9a9a00',
      dark: '#c0c000',
      veryLight: '#f2f2cc',
      light: '#e6e699',
    },
    dead: {
      primary: '#704214',
      background: '#704214',
      dark: '#5a3510',
      veryLight: '#d4c6b9',
      light: '#b8a18a',
    },
    mythos: {
      primary: '#000000',
      background: '#000000',
      dark: '#000000',
      veryLight: '#000000',
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

  scenarioGreen: '#2E5344',
  veryLightBlue: '#cce4ff',
  lightBlue: '#007AFF',
  darkBlue: 'rgb(0, 78, 100)',
  white: 'rgb(247, 247, 255)',
  red: '#D84144',
  lightGray: 'rgb(230, 230, 230)',
  veryLightGray: 'rgb(245, 245, 245)',
  gray: 'rgb(201, 201, 201)',
  darkGray: 'rgb(120, 120, 120)',
  lightGreen: 'rgb(114, 221, 82)',
  yellow: 'rgb(255, 204, 0)',
  taboo: 'purple',
  green: '#498D35',
  button: Platform.OS === 'ios' ? '#bbb' : '#000',
  navButton: Platform.OS === 'ios' ? '#007AFF' : '#000',
  black: '#000',
  switchTrackColor: Platform.OS === 'ios' ? { false: '#bbb', true: '#222' } : undefined,
  settingsBackground: Platform.OS === 'ios' ? '#e3e6ed' : 'rgb(247, 247, 255)',
  monza: '#C70039',
};
