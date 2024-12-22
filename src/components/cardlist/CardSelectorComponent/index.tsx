import React, { ReactNode, useCallback, useContext, useMemo } from 'react';
import { concat, filter, flatMap, keys, sortBy, uniq } from 'lodash';

import { Slots } from '@actions/types';
import Card from '@data/types/Card';
import CardToggleRow from './CardToggleRow';
import { showCard } from '@components/nav/helper';
import StyleContext from '@styles/StyleContext';
import { usePlayerCards } from '@components/core/hooks';

interface Props {
  componentId: string;
  slots: Slots;
  fixedSlots?: Slots;
  counts: Slots;
  toggleCard?: (code: string, value: boolean) => void;
  updateCount?: (card: Card, value: number) => void;
  filterCard?: (card: Card) => boolean;
  header?: ReactNode;
  forceHeader?: boolean;
  locked?: boolean;
}


export default function CardSelectorComponent({ componentId, slots, fixedSlots, counts, toggleCard, updateCount, filterCard, forceHeader, header, locked }: Props) {
  const { colors } = useContext(StyleContext);

  const onChange = useCallback((card: Card, count: number) => {
    if (toggleCard) {
      toggleCard(card.code, count > 0);
    } else if (updateCount) {
      updateCount(card, count);
    }
  }, [updateCount, toggleCard]);

  const onCardPress = useCallback((card: Card) => {
    showCard(componentId, card.code, card, colors, { showSpoilers: true });
  }, [colors, componentId]);
  const initialCards = useMemo(() => uniq(concat(keys(slots), flatMap(counts, (count, code) => count > 0 ? code : []))), [slots, counts])
  const [cards] = usePlayerCards(initialCards, false);
  const fixedCards = useMemo(() => {
    if (!cards) {
      return [];
    }
    return sortBy(
      filter(
        initialCards,
        code => {
          const card = cards[code];
          return (
            !!card &&
            (fixedSlots?.[code] ?? 0) > 0
          );
        }
      ),
      code => {
        const card = cards[code];
        return (card && card.name) || '';
      }
    );
  }, [cards, fixedSlots, initialCards]);
  const matchingCards = useMemo(() => {
    if (!cards) {
      return [];
    }
    return sortBy(
      filter(
        initialCards,
        code => {
          const card = cards[code];
          return (
            (locked ? counts[code] > 0 : slots[code] > 0) &&
            !!card &&
            (!filterCard || filterCard(card))
          );
        }
      ),
      code => {
        const card = cards[code];
        return (card && card.name) || '';
      }
    );
  }, [slots, initialCards, counts, locked, cards, filterCard]);

  if ((!matchingCards.length && !fixedCards.length) || !cards) {
    if (forceHeader) {
      return (
        <>
          { header }
        </>
      );
    }
    return null;
  }

  return (
    <>
      { header }
      { flatMap(fixedCards, (code, idx) => {
        const last = !matchingCards.length && (idx === fixedCards.length - 1);
        const card = cards[code];
        if (!card) {
          return null;
        }
        return (
          <CardToggleRow
            key={code}
            card={card}
            onPress={onCardPress}
            count={fixedSlots?.[code] ?? 0}
            limit={fixedSlots?.[code] ?? 0}
            locked
            disabled
            last={last}
          />
        );
      })}
      { flatMap(matchingCards, (code, idx) => {
        const last = idx === (matchingCards.length - 1);
        const card = cards[code];
        if (!card) {
          return null;
        }
        return (
          <CardToggleRow
            key={code}
            card={card}
            onPress={onCardPress}
            onChange={onChange}
            count={counts[code] || 0}
            limit={toggleCard ? 1 : slots[code]}
            locked={locked}
            last={last}
          />
        );
      }) }
    </>
  );
}
