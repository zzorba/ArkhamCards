import {
  Platform,
  PlatformColor,
  DynamicColorIOS,
} from 'react-native';

const medium = '#9B9B9B';

export default {
  M: medium,
  skill: {
    willpower: {
      default: '#165385',
      light: '#506A85',
      dark: '#2C7FC0',
    },
    intellect: {
      default: '#7A2D6C',
      light: '#7B5373',
      dark: '#7C3C85',
    },
    combat: {
      default: '#8D181E',
      light: '#8D5648',
      dark: '#AE4236',
    },
    agility: {
      default: '#0D6813',
      light: '#417F6C',
      dark: '#14854D',
    },
    wild: {
      default: '#635120',
      light: '#8A7D5A',
    },
  },
  lightBlue: '#007AFF',
  darkBlue: 'rgb(0, 78, 100)',
  white: 'rgb(247, 247, 255)',
  red: '#D84144',
  lightGray: 'rgb(230, 230, 230)',
  gray: 'rgb(201, 201, 201)',
  darkGray: 'rgb(120, 120, 120)',
  lightGreen: 'rgb(114, 221, 82)',
  yellow: 'rgb(255, 204, 0)',
  green: '#498D35',
  button: Platform.OS === 'ios' ? '#bbb' : '#000',
  navButton: (Platform.OS === 'ios' ? PlatformColor('linkColor') : '#007AFF') as any as string,
  black: '#000',
  switchTrackColor: Platform.OS === 'ios' ? { false: '#bbb', true: '#222' } : undefined,
};
