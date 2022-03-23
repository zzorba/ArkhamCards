import React, { ReactNode, useCallback, useContext, useMemo } from 'react';
import { filter, flatMap, keys, sortBy } from 'lodash';

import { Slots } from '@actions/types';
import Card from '@data/types/Card';
import CardToggleRow from './CardToggleRow';
import { showCard } from '@components/nav/helper';
import StyleContext from '@styles/StyleContext';
import { usePlayerCardsFunc } from '@components/core/hooks';

interface Props {
  componentId: string;
  slots: Slots;
  counts: Slots;
  toggleCard?: (code: string, value: boolean) => void;
  updateCount?: (card: Card, value: number) => void;
  filterCard?: (card: Card) => boolean;
  header?: ReactNode;
  forceHeader?: boolean;
  locked?: boolean;
}


export default function CardSelectorComponent({ componentId, slots, counts, toggleCard, updateCount, filterCard, forceHeader, header, locked }: Props) {
  const { colors } = useContext(StyleContext);

  const onChange = useCallback((card: Card, count: number) => {
    if (toggleCard) {
      toggleCard(card.code, count > 0);
    } else if (updateCount) {
      updateCount(card, count);
    }
  }, [updateCount, toggleCard]);

  const onCardPress = useCallback((card: Card) => {
    showCard(componentId, card.code, card, colors, true);
  }, [colors, componentId]);
  const [cards] = usePlayerCardsFunc(() => keys(slots), [slots]);
  const matchingCards = useMemo(() => {
    if (!cards) {
      return [];
    }
    return sortBy(
      filter(
        keys(slots),
        code => {
          const card = cards[code];
          return (
            slots[code] > 0 &&
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
  }, [slots, cards, filterCard]);

  if (!matchingCards.length || !cards) {
    if (forceHeader) {
      return <>{ header }</>;
    }
    return null;
  }

  return (
    <>
      { header }
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
