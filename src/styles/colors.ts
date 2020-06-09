import {
  Platform,
} from 'react-native';

export default {
  // darkTextColor: '#ddd',
  // lightTextColor: '#aaa',
  // backgroundColor: '#111',
  // lightBackgroundColor: '#444',
  // veryLightBackgroundColor: '#222',

  darkTextColor: '#222',
  lightTextColor: 'rgb(120, 120, 120)',
  backgroundColor: 'white',
  lightBackgroundColor: '#ccc',
  veryLightBackgroundColor: '#eee',

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
