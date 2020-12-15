import { TextStyle } from 'react-native';

export interface ThemeFonts {
  gameFont: TextStyle;
  mediumGameFont: TextStyle;
}


export interface FactionColors {
  invertedText: string;
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
  warn: string;
  warnText: string;
  table: {
    header: string;
    light: string;
    dark: string;
  };
}
const light10 = '#D7D3C6';
const light20 = '#F5F0E1';
const light30 = '#FFFBF2';
const dark10 = '#656C6F';
const dark20 = '#475259';
const dark30 = '#24303C';
const medium = '#9B9B9B';

const guardianLightText = '#1072C2';
const seekerLightText = '#DB7C07';
const rogueLightText = '#219428';
const mysticLightText = '#7554AB';
const survivorLightText = '#CC3038';
const neutralLightText = dark20;
const dualLightText = '#868600';
const deadLightText = '#704214';
const mythosLightText = dark30;

const guardianDarkText = '#5CB4FD';
const seekerDarkText = '#EFA345';
const rogueDarkText = '#48B14F';
const mysticDarkText = '#BA81F2';
const survivorDarkText = '#EE4A53';
const neutralDarkText = light20;

const dualDarkText = '#E9D06C';
const deadDarkText = '#704214';
const mythosDarkText = light30;

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
      invertedText: guardianDarkText,
      text: guardianLightText,
      background: '#1072C2',
      darkBackground: '#2b80c5',
      lightBackground: '#d5e6f3',
    },
    seeker: {
      invertedText: seekerDarkText,
      text: seekerLightText,
      background: '#DB7C07',
      darkBackground: '#db7c07',
      lightBackground: '#fbe6d4',
    },
    rogue: {
      invertedText: rogueDarkText,
      text: rogueLightText,
      background: '#219428',
      darkBackground: '#107116',
      lightBackground: '#cfe3d0',
    },
    mystic: {
      invertedText: mysticDarkText,
      text: mysticLightText,
      background: '#7554AB',
      darkBackground: '#4331B9',
      lightBackground: '#d9d6f1',
    },
    survivor: {
      invertedText: survivorDarkText,
      text: survivorLightText,
      background: '#CC3038',
      darkBackground: '#cc3038',
      lightBackground: '#f5d6d7',
    },
    neutral: {
      invertedText: neutralDarkText,
      text: neutralLightText,
      background: dark20,
      darkBackground: '#444444',
      lightBackground: '#e6e6e6',
    },
    dual: {
      invertedText: dualDarkText,
      text: dualLightText,
      background: '#cfb13a',
      darkBackground: '#c0c000',
      lightBackground: '#f2f2cc',
    },
    dead: {
      invertedText: deadDarkText,
      text: deadLightText,
      background: '#704214',
      darkBackground: '#5a3510',
      lightBackground: '#d4c6b9',
    },
    mythos: {
      invertedText: mythosDarkText,
      text: mythosLightText,
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
  warn: '#FB4135',
  warnText: '#C50707',
  table: {
    header: '#a0dba3',
    light: '#e3fce4',
    dark: '#c7ebc9',
  },
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
      invertedText: guardianLightText,
      text: guardianDarkText,
      background: '#1072C2',
      darkBackground: '#2b80c5',
      lightBackground: '#004880',
    },
    seeker: {
      invertedText: seekerLightText,
      text: seekerDarkText,
      background: '#DB7C07',
      darkBackground: '#db7c07',
      lightBackground: '#bf5c00',
    },
    rogue: {
      invertedText: rogueLightText,
      text: rogueDarkText,
      background: '#219428',
      darkBackground: '#107116',
      lightBackground: '#015906',
    },
    mystic: {
      invertedText: mysticLightText,
      text: mysticDarkText,
      background: '#7554AB',
      darkBackground: '#7554AB',
      lightBackground: '#46018f',
    },
    survivor: {
      invertedText: survivorLightText,
      text: survivorDarkText,
      background: '#CC3038',
      darkBackground: '#cc3038',
      lightBackground: '#7a0105',
    },
    neutral: {
      invertedText: neutralLightText,
      text: neutralDarkText,
      background: dark20,
      darkBackground: '#444444',
      lightBackground: '#292929',
    },
    dual: {
      invertedText: dualLightText,
      text: dualDarkText,
      background: '#cfb13a',
      darkBackground: '#c0c000',
      lightBackground: '#f2f2cc',
    },
    dead: {
      invertedText: deadLightText,
      text: deadDarkText,
      background: '#704214',
      darkBackground: '#5a3510',
      lightBackground: '#d4c6b9',
    },
    mythos: {
      invertedText: mythosLightText,
      text: mythosDarkText,
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
  navButton: '#4aa1ff',
  warn: '#C50707',
  warnText: '#FB4135',
  table: {
    header: '#293d2a',
    light: '#455245',
    dark: '#203021',
  },
};
