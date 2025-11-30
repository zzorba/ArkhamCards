import { FactionCodeType, SkillCodeType, specialReprintCampaignPacks, specialReprintCardPacks, specialReprintPlayerPacks } from '@app_constants';
import { find } from 'lodash';
import Card, { CardStatusType } from './Card';
import { ListCard } from './ListCard';

/**
 * Shared helper functions for Card and ListCard
 * These take Pick<Card> to work with both full Card objects and ListCardImpl
 */

export function cardFactionCode(card: Pick<Card, 'faction_code'>): FactionCodeType {
  return (card.faction_code as FactionCodeType) || 'neutral';
}

export function cardSkillCount(
  card: Pick<Card, 'skill_willpower' | 'skill_intellect' | 'skill_combat' | 'skill_agility' | 'skill_wild'>,
  skill: SkillCodeType
): number {
  switch (skill) {
    case 'willpower':
      return card.skill_willpower || 0;
    case 'intellect':
      return card.skill_intellect || 0;
    case 'combat':
      return card.skill_combat || 0;
    case 'agility':
      return card.skill_agility || 0;
    case 'wild':
      return card.skill_wild || 0;
    default: {
      return 0;
    }
  }
}

export function cardCustom(card: Pick<Card, 'status' | 'code'>): boolean {
  return (
    card.status === CardStatusType.CUSTOM ||
    card.status === CardStatusType.PREVIEW ||
    card.code.startsWith('z')
  );
}

export function cardRealCost(
  card: Pick<Card, 'type_code' | 'cost' | 'permanent' | 'double_sided'>,
  linked?: boolean
): string | null {
  if (card.type_code !== 'asset' && card.type_code !== 'event') {
    return null;
  }
  if (card.cost === -2) {
    return 'X';
  }
  if (card.permanent || card.double_sided || linked || card.cost === null) {
    return '-';
  }
  return `${card.cost}`;
}


const REPRINT_CARDS: {
  [code: string]: string[] | undefined;
} = {
  '01017': ['nat'],
  '01023': ['nat'],
  '01025': ['nat'],
  '02186': ['har'],
  '02020': ['har'],
  '01039': ['har'],
  '01044': ['win'],
  '03030': ['win'],
  '04107': ['win'],
  '04232': ['win'],
  '03194': ['win'],
  '01053': ['win'],
  '02029': ['jac'],
  '03034': ['jac'],
  '02190': ['jac'],
  '02153': ['jac'],
  '04032': ['jac'],

  '07004': ['bob'],
  '07005': ['tdg'],
  '02003': ['hoth'],
  '05001': ['tftbw'],
  '08004': ['iotv'],
};

export function cardInCollection(
  card: Card | ListCard,
  packInCollection: { [pack_code: string]: boolean | undefined }
): boolean {
  if (packInCollection[card.pack_code]) {
    return true;
  }
  const alternatePack = card.encounter_code
    ? specialReprintCampaignPacks[card.pack_code]
    : specialReprintPlayerPacks[card.pack_code];
  if (alternatePack && packInCollection[alternatePack]) {
    return true;
  }
  const alternateCardPack = specialReprintCardPacks[card.code];
  if (alternateCardPack && packInCollection[alternateCardPack]) {
    return true;
  }
  const reprintPacks = card.reprint_pack_codes || REPRINT_CARDS[card.code];
  if (!reprintPacks) {
    return false;
  }
  return !!find(reprintPacks, (pack) => !!packInCollection[pack]);
}

export function cardCollectionDeckLimit(
  card: Pick<Card, 'pack_code' | 'deck_limit' | 'reprint_pack_codes' | 'code' | 'quantity'>,
  packInCollection: { [pack_code: string]: boolean | undefined },
  ignore_collection: boolean
): number {
  if (ignore_collection) {
    return card.deck_limit || 0;
  }
  if (card.pack_code !== 'core' || packInCollection.core) {
    return card.deck_limit || 0;
  }
  const reprintPacks = card.reprint_pack_codes || REPRINT_CARDS [card.code];
  if (
    reprintPacks &&
    find(reprintPacks, (pack) => !!packInCollection[pack])
  ) {
    return card.deck_limit || 0;
  }
  return Math.min(card.quantity || 0, card.deck_limit || 0);
}
