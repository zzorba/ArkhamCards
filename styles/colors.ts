import {
  Platform,
} from 'react-native';

export const COLORS = {
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
  green: '#498D35',
  button: Platform.OS === 'ios' ? '#bbb' : '#000',
  navButton: Platform.OS === 'ios' ? '#007AFF' : '#000',
  black: '#000',
  switchTrackColor: Platform.OS === 'ios' ? { false: '#bbb', true: '#222' } : undefined,
  iosSettingsBackground: '#e3e6ed',
  monza: '#C70039',
};
