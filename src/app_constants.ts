import { Platform } from 'react-native';
import { find } from 'lodash';
import { t } from 'ttag';

import { ChaosTokenModifier, SimpleChaosTokenValue } from '@data/scenario/types';

export const ENABLE_ARKHAM_CARDS_ACCOUNT_IOS_BETA = true;
export const ENABLE_ARKHAM_CARDS_ACCOUNT_IOS = true;
export const ENABLE_ARKHAM_CARDS_ACCOUNT_ANDROID_BETA = true;
export const ENABLE_ARKHAM_CARDS_ACCOUNT_ANDROID = true;
export const ENABLE_ARKHAM_CARDS_ACCOUNT = (Platform.OS === 'ios' && (ENABLE_ARKHAM_CARDS_ACCOUNT_IOS || ENABLE_ARKHAM_CARDS_ACCOUNT_IOS_BETA)) ||
  (Platform.OS === 'android' && (ENABLE_ARKHAM_CARDS_ACCOUNT_ANDROID || ENABLE_ARKHAM_CARDS_ACCOUNT_ANDROID_BETA));

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

export function asSlotCodeType(val: string | undefined): SlotCodeType | undefined {
  if (!val) {
    return undefined;
  }
  switch (val) {
    case 'hand':
    case 'hand x2':
    case 'arcane':
    case 'arcane x2':
    case 'accessory':
    case 'body':
    case 'ally':
    case 'tarot':
      return val;
    default:
      return undefined;
  }
}

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
      return { modifier: -1, reveal_another: 1 };
    case 'bless':
      return { modifier: 2, reveal_another: 1 };
    case 'curse':
      return { modifier: -2, reveal_another: 1 };
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
  '-6': 2,
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

export const PRECIOUS_MEMENTO_FORMER_CODE = '08114'
export const PRECIOUS_MEMENTO_FUTURE_CODE = '08115'
export const RAVEN_QUILL_CODE = '09042';
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
export const UNDERWORLD_MARKET_CODE = '09077';

export const UNIDENTIFIED_UNTRANSLATED = new Set([
  '02021', // Strange Solution
  '03025', // Archaic Glyphs
  '04022', // Ancient Stones
  '06112', // Dream Diary
  '07022', // Cryptic Grimore
  '60210', // Forbidden Tome
]);

export interface TarotCard {
  id: string;
  position: number;
  title: string;
  text: string;
  inverted_text: string;
}

export function getTarotCards(): { [id: string] : TarotCard } {
  return {
    the_fool: {
      id: 'the_fool',
      position: 0,
      title: t`The Fool · 0`,
      text: t`Each investigator not defeated during this game earns +2 experience during its resolution.`,
      inverted_text: t`Each investigator defeated during this game earns -2 experience during its resolution.`,
    },
    the_magician: {
      id: 'the_magician',
      position: 1,
      title: t`The Magician · I`,
      text: t`Each investigator begins the game with 3 addititonal resources`,
      inverted_text: t`Each investigator begins the game with 3 fewer resources, and cannot gain resources during their first turn.`,
    },
    the_high_priestess: {
      id: 'the_high_priestess',
      position: 2,
      title: t`The High Priestess · II`,
      text: t`During the first [intellect] test each investigator performs each round, they get +1 [intellect].`,
      inverted_text: t`During the first [intellect] test each investigator performs each round, they get -1 [intellect].`,
    },
    the_empress: {
      id: 'the_empress',
      position: 3,
      title: t`The Empress · III`,
      text: t`During the first [agility] test each investigator performs each round, they get +1 [agility].`,
      inverted_text: t`During the first [agility] test each investigator performs each round, they get -1 [agility].`,
    },
    the_emperor: {
      id: 'the_emperor',
      position: 4,
      title: t`The Emperor · IV`,
      text: t`During the first [combat] test each investigator performs each round, they get +1 [combat].`,
      inverted_text: t`During the first [combat] test each investigator performs each round, they get -1 [combat].`,
    },
    the_hierophant: {
      id: 'the_hierophant',
      position: 5,
      title: t`The Hierophant · V`,
      text: t`During the first [willpower] test each investigator performs each round, they get +1 [willpower].`,
      inverted_text: t`During the first [willpower] test each investigator performs each round, they get -1 [willpower].`,
    },
    the_lovers: {
      id: 'the_lovers',
      position: 6,
      title: t`The Lovers · VI`,
      text: t`When the game begins, each investigator searches their deck for an Ally asset, adds it to their hand, and shuffles their deck.`,
      inverted_text: t`When the game begins, each investigator searches their deck for an Ally asset, removes it from the game, and shuffles their deck.`,
    },
    the_chariot: {
      id: 'the_chariot',
      position: 7,
      title: t`The Chariot · VII`,
      text: t`Each investigator begins the game with 2 additional cards in their opening hand.`,
      inverted_text: t`Each investigator begins the game with 2 fewer cards in their opening hand, and cannot draw cards during their first turn.`,
    },
    strength: {
      id: 'strength',
      position: 8,
      title: t`Strength · VIII`,
      text: t`When the game begins, each investigator may play an asset from their hand at -2 cost.`,
      inverted_text: t`During the first round of the game, each investigator cannot play assets.`,
    },
    the_hermit: {
      id: 'the_hermit',
      position: 9,
      title: t`The Hermit · IX`,
      text: t`Increase each investigator's maximum hand size by 3.`,
      inverted_text: t`Decrease each investigator's maximum hand size by 3.`,
    },
    wheel_of_fortune: {
      id: 'wheel_of_fortune',
      position: 10,
      title: t`Wheel of Fortune · X`,
      text: t`Once each act, when an investigator reveals an [auto_fail] token, thte investigator may cancel it and treat it as a 0 token instead.`,
      inverted_text: t`Once each agenda, the first time any investigator reveals an [elder_sign] token, cancel it and treat it as a -5 token instead.`,
    },
    justice: {
      id: 'justice',
      position: 11,
      title: t`Justice · XI`,
      text: t`Cancel the first doom that would be placed on the final agenda of the game.`,
      inverted_text: t`The final agenda of the game enters play with 1 doom on it.`,
    },
    the_hanged_man: {
      id: 'the_hanged_man',
      position: 12,
      title: t`The Hanged Man · XII`,
      text: t`During setup, each investigator may take up to 2 additional mulligans.`,
      inverted_text: t`Each investigator cannot mulligan or replace weaknesses in their opening hand (resolve their revelation abilities when the game begins).`,
    },
    death: {
      id: 'death',
      position: 13,
      title: t`Death · XIII`,
      text: t`Each investigator gets +1 health.`,
      inverted_text: t`Each investigator gets -1 health.`,
    },
    temperance: {
      id: 'temperance',
      position: 14,
      title: t`Temperance · XIV`,
      text: t`Each investigator gets +1 sanity.`,
      inverted_text: t`Each investigator gets -1 sanity.`,
    },
    the_devil: {
      id: 'the_devil',
      position: 15,
      title: t`The Devil · XV`,
      text: t`Each investigator has 1 additional slot of a type chosen by that investigattor when the game begins.`,
      inverted_text: t`Each investigator has 3 fewer slots, each of a different type, chosen by that investigator when the game begins.`,
    },
    the_tower: {
      id: 'the_tower',
      position: 16,
      title: t`The Tower · XVI`,
      text: t`Each investigator chooses 1 basic weakness in their deck and removes it from the game (return them after the game ends).`,
      inverted_text: t`Add 1 random basic weakness to each investigator's deck. Remove them after the game ends.`,
    },
    the_star: {
      id: 'the_star',
      position: 17,
      title: t`The Star · XVII`,
      text: t`After an investigator reveals an [elder_sign] token during a skill test, they may heal 1 damage or 1 horror.`,
      inverted_text: t`After an investigator reveals an [auto_fail] token during a skill test, they must either take 1 damage or 1 horror.`,
    },
    the_moon: {
      id: 'the_moon',
      position: 18,
      title: t`The Moon · XVIII`,
      text: t`The first time each investigator's deck would run out of cards, they may shuffle the bottom 10 cards of their discard pile back into their deck.`,
      inverted_text: t`When the game begins, each investigator discards the top 5 cards of their deck. Shuffle each discarded weakness into its owner's deck.`,
    },
    the_sun: {
      id: 'the_sun',
      position: 19,
      title: t`The Sun · XIX`,
      text: t`During each investigator's first turn, they may take 2 additional actions.`,
      inverted_text: t`During each investigator's first turn, they have 2 fewer actions to take.`,
    },
    judgement: {
      id: 'judgement',
      position: 20,
      title: t`Judgement · XX`,
      text: t`When the game begins, replace a [skull] token in the chaos bag with a 0 token. Swap them back after the game ends.`,
      inverted_text: t`When the game begins, replace the highest non-negative token in the chaos bag with a [skull] token. Swap them back after the game ends.`,
    },
    the_world: {
      id: 'the_world',
      position: 21,
      title: t`The World · XXI`,
      text: t`Each investigator not defeated during this game may remove 1 trauma of their choice during its resolution.`,
      inverted_text: t`Each investigator defeated during this game suffers 1 trauma of their choice during its resolution.`,
    },
  };
}