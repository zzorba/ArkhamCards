import {
  Platform,
} from 'react-native';

export const COLORS = {
  lightBlue: '#35ABCC',
  darkBlue: 'rgb(0, 78, 100)',
  white: 'rgb(247, 247, 255)',
  red: '#D84144',
  gray: 'rgb(201, 201, 201)',
  lightGreen: 'rgb(114, 221, 82)',
  green: '#498D35',
  button: Platform.OS === 'ios' ? '#bbb' : '#000',
};
