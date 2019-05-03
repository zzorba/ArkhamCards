import React, { ReactNode } from 'react';
import { mapValues } from 'lodash';

import ArkhamIcon from '../assets/ArkhamIcon';


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

export const SKILL_COLORS: { [skill: string]: string } = {
  willpower: '#003961',
  intellect: '#4e1a45',
  combat: '#661e09',
  agility: '#00543a',
  wild: '#635120',
};


export const FACTION_COLORS: { [faction_code: string]: string } = {
  mystic: '#4331b9',
  seeker: '#ec8426',
  guardian: '#2b80c5',
  rogue: '#107116',
  survivor: '#cc3038',
  neutral: '#000000',
  dual: '#868600',
};

export const FACTION_LIGHT_GRADIENTS: { [faction_code: string]: string[] } = {
  mystic: ['#d9d6f1', '#a198dc'],
  seeker: ['#fbe6d4', '#f7cea8'],
  guardian: ['#d5e6f3', '#aacce8'],
  rogue: ['#cfe3d0', '#9fc6a2'],
  survivor: ['#f5d6d7', '#ebacaf'],
  neutral: ['#e6e6e6', '#cccccc'],
  dual: ['#f2f2cc', '#e6e699'],
};

export const FACTION_DARK_GRADIENTS: { [faction_code: string]: string[] } = {
  mystic: ['#4331b9', '#2f2282'],
  seeker: ['#ec8426', '#bd6a1e'],
  guardian: ['#2b80c5', '#22669e'],
  rogue: ['#107116', '#0b4f0f'],
  survivor: ['#cc3038', '#a3262d'],
  neutral: ['#444444', '#222222'],
  dual: ['#c0c000', '#868600'],
};

export const FACTION_BACKGROUND_COLORS: { [faction_code: string]: string } = Object.assign(
  {},
  FACTION_COLORS,
  {
    neutral: '#444444',
    dual: '#9a9a00',
  },
);

export type ChaosTokenType =
  '+1' | '0' | '-1' | '-2' | '-3' |
  '-4' | '-5' | '-6' | '-7' | '-8' |
  'skull' | 'cultist' | 'tablet' | 'elder_thing' |
  'auto_fail' | 'elder_sign';

export const CHAOS_TOKENS: ChaosTokenType[] = [
  '+1', '0', '-1', '-2', '-3',
  '-4', '-5', '-6', '-7', '-8',
  'skull', 'cultist', 'tablet', 'elder_thing',
  'auto_fail', 'elder_sign',
];
export type ChaosBag = { [chaosToken in ChaosTokenType]?: number; };

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

export const SPECIAL_TOKENS: ChaosTokenType[] = [
  'skull',
  'cultist',
  'tablet',
  'elder_thing',
  'auto_fail',
  'elder_sign',
];

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

export function createFactionIcons(
  size: number,
  defaultColor?: string
): { [faction in FactionCodeType | 'dual']?: ReactNode } {
  return mapValues(FACTION_COLORS, (color, faction) => {
    return (
      <ArkhamIcon
        name={(faction === 'neutral' || faction === 'dual') ? 'elder_sign' : faction}
        size={size}
        color={defaultColor || color}
      />
    );
  });
}

export const RANDOM_BASIC_WEAKNESS = '01000';
