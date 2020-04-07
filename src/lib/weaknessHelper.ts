import { filter, find, flatMap, head, map, range, shuffle } from 'lodash';
import Realm from 'realm';

import { WeaknessSet } from 'actions/types';
import Card from 'data/Card';

export interface WeaknessCriteria {
  traits: string[];
  multiplayer?: boolean;
  standalone?: boolean;
}

export function availableWeaknesses(
  weaknessSet: WeaknessSet,
  cards: Card[] | Realm.Results<Card>
): Card[] {
  const {
    packCodes,
    assignedCards,
  } = weaknessSet;
  const packSet = new Set(packCodes);
  return filter(cards, card => (
    packSet.has(card.pack_code) &&
    (assignedCards[card.code] || 0) < (card.quantity || 0)
  ));
}

function matchingWeaknesses(
  set: WeaknessSet,
  allWeaknesses: Card[] | Realm.Results<Card>,
  {
    traits,
    multiplayer,
    standalone,
  }: WeaknessCriteria
) {
  return filter(availableWeaknesses(set, allWeaknesses), card => {
    const matchesTrait = (!traits || !traits.length) ||
      !!find(traits, trait => (
        card.traits_normalized &&
        card.traits_normalized.indexOf(`#${trait.toLowerCase()}#`) !== -1)
      );
    const matchesMultiplayerOnly = multiplayer || !!(
      card.real_text && card.real_text.indexOf('Multiplayer only.') === -1
    );
    const matchesCampaignModeOnly = !standalone || !!(
      card.real_text && card.real_text.indexOf('Campaign Mode only.') === -1
    );

    return matchesTrait && matchesMultiplayerOnly && matchesCampaignModeOnly;
  });
}

export function drawWeakness(
  set: WeaknessSet,
  allWeaknesses: Card[] | Realm.Results<Card>,
  criteria: WeaknessCriteria
): Card | undefined {
  const cards = shuffle(
    flatMap(matchingWeaknesses(set, allWeaknesses, criteria),
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
