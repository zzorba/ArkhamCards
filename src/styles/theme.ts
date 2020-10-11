import { TextStyle } from 'react-native';

export interface ThemeFonts {
  gameFont: TextStyle;
  mediumGameFont: TextStyle;
}


export interface FactionColors {
  text: string;
  background: string;
  darkBackground: string;
  lightBackground: string;
}

export interface SkillColor {
  icon: string;
}

export interface ThemeColors {
  fight: string;
  evade: string;
  L10: string;
  L20: string;
  L30: string;
  D10: string;
  D20: string;
  D30: string;
  M: string;
  background: string;
  darkText: string;
  lightText: string;
  taboo: string;
  divider: string;
  faction: {
    guardian: FactionColors;
    seeker: FactionColors;
    rogue: FactionColors;
    mystic: FactionColors;
    survivor: FactionColors;
    neutral: FactionColors;
    mythos: FactionColors;
    dual: FactionColors;
    dead: FactionColors;
  };
  skill: {
    willpower: SkillColor;
    intellect: SkillColor;
    combat: SkillColor;
    agility: SkillColor;
    wild: SkillColor;
  };
  health: string;
  sanity: string;
  disableOverlay: string;
  scenarioGreen: string;
  campaign:{
    gold: string;
    blue: string;
    teal: string;
    green: string;
    purple: string;
    red: string;
  };
  navButton: string;
}
const light10 = '#D7D3C6';
const light20 = '#F5F0E1';
const light30 = '#FFFBF2';
const dark10 = '#656C6F';
const dark20 = '#475259';
const dark30 = '#24303C';
const medium = '#9B9B9B';

export const LIGHT_THEME: ThemeColors = {
  fight: '#8D181E',
  evade: '#0D6813',
  L10: light10,
  L20: light20,
  L30: light30,
  D10: dark10,
  D20: dark20,
  D30: dark30,
  background: light30,
  lightText: dark10,
  darkText: dark30,
  taboo: 'purple',
  divider: light10,
  disableOverlay: '#FFFBF299',
  M: medium,
  faction: {
    guardian: {
      text: '#1072C2',
      background: '#1072C2',
      darkBackground: '#2b80c5',
      lightBackground: '#d5e6f3',
    },
    seeker: {
      text: '#DB7C07',
      background: '#DB7C07',
      darkBackground: '#db7c07',
      lightBackground: '#fbe6d4',
    },
    rogue: {
      text: '#219428',
      background: '#219428',
      darkBackground: '#107116',
      lightBackground: '#cfe3d0',
    },
    mystic: {
      text: '#7554AB',
      background: '#7554AB',
      darkBackground: '#4331B9',
      lightBackground: '#d9d6f1',
    },
    survivor: {
      text: '#CC3038',
      background: '#CC3038',
      darkBackground: '#cc3038',
      lightBackground: '#f5d6d7',
    },
    neutral: {
      text: dark20,
      background: dark20,
      darkBackground: '#444444',
      lightBackground: '#e6e6e6',
    },
    dual: {
      text: '#868600',
      background: '#cfb13a',
      darkBackground: '#c0c000',
      lightBackground: '#f2f2cc',
    },
    dead: {
      text: '#704214',
      background: '#704214',
      darkBackground: '#5a3510',
      lightBackground: '#d4c6b9',
    },
    mythos: {
      text: dark30,
      background: dark30,
      darkBackground: '#000000',
      lightBackground: '#000000',
    },
  },
  skill: {
    willpower: {
      icon: '#165385',
    },
    intellect: {
      icon: '#7A2D6C',
    },
    combat: {
      icon: '#8D181E',
    },
    agility: {
      icon: '#0D6813',
    },
    wild: {
      icon: '#635120',
    },
  },
  health: '#8D181E',
  sanity: '#165385',
  scenarioGreen: '#2E5344',
  campaign: {
    gold: '#c99b3833',
    blue: '#00408033',
    teal: '#00666633',
    purple: '#46088733',
    green: '#325c0933',
    red: '#96000333',
  },
  navButton: '#007AFF',
};

export const DARK_THEME: ThemeColors = {
  fight: '#EE4A53',
  evade: '#48B14F',
  D10: light10,
  D20: light20,
  D30: light30,
  L10: dark10,
  L20: dark20,
  L30: dark30,
  background: dark30,
  lightText: light10,
  darkText: light30,
  divider: dark10,
  taboo: '#9869f5',
  M: medium,
  disableOverlay: '#24303C99',
  faction: {
    guardian: {
      text: '#5CB4FD',
      background: '#1072C2',
      darkBackground: '#2b80c5',
      lightBackground: '#004880',
    },
    seeker: {
      text: '#EFA345',
      background: '#DB7C07',
      darkBackground: '#db7c07',
      lightBackground: '#bf5c00',
    },
    rogue: {
      text: '#48B14F',
      background: '#219428',
      darkBackground: '#107116',
      lightBackground: '#015906',
    },
    mystic: {
      text: '#BA81F2',
      background: '#7554AB',
      darkBackground: '#7554AB',
      lightBackground: '#46018f',
    },
    survivor: {
      text: '#EE4A53',
      background: '#CC3038',
      darkBackground: '#cc3038',
      lightBackground: '#7a0105',
    },
    neutral: {
      text: light20,
      background: dark20,
      darkBackground: '#444444',
      lightBackground: '#292929',
    },
    dual: {
      text: '#E9D06C',
      background: '#cfb13a',
      darkBackground: '#c0c000',
      lightBackground: '#f2f2cc',
    },
    dead: {
      text: '#704214',
      background: '#704214',
      darkBackground: '#5a3510',
      lightBackground: '#d4c6b9',
    },
    mythos: {
      text: light30,
      background: '#444',
      darkBackground: '#000000',
      lightBackground: '#000000',
    },
  },
  skill: {
    willpower: {
      icon: '#2C7FC0',
    },
    intellect: {
      icon: '#7C3C85',
    },
    combat: {
      icon: '#AE4236',
    },
    agility: {
      icon: '#14854D',
    },
    wild: {
      icon: '#8A7D5A',
    },
  },
  health: '#AE4236',
  sanity: '#2C7FC0',
  scenarioGreen: '#1fab73',
  campaign: {
    gold: '#755a2088',
    blue: '#395c8088',
    teal: '#2a666688',
    purple: '#7c559e88',
    green: '#33660088',
    red: '#8f474988',
  },
  navButton: '#7abaff',
};
