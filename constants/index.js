import React from 'react';
import { mapValues } from 'lodash';

import ArkhamIcon from '../assets/ArkhamIcon';

export const CORE_FACTION_CODES = [
  'mystic',
  'seeker',
  'guardian',
  'rogue',
  'survivor',
];

export const FACTION_CODES = [
  ...CORE_FACTION_CODES,
  'neutral',
];

export const FACTION_CODE_TO_STRING = {
  mystic: 'Mystic',
  seeker: 'Seeker',
  guardian: 'Guardian',
  rogue: 'Rogue',
  survivor: 'Survivor',
  neutral: 'Neutral',
};

export const SKILLS = [
  'willpower',
  'intellect',
  'combat',
  'agility',
  'wild',
];

export const SKILL_COLORS = {
  willpower: '#003961',
  intellect: '#4e1a45',
  combat: '#661e09',
  agility: '#00543a',
  wild: '#635120',
};

export const FACTION_COLORS = {
  mystic: '#4331b9',
  seeker: '#ec8426',
  guardian: '#2b80c5',
  rogue: '#107116',
  survivor: '#cc3038',
  neutral: '#808080',
};

export function createFactionIcons(size) {
  return mapValues(FACTION_COLORS, (color, faction) => {
    return (
      <ArkhamIcon
        name={faction === 'neutral' ? 'elder_sign' : faction}
        size={size}
        color={color}
      />
    );
  });
}
