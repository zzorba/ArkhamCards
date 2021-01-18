import React, { useCallback, useContext, useMemo } from 'react';
import { map } from 'lodash';
import { ScrollView } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useSelector } from 'react-redux';
import { t } from 'ttag';

import DeckProgressComponent from './DeckProgressComponent';
import { DeckDetailProps } from './DeckDetailView';
import { getDeckOptions } from '@components/nav/helper';
import { NavigationProps } from '@components/nav/types';
import { Deck, DeckId, getDeckId, ParsedDeck } from '@actions/types';
import { getAllDecks, getDeck } from '@reducers';
import { parseDeck } from '@lib/parseDeck';
import StyleContext from '@styles/StyleContext';
import { usePlayerCards } from '@components/core/hooks';
import { useSimpleDeckEdits } from '@components/deck/hooks';
import space from '@styles/space';

export interface DeckHistoryProps {
  id: DeckId;
}

export default function DeckHistoryView({
  componentId,
  id,
}: DeckHistoryProps & NavigationProps) {
  const deckEdits = useSimpleDeckEdits(id);
  const { backgroundStyle, colors } = useContext(StyleContext);
  const cards = usePlayerCards();
  const decks = useSelector(getAllDecks);
  const historicDecks = useMemo(() => {
    if (!cards) {
      return [];
    }
    const decksResult: ParsedDeck[] = [];
    let deck: Deck | undefined = getDeck(decks, id);
    while (deck) {
      const currentDeck = getDeckId(deck).uuid === id.uuid;
      const previousDeck: Deck | undefined = (
        deck.previousDeckId ? getDeck(decks, deck.previousDeckId) : undefined
      );
      const currentXpAdjustment = currentDeck ? deckEdits?.xpAdjustment : undefined;
      const parsedDeck = parseDeck(
        deck,
        (currentDeck && deckEdits?.meta) || (deck.meta || {}),
        (currentDeck && deckEdits?.slots) || deck.slots,
        (currentDeck && deckEdits?.ignoreDeckLimitSlots) || deck.ignoreDeckLimitSlots,
        cards,
        previousDeck,
        currentXpAdjustment !== undefined ? currentXpAdjustment : (deck.xp_adjustment || 0),
      );
      if (parsedDeck) {
        decksResult.push(parsedDeck);
      }
      deck = previousDeck;
    }
    return decksResult;
  }, [id, decks, cards, deckEdits]);

  const deckTitle = useCallback((deck: ParsedDeck, versionNumber: number): string => {
    if (!deck.changes) {
      return t`Original Deck`;
    }
    if (deck.id.uuid === id.uuid) {
      if (deck.changes) {
        return t`Latest Deck: ${deck.changes.spentXp} of ${deck.availableExperience} XP`;
      }
      return t`Latest Deck: ${deck.availableExperience} XP`;
    }
    const humanVersionNumber = versionNumber - 1;
    if (deck.changes) {
      return t`Upgrade ${humanVersionNumber}: ${deck.changes.spentXp} of ${deck.availableExperience} XP`;
    }
    return t`Upgrade ${humanVersionNumber}: ${deck.availableExperience} XP`;
  }, [id]);

  const onDeckPress = useCallback((parsedDeck: ParsedDeck) => {
    Navigation.push<DeckDetailProps>(componentId, {
      component: {
        name: 'Deck',
        passProps: {
          id: parsedDeck.id,
          isPrivate: true,
        },
        options: getDeckOptions(colors, { title: parsedDeck.deck.name }, parsedDeck.investigator),
      },
    });
  }, [componentId, colors]);
  if (!cards) {
    return null;
  }
  return (
    <ScrollView contentContainerStyle={[backgroundStyle, space.paddingSideS]}>
      { map(historicDecks, (deck, idx) => (
        <DeckProgressComponent
          key={deck.id.uuid}
          title={deckTitle(deck, historicDecks.length - idx)}
          onTitlePress={idx === 0 ? undefined : onDeckPress}
          componentId={componentId}
          deck={deck.deck}
          parsedDeck={deck}
          cards={cards}
          editable={false}
          isPrivate
        />
      )) }
    </ScrollView>
  );
}
