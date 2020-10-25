import React, { useCallback, useContext, useMemo } from 'react';
import { concat, flatMap, findIndex, keys, map, sortBy } from 'lodash';
import { t } from 'ttag';

import { showCard, showCardSwipe } from '@components/nav/helper';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import CardSectionHeader from '@components/core/CardSectionHeader';
import { DeckChanges, ParsedDeck, Slots } from '@actions/types';
import Card, { CardsMap } from '@data/Card';
import StyleContext from '@styles/StyleContext';

interface Props {
  componentId: string;
  cards: CardsMap;
  parsedDeck: ParsedDeck;
  tabooSetId?: number;
  onTitlePress?: (deck: ParsedDeck) => void;
  renderFooter?: (slots?: Slots) => React.ReactNode;
  onDeckCountChange?: (code: string, count: number) => void;
  singleCardView?: boolean;
  title?: string;
  editable: boolean;
}

function hasChanges(changes?: DeckChanges): boolean {
  return !!(changes && (
    keys(changes.upgraded).length ||
    keys(changes.added).length ||
    keys(changes.removed).length ||
    keys(changes.exiled).length
  ));
}

export default function ChangesFromPreviousDeck({
  componentId,
  cards,
  parsedDeck,
  tabooSetId,
  onTitlePress,
  renderFooter,
  onDeckCountChange,
  singleCardView,
  title,
  editable,
}: Props) {
  const { colors } = useContext(StyleContext);
  const {
    investigator,
    changes,
    slots,
  } = parsedDeck;
  const getCards = useCallback((slots: Slots): Card[] => {
    if (!keys(slots).length) {
      return [];
    }
    return sortBy(
      sortBy(
        flatMap(keys(slots), code => cards[code] || []),
        card => card.xp || 0),
      card => card.name
    );
  }, [cards]);

  const allCards = useMemo(() => {
    if (!changes) {
      return [];
    }
    return concat(
      getCards(changes.upgraded),
      getCards(changes.added),
      getCards(changes.removed),
      getCards(changes.exiled)
    );
  }, [changes, getCards]);

  const showCardPressed = useCallback((card: Card) => {
    if (singleCardView) {
      showCard(componentId, card.code, card, colors, true);
    } else {
      showCardSwipe(
        componentId,
        map(allCards, card => card.code),
        findIndex(allCards, c => c.code === card.code),
        colors,
        allCards,
        true,
        tabooSetId,
        slots,
        onDeckCountChange,
        investigator,
        renderFooter
      );
    }
  }, [colors, allCards, componentId, investigator, slots, tabooSetId, renderFooter, onDeckCountChange, singleCardView]);

  const renderSection = useCallback((slots: Slots, id: string, title: string) => {
    const { investigator } = parsedDeck;
    const cards = getCards(slots);
    if (!cards.length) {
      return null;
    }

    return (
      <React.Fragment>
        <CardSectionHeader
          investigator={investigator}
          section={{ title }}
        />
        { map(cards, card => (
          <CardSearchResult
            key={`${id}-${card.code}`}
            onPress={showCardPressed}
            card={card}
            count={slots[card.code]}
            deltaCountMode
          />
        )) }
      </React.Fragment>
    );
  }, [parsedDeck.investigator, getCards]);

  const handleTitlePress = useCallback(() => {
    if (onTitlePress) {
      onTitlePress(parsedDeck);
    }
  }, [onTitlePress, parsedDeck]);

  const editsSection = useMemo(() => {
    if (changes && hasChanges(changes)) {
      return (
        <>
          { renderSection(changes.upgraded, 'upgrade', t`Upgraded cards`) }
          { renderSection(changes.added, 'added', t`Added cards`) }
          { renderSection(changes.removed, 'removed', t`Removed cards`) }
          { renderSection(changes.exiled, 'exiled', t`Exiled cards`) }
        </>
      );
    }
    if (!changes) {
      return null;
    }
    if (!editable) {
      return (
        <CardSectionHeader
          investigator={investigator}
          section={{ title: t`No Changes` }}
        />
      );
    }
  }, [investigator, changes, editable]);

  if (!hasChanges(changes) && !title) {
    return null;
  }
  return (
    <>
      <CardSectionHeader
        investigator={investigator}
        section={{
          superTitle: title || t`Card changes`,
          onPress: onTitlePress ? handleTitlePress : undefined,
        }}
      />
      { editsSection }
    </>
  );
}
