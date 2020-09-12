import {
  ColorValue,
  Platform,
  PlatformColor,
  DynamicColorIOS,
} from 'react-native';

const darkText = (Platform.OS === 'ios' ? PlatformColor('labelColor') : PlatformColor('@color/colorPrimaryText')) as any as string;
const lightText = (Platform.OS === 'ios' ? PlatformColor('secondaryLabelColor') : PlatformColor('@color/colorSecondaryText')) as any as string;

const light10 = '#D7D3C6';
const light20 = '#F5F0E1';
const light30 = '#FFFBF2';
const dark10 = '#656C6F';
const dark20 = '#475259';
const dark30 = '#24303C';
const medium = '#9B9B9B';

const L10: ColorValue = Platform.OS === 'ios' ? DynamicColorIOS({ light: '#D7D3C6', dark: '#656C6F' }) : PlatformColor('@color/L10');
const L20: ColorValue = Platform.OS === 'ios' ? DynamicColorIOS({ light: '#F5F0E1', dark: '#475259' }) : PlatformColor('@color/L20');
const L30: ColorValue = Platform.OS === 'ios' ? DynamicColorIOS({ light: '#FFFBF2', dark: '#24303C' }) : PlatformColor('@color/L30');
const D10: ColorValue = Platform.OS === 'ios' ? DynamicColorIOS({ light: '#656C6F', dark: '#D7D3C6' }) : PlatformColor('@color/D10');
const D20: ColorValue = Platform.OS === 'ios' ? DynamicColorIOS({ light: '#475259', dark: '#F5F0E1' }) : PlatformColor('@color/D20');
const D30: ColorValue = Platform.OS === 'ios' ? DynamicColorIOS({ light: '#24303C', dark: '#FFFBF2' }) : PlatformColor('@color/D30');

export default {
  light10,
  light20,
  light30,
  dark10,
  dark20,
  dark30,
  L10,
  L20,
  L30,
  D10,
  D20,
  D30,
  M: medium,

  disabledOverlay: (Platform.OS === 'ios' ? DynamicColorIOS({ light: '#FFFFFF99', dark: '#00000099' }) : PlatformColor('@color/disabledOverlayColor')) as any as string,
  modalBackground: (Platform.OS === 'ios' ? PlatformColor('systemFillColor') : PlatformColor('@color/colorLightBackground')) as any as string,
  darkText,
  lightText,
  veryLightText: (Platform.OS === 'ios' ? PlatformColor('tertiaryLabelColor') : '#888') as any as string,
  background: Platform.select({
    'ios': PlatformColor('systemBackgroundColor'),
    'android': PlatformColor('@color/colorBackground'),
  }) as any as string,
  lightBackground: (Platform.OS === 'ios' ? PlatformColor('systemFillColor') : PlatformColor('@color/colorLightBackground')) as any as string,
  veryLightBackground: (Platform.OS === 'ios' ? PlatformColor('secondarySystemFillColor') : PlatformColor('@color/colorVeryLightBackground')) as any as string,
  veryVeryLightBackground: (Platform.OS === 'ios' ? PlatformColor('tertiarySystemFillColor') : PlatformColor('@color/colorVeryVeryLightBackground')) as any as string,
  divider: (Platform.OS === 'ios' ? PlatformColor('separatorColor') : '#888888') as any as string,
  faction: {
    mystic: {
      text: (Platform.OS === 'ios' ? DynamicColorIOS({ light: '#4331b9', dark: '#af89fa' }) : PlatformColor('@color/factionMysticTextColor')) as any as string,
      background: '#4331b9',
      darkBackground: '#4331b9',
      lightBackground: (Platform.OS === 'ios' ? DynamicColorIOS({ light: '#d9d6f1', dark: '#46018f' }) : PlatformColor('@color/factionMysticLightBackgroundColor')) as any as string,
    },
    seeker: {
      text: (Platform.OS === 'ios' ? DynamicColorIOS({ light: '#db7c07', dark: '#fcb447' }) : PlatformColor('@color/factionSeekerTextColor')) as any as string,
      background: '#db7c07',
      darkBackground: '#db7c07',
      lightBackground: (Platform.OS === 'ios' ? DynamicColorIOS({ light: '#fbe6d4', dark: '#bf5c00' }) : PlatformColor('@color/factionSeekerLightBackgroundColor')) as any as string,
    },
    guardian: {
      text: (Platform.OS === 'ios' ? DynamicColorIOS({ light: '#1072c2', dark: '#62cefc' }) : PlatformColor('@color/factionGuardianTextColor')) as any as string,
      background: '#2b80c5',
      darkBackground: '#2b80c5',
      lightBackground: (Platform.OS === 'ios' ? DynamicColorIOS({ light: '#d5e6f3', dark: '#004880' }) : PlatformColor('@color/factionGuardianLightBackgroundColor')) as any as string,
    },
    rogue: {
      text: (Platform.OS === 'ios' ? DynamicColorIOS({ light: '#107116', dark: '#52cc66' }) : PlatformColor('@color/factionRogueTextColor')) as any as string,
      background: '#107116',
      darkBackground: '#107116',
      lightBackground: (Platform.OS === 'ios' ? DynamicColorIOS({ light: '#cfe3d0', dark: '#015906' }) : PlatformColor('@color/factionRogueLightBackgroundColor')) as any as string,
    },
    survivor: {
      text: (Platform.OS === 'ios' ? DynamicColorIOS({ light: '#cc3038', dark: '#ff6b73' }) : PlatformColor('@color/factionSurvivorTextColor')) as any as string,
      background: '#cc3038',
      darkBackground: '#cc3038',
      lightBackground: (Platform.OS === 'ios' ? DynamicColorIOS({ light: '#f5d6d7', dark: '#7a0105' }) : PlatformColor('@color/factionSurvivorLightBackgroundColor')) as any as string,
    },
    neutral: {
      text: darkText,
      background: '#444',
      darkBackground: (Platform.OS === 'ios' ? DynamicColorIOS({ light: '#444444', dark: '#888888' }) : PlatformColor('@color/factionNeutralDarkBackgroundColor')) as any as string,
      lightBackground: (Platform.OS === 'ios' ? DynamicColorIOS({ light: '#e6e6e6', dark: '#292929' }) : PlatformColor('@color/factionNeutralLightBackgroundColor')) as any as string,
    },
    dual: {
      text: (Platform.OS === 'ios' ? DynamicColorIOS({ light: '#868600', dark: '#bfbf4d' }) : PlatformColor('@color/factionDualTextColor')) as any as string,
      background: '#9a9a00',
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
      text: darkText,
      background: '#444',
      darkBackground: (Platform.OS === 'ios' ? DynamicColorIOS({ light: '#000000', dark: '#444444' }) : PlatformColor('@color/factionMythosDarkBackgroundColor')) as any as string,
      lightBackground: '#000000',
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
  costTintIcon: (Platform.OS === 'ios' ? DynamicColorIOS({ light: '#f5f5f5', dark: '#202020' }) : PlatformColor('@color/costTintIcon')) as any as string,
  scenarioGreen: (Platform.OS === 'ios' ? DynamicColorIOS({ light: '#2E5344', dark: '#1fab73' }) : PlatformColor('@color/campaignScenarioGreen')) as any as string,
  veryLightBlue: '#cce4ff',
  lightBlue: '#007AFF',
  darkBlue: 'rgb(0, 78, 100)',
  white: 'rgb(247, 247, 255)',
  red: '#D84144',
  lightGray: 'rgb(230, 230, 230)',
  gray: 'rgb(201, 201, 201)',
  darkGray: 'rgb(120, 120, 120)',
  lightGreen: 'rgb(114, 221, 82)',
  yellow: 'rgb(255, 204, 0)',
  taboo: (Platform.OS === 'ios' ? DynamicColorIOS({ light: 'purple', dark: PlatformColor('systemPurple') }) : 'purple') as any as string,
  green: '#498D35',
  button: Platform.OS === 'ios' ? '#bbb' : '#000',
  navButton: (Platform.OS === 'ios' ? PlatformColor('linkColor') : '#007AFF') as any as string,
  black: '#000',
  switchTrackColor: Platform.OS === 'ios' ? { false: '#bbb', true: '#222' } : undefined,
  settingsBackground: Platform.OS === 'ios' ? '#e3e6ed' : '#f7f7ff',
  monza: '#C70039',

  toggleButton: (Platform.OS === 'ios' ?
    DynamicColorIOS({
      light: '#f6f6f6',
      dark: '#363636',
    }) : PlatformColor('@color/toggleButtonColor')) as any as string,

  selectedToggleButton: (Platform.OS === 'ios' ?
    DynamicColorIOS({
      light: '#dddddd',
      dark: '#111',
    }) : PlatformColor('@color/selectedToggleButtonColor')) as any as string,
};
