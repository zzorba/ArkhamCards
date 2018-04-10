import {
  Platform,
} from 'react-native';

export const FACTION_COLORS = {
  mystic: '#4331b9',
  seeker: '#ec8426',
  guardian: '#2b80c5',
  rogue: '#107116',
  survivor: '#cc3038',
  neutral: '#606060',
};

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
