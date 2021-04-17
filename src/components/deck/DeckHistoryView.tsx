import React, { useCallback, useContext, useMemo } from 'react';
import { flatMap, map } from 'lodash';
import { ScrollView } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import DeckProgressComponent from './DeckProgressComponent';
import { DeckDetailProps } from './DeckDetailView';
import { getDeckOptions } from '@components/nav/helper';
import { NavigationProps } from '@components/nav/types';
import { DeckId, ParsedDeck } from '@actions/types';
import { parseDeck } from '@lib/parseDeck';
import StyleContext from '@styles/StyleContext';
import { usePlayerCards } from '@components/core/hooks';
import { useSimpleDeckEdits } from '@components/deck/hooks';
import space from '@styles/space';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import { useDeckHistory } from '@data/hooks';

export interface DeckHistoryProps {
  id: DeckId;
  investigator: string;
  campaign?: MiniCampaignT;
}

export default function DeckHistoryView({
  componentId,
  id,
  investigator,
  campaign,
}: DeckHistoryProps & NavigationProps) {
  const deckEdits = useSimpleDeckEdits(id);
  const { backgroundStyle, colors } = useContext(StyleContext);
  const cards = usePlayerCards();
  const deckHistory = useDeckHistory(id, investigator, campaign);
  const historicDecks = useMemo(() => {
    if (!cards || !deckHistory) {
      return [];
    }
    return flatMap(deckHistory, deck => {
      const currentDeck = deck.id.uuid === id.uuid;
      const currentXpAdjustment = currentDeck ? deckEdits?.xpAdjustment : undefined;
      const parsedDeck = parseDeck(
        deck.deck,
        (currentDeck && deckEdits?.meta) || (deck.deck.meta || {}),
        (currentDeck && deckEdits?.slots) || deck.deck.slots || {},
        (currentDeck && deckEdits?.ignoreDeckLimitSlots) || deck.deck.ignoreDeckLimitSlots,
        cards,
        deck.previousDeck,
        currentXpAdjustment !== undefined ? currentXpAdjustment : (deck.deck.xp_adjustment || 0),
      );
      if (parsedDeck) {
        return [parsedDeck];
      }
      return [];
    });
  }, [id, deckHistory, cards, deckEdits]);
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
          campaignId: campaign?.id,
        },
        options: getDeckOptions(colors, { title: parsedDeck.deck.name }, parsedDeck.investigator),
      },
    });
  }, [componentId, campaign, colors]);
  if (!cards) {
    return null;
  }
  return (
    <ScrollView contentContainerStyle={[backgroundStyle, space.paddingSideS]}>
      { map(historicDecks, (deck, idx) => (
        <DeckProgressComponent
          key={idx}
          title={deckTitle(deck, historicDecks.length - idx)}
          onTitlePress={idx === 0 ? undefined : onDeckPress}
          componentId={componentId}
          deck={deck.deck}
          parsedDeck={deck}
          cards={cards}
          editable={false}
          showBaseDeck
        />
      )) }
    </ScrollView>
  );
}
