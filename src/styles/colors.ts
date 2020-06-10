import {
  Platform,
} from 'react-native';

export default {
  // Dark Mode Colors
  /*
   darkText: '#ddd',
   lightText: '#aaa',
   background: '#111',
   lightBackground: '#444',
   veryLightBackground: '#222',
   divider: '#444',
*/
  // Normal Colors
  darkText: '#111',
  lightText: 'rgb(120, 120, 120)',
  background: 'white',
  lightBackground: '#ccc',
  veryLightBackground: '#eee',
  divider: "#bdbdbd",

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
