import { Alert } from 'react-native';
import { flatMap, forEach } from 'lodash';
import { t } from 'ttag';

import { Deck, Slots } from '@actions/types';
import Card, { CardsMap } from '@data/Card';

function weaknessString(deck: Deck, cards: CardsMap) {
  let weaknessCount = 0;
  const weaknesses: Card[] = [];
  const message = flatMap(
    deck.slots,
    (count, code) => {
      const card = cards[code];
      if (!card || !card.isBasicWeakness()) {
        return [];
      }
      weaknessCount += count;
      weaknesses.push(card);
      return `${deck.slots[code]}x - ${card.name}`;
    }
  ).join('\n');
  return {
    count: weaknessCount,
    message,
    weaknesses,
  };
}

export function maybeShowWeaknessPrompt(
  deck: Deck,
  cards: CardsMap,
  weaknessCards: Slots,
  updateWeaknessCards: (weaknessCards: Slots) => void
) {
  const { count, message, weaknesses } = weaknessString(deck, cards);
  if (weaknesses.length) {
    setTimeout(() => {
      Alert.alert(
        t`Adjust Weakness Set`,
        /* eslint-disable prefer-template */
        (count > 1 ?
          t`This deck contains several basic weaknesses` :
          t`This deck contains a basic weakness`) +
          '\n\n' +
          message +
          '\n\n' +
          (count > 1 ?
            t`Do you want to remove them from the campaign’s Basic Weakness set?` :
            t`Do you want to remove it from the campaign’s Basic Weakness set?`),
        [
          { text: t`Not Now`, style: 'cancel' },
          {
            text: t`Okay`,
            style: 'default',
            onPress: () => {
              const assignedCards = { ...weaknessCards };
              forEach(weaknesses, card => {
                const code = card.code;
                const count = deck.slots[code];
                if (!(code in assignedCards)) {
                  assignedCards[code] = 0;
                }
                if ((assignedCards[code] + count) > (card.quantity || 0)) {
                  assignedCards[code] = card.quantity || 0;
                } else {
                  assignedCards[code] += count;
                }
              });
              updateWeaknessCards(assignedCards);
            },
          },
        ],
      );
    }, 50);
  }
}