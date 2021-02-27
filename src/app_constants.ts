import { Platform } from 'react-native';

export const ENABLE_ARKHAM_CARDS_ACCOUNT = Platform.OS === 'ios';
export type TypeCodeType =
  'asset' |
  'event' |
  'skill' |
  'act' |
  'agenda' |
  'story' |
  'enemy' |
  'treachery' |
  'location' |
  'investigator' |
  'scenario';

export type SlotCodeType =
  'hand' |
  'hand x2' |
  'arcane' |
  'arcane x2' |
  'accessory' |
  'body' |
  'ally' |
  'tarot';

export const SLOTS: SlotCodeType[] = [
  'hand',
  'hand x2',
  'arcane',
  'arcane x2',
  'accessory',
  'body',
  'ally',
  'tarot',
];

export type FactionCodeType =
  'guardian' |
  'seeker' |
  'rogue' |
  'mystic' |
  'survivor' |
  'neutral' |
  'mythos';

export const CORE_FACTION_CODES: FactionCodeType[] = [
  'mystic',
  'seeker',
  'guardian',
  'rogue',
  'survivor',
];

export const CARD_FACTION_CODES: FactionCodeType[] = [
  ...CORE_FACTION_CODES,
  'neutral',
  'mythos',
];

export const PLAYER_FACTION_CODES: FactionCodeType[] = [
  ...CORE_FACTION_CODES,
  'neutral',
];

export const FACTION_CODES: string[] = [
  ...CORE_FACTION_CODES,
  'neutral',
  'dual',
];

export const FACTION_CODE_TO_STRING = {
  mystic: 'Mystic',
  seeker: 'Seeker',
  guardian: 'Guardian',
  rogue: 'Rogue',
  survivor: 'Survivor',
  neutral: 'Neutral',
  dual: 'Dual',
};

export type SkillCodeType = 'willpower' |
  'intellect' |
  'combat' |
  'agility' |
  'wild';

export const BASIC_SKILLS: SkillCodeType[] = [
  'willpower',
  'intellect',
  'combat',
  'agility',
];

export const SKILLS: SkillCodeType[] = [
  ...BASIC_SKILLS,
  'wild',
];

export type SpecialChaosTokenType =
  'bless' | 'curse' |
  'skull' | 'cultist' | 'tablet' | 'elder_thing' |
  'auto_fail' | 'elder_sign';

export type ChaosTokenType =
  '+1' | '0' | '-1' | '-2' | '-3' |
  '-4' | '-5' | '-6' | '-7' | '-8' |
  SpecialChaosTokenType;

export function isSpecialToken(token: ChaosTokenType) {
  switch (token) {
    case 'skull':
    case 'cultist':
    case 'tablet':
    case 'elder_thing':
    case 'auto_fail':
    case 'elder_sign':
      return true;
    default:
      return false;
  }
}

export const CHAOS_TOKENS: ChaosTokenType[] = [
  '+1', '0', '-1', '-2', '-3',
  '-4', '-5', '-6', '-7', '-8',
  'skull', 'cultist', 'tablet', 'elder_thing',
  'auto_fail', 'elder_sign',
];

export type ChaosBag = {
  [chaosToken in ChaosTokenType]?: number;
};

export const CHAOS_TOKEN_ORDER: ChaosBag = {
  '+1': 0,
  '0': 1,
  '-1': 2,
  '-2': 3,
  '-3': 4,
  '-4': 5,
  '-5': 6,
  '-6': 7,
  '-7': 8,
  '-8': 9,
  'skull': 10,
  'cultist': 11,
  'tablet': 12,
  'elder_thing': 13,
  'auto_fail': 14,
  'elder_sign': 15,
};

export const SPECIAL_TOKENS: SpecialChaosTokenType[] = [
  'skull',
  'cultist',
  'tablet',
  'elder_thing',
  'auto_fail',
  'elder_sign',
  'bless',
  'curse',
];

export const CHAOS_TOKEN_COLORS: { [skill: string]: string } = {
  tablet: '#003961',
  elder_thing: '#4e1a45',
  skull: '#661e09',
  cultist: '#00543a',
};

export type ChaosTokenValue =
  number |
  'auto_succeed' |
  'auto_fail' |
  'reveal_another' |
  'X';

export interface SpecialTokenValue {
  token: ChaosTokenType;
  value: ChaosTokenValue;
  xText?: string;
  revealAnother?: boolean;
}

export const CHAOS_BAG_TOKEN_COUNTS: ChaosBag = {
  '+1': 3,
  '0': 4,
  '-1': 5,
  '-2': 4,
  '-3': 3,
  '-4': 2,
  '-5': 2,
  '-6': 1,
  '-7': 1,
  '-8': 1,
  skull: 4,
  cultist: 4,
  tablet: 4,
  elder_thing: 4,
  auto_fail: 1,
  elder_sign: 1,
};

export const ARCANE_RESEARCH_CODE = '04109';
export const ADAPTABLE_CODE = '02110';
export const SHREWD_ANALYSIS_CODE = '04106';
export const PARALLEL_SKIDS_CODE = '90008';
export const PARALLEL_AGNES_CODE = '90017';
export const BODY_OF_A_YITHIAN = '04244';
export const RANDOM_BASIC_WEAKNESS = '01000';
export const CUSTOM_INVESTIGATOR = 'custom_001';
export const VERSATILE_CODE = '06167';
export const ON_YOUR_OWN_CODE = '53010';
export const DEJA_VU_CODE = '60531';
export const ANCESTRAL_KNOWLEDGE_CODE = '07303';
export const ACE_OF_RODS_CODE = '05040';

export const UNIDENTIFIED_UNTRANSLATED = new Set([
  '02021', // Strange Solution
  '03025', // Archaic Glyphs
  '04022', // Ancient Stones
  '06112', // Dream Diary
  '07022', // Cryptic Grimore
  '60210', // Forbidden Tome
]);
