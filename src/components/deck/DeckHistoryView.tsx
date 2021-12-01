import React, { useCallback, useContext, useMemo, useState } from 'react';
import { flatMap, forEach } from 'lodash';
import { FlatList, ListRenderItemInfo, RefreshControl } from 'react-native';
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
import LoadingSpinner from '@components/core/LoadingSpinner';

export interface DeckHistoryProps {
  id: DeckId;
  investigator: string;
  campaign?: MiniCampaignT;
}

interface HistoryDeckItemType {
  id: DeckId;
  deck: ParsedDeck;
  first?: boolean;
  last?: boolean;
  versionNumber: number;
}


function itemToKey({ deck }: HistoryDeckItemType): string {
  return deck.id.local ? deck.id.uuid : `${deck.id.id}`;
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
  const [deckHistory, loading, refreshDeckHistory] = useDeckHistory(id, investigator, campaign);
  const historicDecks: HistoryDeckItemType[] = useMemo(() => {
    if (!cards || !deckHistory) {
      return [];
    }
    const allDecks: HistoryDeckItemType[] = flatMap(deckHistory, deck => {
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
        return [{ id: deck.id, deck: parsedDeck, versionNumber: 0 }];
      }
      return [];
    });

    if (allDecks.length) {
      allDecks[0].first = true;
      allDecks[allDecks.length - 1].last = true;
      forEach(allDecks, (d, idx) => {
        d.versionNumber = allDecks.length - idx;
      });
    }
    return allDecks;
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

  const onDeckPress = useCallback((deckId: DeckId, parsedDeck: ParsedDeck) => {
    const options = getDeckOptions(colors, {
      title: parsedDeck.deck.name,
    }, parsedDeck.investigator);
    Navigation.push<DeckDetailProps>(componentId, {
      component: {
        name: 'Deck',
        passProps: {
          id: deckId,
          campaignId: campaign?.id,
        },
        options,
      },
    });
  }, [componentId, campaign, colors]);

  const renderItem = useCallback(({ item: { id, deck, versionNumber, first } }: ListRenderItemInfo<HistoryDeckItemType>) => {
    if (!cards) {
      return null;
    }
    return (
      <DeckProgressComponent
        key={deck.id.local ? deck.id.uuid : deck.id.id}
        deckId={id}
        title={deckTitle(deck, versionNumber)}
        onTitlePress={first ? undefined : onDeckPress}
        componentId={componentId}
        deck={deck.deck}
        parsedDeck={deck}
        cards={cards}
        editable={false}
        showBaseDeck
      />
    )
  }, [cards, componentId, deckTitle, onDeckPress]);
  const [refreshing, setRefreshing] = useState(false);
  const doRefresh = useCallback(async() => {
    if (refreshDeckHistory) {
      setRefreshing(true);
      await refreshDeckHistory();
      setRefreshing(false);
    }
  }, [refreshDeckHistory, setRefreshing]);

  if (!cards) {
    return <LoadingSpinner />;
  }
  return (
    <FlatList
      contentContainerStyle={[backgroundStyle, space.paddingSideS]}
      data={historicDecks}
      renderItem={renderItem}
      keyExtractor={itemToKey}
      refreshControl={refreshDeckHistory ? (
        <RefreshControl
          refreshing={refreshing || loading}
          onRefresh={doRefresh}
          tintColor={colors.lightText}
        />
      ) : undefined}
    />
  );
}
