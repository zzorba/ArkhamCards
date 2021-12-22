import { useCallback, useEffect, useReducer } from 'react';
import { flatMap, forEach, uniqBy, filter } from 'lodash';
import { t } from 'ttag';

import { Deck, Slots, getDeckId } from '@actions/types';
import Card, { CardsMap } from '@data/types/Card';
import { ShowAlert } from '@components/deck/dialogs';
import { useComponentVisible } from '@components/core/hooks';

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
      return `${deck.slots?.[code] || 0}x - ${card.name}`;
    }
  ).join('\n');
  return {
    count: weaknessCount,
    message,
    weaknesses,
  };
}

export function useMaybeShowWeaknessPrompt(componentId: string, checkForWeakness: (deck: Deck) => void): (deck: Deck) => void {
  const [newDecks, updateNewDeck] = useReducer((decks: Deck[], { type, deck }: { type: 'add' | 'remove'; deck: Deck }) => {
    switch (type) {
      case 'add':
        return uniqBy([...decks, deck], d => getDeckId(d).uuid);
      case 'remove':
        return filter(decks, d => getDeckId(d).uuid !== getDeckId(deck).uuid);
    }
  }, []);
  const componentVisible = useComponentVisible(componentId);
  useEffect(() => {
    if (componentVisible && newDecks.length) {
      const deck = newDecks[0];
      checkForWeakness(deck);
      updateNewDeck({ type: 'remove', deck });
    }
  }, [newDecks, componentVisible, checkForWeakness]);

  return useCallback((deck: Deck) => {
    updateNewDeck({ type: 'add', deck });
  }, [updateNewDeck]);
}

export function maybeShowWeaknessPrompt(
  deck: Deck,
  cards: CardsMap,
  weaknessCards: Slots,
  updateWeaknessCards: (weaknessCards: Slots) => void,
  showAlert: ShowAlert
) {
  const { count, message, weaknesses } = weaknessString(deck, cards);
  if (weaknesses.length) {
    showAlert(
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
              const count = deck.slots?.[code] || 0;
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
  }
}