import { TextStyle } from 'react-native';

export interface ThemeFonts {
  gameFont: TextStyle;
  mediumGameFont: TextStyle;
}


export interface FactionColors {
  invertedText: string;
  text: string;
  border: string;
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
  L15: string;
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
  token: {
    skull: string;
    cultist: string;
    tablet: string;
    elder_thing: string;
    elder_sign: string;
    auto_fail: string;
    bless: string;
    curse: string;
    frost: string;
    [token: string]: string | undefined;
  };
  health: string;
  sanity: string;
  disableOverlay: string;
  campaign:{
    setup: string;
    interlude: string
    resolution: string;
    resolutionBackground: string;

    core: string;
    dwl: string;
    ptc: string;
    tfa: string;
    tcu: string;
    tde: string;
    tic: string;
    eoe: string
    standalone: string;
  };
  navButton: string;
  warn: string;
  green: string;
  red: string;
  upgrade: string;
  warnText: string;
  table: {
    header: string;
    light: string;
    dark: string;
  };
}
const light10 = '#D7D3C6';
const light15 = '#E6E1D3';
const light20 = '#F5F0E1';
const light30 = '#FFFBF2';
const dark10 = '#656C6F';
const dark15 = '#4F5A60';
const dark20 = '#475259';
const dark30 = '#24303C';
const medium = '#9B9B9B';

const neutralBorder = medium;

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
  L15: light15,
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
      background: guardianLightText,
      darkBackground: '#2b80c5',
      lightBackground: '#d5e6f3',
      border: guardianDarkText,
    },
    seeker: {
      invertedText: seekerDarkText,
      text: seekerLightText,
      background: '#DB7C07',
      darkBackground: '#db7c07',
      lightBackground: '#fbe6d4',
      border: seekerDarkText,
    },
    rogue: {
      invertedText: rogueDarkText,
      text: rogueLightText,
      background: '#219428',
      darkBackground: '#107116',
      lightBackground: '#cfe3d0',
      border: rogueDarkText,
    },
    mystic: {
      invertedText: mysticDarkText,
      text: mysticLightText,
      background: '#7554AB',
      darkBackground: '#4331B9',
      lightBackground: '#d9d6f1',
      border: mysticDarkText,
    },
    survivor: {
      invertedText: survivorDarkText,
      text: survivorLightText,
      background: '#CC3038',
      darkBackground: '#cc3038',
      lightBackground: '#f5d6d7',
      border: survivorDarkText,
    },
    neutral: {
      invertedText: neutralDarkText,
      text: neutralLightText,
      background: dark20,
      darkBackground: '#444444',
      lightBackground: '#e6e6e6',
      border: neutralBorder,
    },
    dual: {
      invertedText: dualDarkText,
      text: dualLightText,
      background: '#cfb13a',
      darkBackground: '#c0c000',
      lightBackground: '#f2f2cc',
      border: dualLightText,
    },
    dead: {
      invertedText: deadDarkText,
      text: deadLightText,
      background: '#704214',
      darkBackground: '#5a3510',
      lightBackground: '#d4c6b9',
      border: deadLightText,
    },
    mythos: {
      invertedText: mythosDarkText,
      text: mythosLightText,
      background: dark30,
      darkBackground: '#000000',
      lightBackground: '#000000',
      border: mythosLightText,
    },
  },
  upgrade: '#cfb13a',
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
  campaign: {
    setup: '#128C60',
    interlude: '#174691',
    resolution: '#E75122',
    resolutionBackground: '#E7512233',

    core: '#00759C',
    dwl: '#6D9548',
    ptc: '#5B579C',
    tfa: '#A45F9C',
    tcu: '#593B5D',
    tde: '#45559C',
    tic: '#2A7D7F',
    eoe: '#25B7CB',
    standalone: '#AC9788',
  },
  navButton: '#007AFF',
  green: '#9AEC86',
  red: '#FFDBD3',
  warn: '#FB4135',
  warnText: '#C50707',
  table: {
    header: '#a0dba3',
    light: '#e3fce4',
    dark: '#c7ebc9',
  },
  token: {
    skull: '#552D2D',
    cultist: '#314629',
    tablet: '#294146',
    elder_thing: '#442946',
    auto_fail: '#7D1318',
    elder_sign: '#4477A1',
    bless: '#9D702A',
    curse: '#3A2342',
    frost: '#3D3A63',
  },
};

export const DARK_THEME: ThemeColors = {
  fight: '#EE4A53',
  evade: '#48B14F',
  D10: light10,
  D20: light20,
  D30: light30,
  L10: dark10,
  L15: dark15,
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
      background: guardianLightText,
      darkBackground: '#2b80c5',
      lightBackground: '#004880',
      border: guardianDarkText,
    },
    seeker: {
      invertedText: seekerLightText,
      text: seekerDarkText,
      background: '#DB7C07',
      darkBackground: '#db7c07',
      lightBackground: '#bf5c00',
      border: seekerDarkText,
    },
    rogue: {
      invertedText: rogueLightText,
      text: rogueDarkText,
      background: '#219428',
      darkBackground: '#107116',
      lightBackground: '#015906',
      border: rogueDarkText,
    },
    mystic: {
      invertedText: mysticLightText,
      text: mysticDarkText,
      background: '#7554AB',
      darkBackground: '#7554AB',
      lightBackground: '#46018f',
      border: mysticDarkText,
    },
    survivor: {
      invertedText: survivorLightText,
      text: survivorDarkText,
      background: '#CC3038',
      darkBackground: '#cc3038',
      lightBackground: '#7a0105',
      border: survivorDarkText,
    },
    neutral: {
      invertedText: neutralLightText,
      text: neutralDarkText,
      background: dark20,
      darkBackground: '#444444',
      lightBackground: '#292929',
      border: neutralBorder,
    },
    dual: {
      invertedText: dualLightText,
      text: dualDarkText,
      background: '#cfb13a',
      darkBackground: '#c0c000',
      lightBackground: '#f2f2cc',
      border: dualDarkText,
    },
    dead: {
      invertedText: deadLightText,
      text: deadDarkText,
      background: '#704214',
      darkBackground: '#5a3510',
      lightBackground: '#d4c6b9',
      border: deadDarkText,
    },
    mythos: {
      invertedText: mythosLightText,
      text: mythosDarkText,
      background: '#444',
      darkBackground: '#000000',
      lightBackground: '#000000',
      border: mythosDarkText,
    },
  },

  upgrade: '#cfb13a',
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
  campaign: {
    setup: '#07AF73',
    interlude: '#1735ad',
    resolution: '#F04932',
    resolutionBackground: '#F0493233',

    core: '#006385',
    dwl: '#57783A',
    ptc: '#524F8D',
    tfa: '#96558E',
    tcu: '#4B314E',
    tde: '#3D4B8A',
    tic: '#236A6B',
    eoe: '#179BAD',
    standalone: '#A18978',
  },
  navButton: '#4aa1ff',
  green: '#314629',
  red: '#552D2D',
  warn: '#C50707',
  warnText: '#FB4135',
  table: {
    header: '#293d2a',
    light: '#455245',
    dark: '#203021',
  },
  token: {
    skull: '#915c5c',
    cultist: '#669154',
    tablet: '#548994',
    elder_thing: '#a661ab',
    auto_fail: '#bf2128',
    elder_sign: '#5496cc',
    bless: '#ebaa42',
    curse: '#b069c9',
    frost: '#3D3A63',
  },
};
