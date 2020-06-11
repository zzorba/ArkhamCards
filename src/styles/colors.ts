import {
  Platform,
} from 'react-native';

const darkText = '#111';
const lightText = '#444';
export default {
  // Dark Mode Colors
  /*
  darkText: '#ddd',
  lightText: '#aaa',
  veryLightText: '#888',
  background: '#111',
  lightBackground: '#444',
  veryLightBackground: '#222',
  veryVeryLightBackgound: '#040404',
  divider: '#444',*/

  // Normal Colors
  darkText,
  lightText,
  veryLightText: '#888',
  background: 'white',
  lightBackground: '#ccc',
  veryLightBackground: '#eee',
  veryVeryLightBackgound: '#f4f4f4',
  divider: '#bdbdbd',

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
      primary: '#107116',
      background: '#107116',
      dark: '#107116',
      veryLight: '#cfe3d0',
      light: '#9fc6a2',
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
      background: '#444444',
      dark: '#444444',
      veryLight: '#e6e6e6',
      light: '#cccccc',
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
