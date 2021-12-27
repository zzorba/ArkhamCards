import { Platform } from 'react-native';
import { find } from 'lodash';
import { t } from 'ttag';

import { ChaosTokenModifier, SimpleChaosTokenValue } from '@data/scenario/types';

export const ENABLE_SIDE_DECK = false;
export const ENABLE_ARKHAM_CARDS_ACCOUNT_IOS_BETA = true;
export const ENABLE_ARKHAM_CARDS_ACCOUNT_IOS = true;
export const ENABLE_ARKHAM_CARDS_ACCOUNT_ANDROID = true;
export const ENABLE_ARKHAM_CARDS_ACCOUNT = (Platform.OS === 'ios' && (ENABLE_ARKHAM_CARDS_ACCOUNT_IOS || ENABLE_ARKHAM_CARDS_ACCOUNT_IOS_BETA)) ||
  (Platform.OS === 'android' && ENABLE_ARKHAM_CARDS_ACCOUNT_ANDROID);

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
  'frost' |
  'bless' | 'curse' |
  'skull' | 'cultist' | 'tablet' | 'elder_thing' |
  'auto_fail' | 'elder_sign';

export type ChaosTokenType =
  '+1' | '0' | '-1' | '-2' | '-3' |
  '-4' | '-5' | '-6' | '-7' | '-8' |
  SpecialChaosTokenType;

export function isSpecialToken(token: ChaosTokenType) {
  switch (token) {
    case 'frost':
    case 'bless':
    case 'curse':
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
  'frost',
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
  'frost': 8,
  'skull': 11,
  'cultist': 12,
  'tablet': 13,
  'elder_thing': 14,
  'auto_fail': 15,
  'elder_sign': 16,
  'bless': 10,
  'curse': 10,
};

export const SPECIAL_TOKENS: SpecialChaosTokenType[] = [
  'skull',
  'cultist',
  'tablet',
  'elder_thing',
  'auto_fail',
  'elder_sign',
  'frost',
  'bless',
  'curse',
];

export const CHAOS_TOKEN_COLORS: { [skill: string]: string } = {
  frost: '#2F3649',
  tablet: '#003961',
  elder_thing: '#4e1a45',
  skull: '#661e09',
  cultist: '#00543a',
};

export function chaosTokenName(token: ChaosTokenType) {
  switch (token) {
    case 'frost': return t`Frost`;
    case 'bless': return t`Bless`;
    case 'curse': return t`Curse`;
    case 'skull': return t`Skull`;
    case 'cultist': return t`Cultist`;
    case 'tablet': return t`Tablet`;
    case 'elder_thing': return t`Elder Thing`;
    case 'auto_fail': return t`Auto-Fail`;
    case 'elder_sign': return t`Elder Sign`;
    case '+1': return '+1';
    case '0': return '0';
    case '-1': return '-1';
    case '-2': return '-2';
    case '-3': return '-3';
    case '-4': return '-4';
    case '-5': return '-5';
    case '-6': return '-6';
    case '-7': return '-7';
    case '-8': return '-8';
  }
}

export function getChaosTokenValue(token: ChaosTokenType, specialTokenValues: SimpleChaosTokenValue[]): ChaosTokenModifier | undefined {
  switch (token) {
    case 'frost':
      return { modifier: -1, reveal_another: true };
    case 'bless':
      return { modifier: 2, reveal_another: true };
    case 'curse':
      return { modifier: -2, reveal_another: true };
    case 'auto_fail':
      return { modifier: 'auto_fail' };
    case 'skull':
    case 'cultist':
    case 'tablet':
    case 'elder_thing':
    case 'elder_sign': {
      const specialValue = find(specialTokenValues, t => t.token === token);
      if (!specialValue) {
        return undefined;
      }
      return specialValue.value;
    }
    case '+1': return { modifier: 1 };
    case '0': return { modifier: 0 };
    case '-1': return { modifier: -1 };
    case '-2': return { modifier: -2 };
    case '-3': return { modifier: -3 };
    case '-4': return { modifier: -4 };
    case '-5': return { modifier: -5 };
    case '-6': return { modifier: -6 };
    case '-7': return { modifier: -7 };
    case '-8': return { modifier: -8 };
  }
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
  frost: 8,
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
export const FORCED_LEARNING_CODE = '08031'; // Deck size +15
export const UNDERWORLD_SUPPORT_CODE = '08046';
export const DOWN_THE_RABBIT_HOLE_CODE = '08059';

export const UNIDENTIFIED_UNTRANSLATED = new Set([
  '02021', // Strange Solution
  '03025', // Archaic Glyphs
  '04022', // Ancient Stones
  '06112', // Dream Diary
  '07022', // Cryptic Grimore
  '60210', // Forbidden Tome
]);
