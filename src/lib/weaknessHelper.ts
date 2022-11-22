import { filter, find, flatMap, head, map, range, shuffle } from 'lodash';

import { WeaknessSet } from '@actions/types';
import Card, { CardsMap } from '@data/types/Card';

export interface WeaknessCriteria {
  traits: string[];
  multiplayer?: boolean;
  standalone?: boolean;
}

export function availableWeaknesses(
  weaknessSet: WeaknessSet,
  cards: CardsMap
): Card[] {
  const {
    packCodes,
    assignedCards,
  } = weaknessSet;
  const packSet = new Set(packCodes);
  return flatMap(cards, card =>
    card && (packSet.has(card.pack_code) && (assignedCards[card.code] || 0) < (card.quantity || 0)) ? card : []
  );
}

const INVESTIGATOR_FACTION = /^\[(.+?)\] investigator only\.$/m;

function matchingWeaknesses(
  investigator: Card | undefined,
  set: WeaknessSet,
  allWeaknesses: CardsMap,
  {
    traits,
    multiplayer,
    standalone,
  }: WeaknessCriteria,
  realTraits: boolean
) {
  return filter(availableWeaknesses(set, allWeaknesses), card => {
    const matchesTrait = (!traits || !traits.length) ||
      !!find(traits, trait => {
        const traitsToCheck = realTraits ?
          card.real_traits_normalized :
          card.traits_normalized;
        return (
          traitsToCheck &&
          traitsToCheck.indexOf(`#${trait.toLowerCase()}#`) !== -1
        );
      });
    const matchesMultiplayerOnly = multiplayer || !!(
      card.real_text && card.real_text.indexOf('Multiplayer only.') === -1
    );
    const matchesCampaignModeOnly = !standalone || !!(
      card.real_text && card.real_text.indexOf('Campaign Mode only.') === -1
    );
    const investigatorMatch = card.real_text && card.real_text.match(INVESTIGATOR_FACTION);
    const factionMatch = !investigatorMatch || !investigator || (investigator.factionCode() === investigatorMatch[1]);
    return matchesTrait && matchesMultiplayerOnly && matchesCampaignModeOnly && factionMatch;
  });
}

export function drawWeakness(
  investigator: Card | undefined,
  set: WeaknessSet,
  allWeaknesses: CardsMap,
  criteria: WeaknessCriteria,
  realTraits: boolean
): Card | undefined {
  const cards = shuffle(
    flatMap(
      matchingWeaknesses(investigator, set, allWeaknesses, criteria, realTraits),
      card => {
        return map(
          range(0, (card.quantity || 0) - (set.assignedCards[card.code] || 0)),
          () => card);
      }));
  return head(cards);
}

export default {
  drawWeakness,
  availableWeaknesses,
};
