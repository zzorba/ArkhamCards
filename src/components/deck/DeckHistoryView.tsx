import React, { useCallback, useContext, useMemo, useState, useLayoutEffect } from 'react';
import { flatMap, forEach } from 'lodash';
import { FlatList, ListRenderItemInfo, RefreshControl } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';

import { t } from 'ttag';

import DeckProgressComponent from './DeckProgressComponent';
import { getDeckScreenOptions } from '@components/nav/helper';
import { DeckId, ParsedDeck } from '@actions/types';
import { parseDeck } from '@lib/parseDeck';
import StyleContext from '@styles/StyleContext';
import { useLatestDecksCards } from '@components/core/hooks';
import { useSimpleDeckEdits } from '@components/deck/hooks';
import space from '@styles/space';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import { useDeckHistory } from '@data/hooks';
import LoadingSpinner from '@components/core/LoadingSpinner';
import LanguageContext from '@lib/i18n/LanguageContext';
import Card from '@data/types/Card';

export interface DeckHistoryProps {
  id: DeckId;
  investigator: Card;
  campaign?: MiniCampaignT;
  headerBackgroundColor?: string;
}

interface HistoryDeckItemType {
  id: DeckId;
  deck: ParsedDeck;
  first?: boolean;
  last?: boolean;
  versionNumber: number;
}


function itemToKey({ deck }: HistoryDeckItemType): string {
  return deck.id?.local ? deck.id.uuid : `${deck.id?.id}`;
}

export default function DeckHistoryView() {
  const route = useRoute<RouteProp<RootStackParamList, 'Deck.History'>>();
  const navigation = useNavigation();
  const { id, investigator, campaign } = route.params;
  const deckEdits = useSimpleDeckEdits(id);
  const { backgroundStyle, colors } = useContext(StyleContext);
  const { listSeperator } = useContext(LanguageContext);
  const [deckHistory, loading, refreshDeckHistory] = useDeckHistory(id, investigator.code, campaign);
  const [cards] = useLatestDecksCards(deckHistory, false, deckHistory?.length ? (deckHistory[0].deck.taboo_id || 0) : 0);

  useLayoutEffect(() => {
    const screenOptions = getDeckScreenOptions(
      colors,
      { title: t`Upgrade History` },
      investigator
    );
    navigation.setOptions(screenOptions);
  }, [navigation, colors, investigator]);

  const historicDecks: HistoryDeckItemType[] = useMemo(() => {
    if (!cards || !deckHistory) {
      return [];
    }
    const allDecks: HistoryDeckItemType[] = flatMap(deckHistory, deck => {
      const currentDeck = deck.id.uuid === id.uuid;
      const currentXpAdjustment = currentDeck ? deckEdits?.xpAdjustment : undefined;
      const parsedDeck = parseDeck(
        deck.deck.investigator_code,
        (currentDeck && deckEdits?.meta) || (deck.deck.meta || {}),
        (currentDeck && deckEdits?.slots) || deck.deck.slots || {},
        (currentDeck && deckEdits?.ignoreDeckLimitSlots) || deck.deck.ignoreDeckLimitSlots,
        (currentDeck && deckEdits?.side) || deck.deck.sideSlots || {},
        cards,
        listSeperator,
        deck.previousDeck,
        currentXpAdjustment !== undefined ? currentXpAdjustment : (deck.deck.xp_adjustment || 0),
        deck.deck
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
  }, [id, deckHistory, cards, deckEdits, listSeperator]);
  const deckTitle = useCallback((deck: ParsedDeck, versionNumber: number): string => {
    if (!deck.changes) {
      return t`Original Deck`;
    }
    if (!deck.id || deck.id.uuid === id.uuid) {
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
    navigation.navigate('Deck', {
      id: deckId,
      campaignId: campaign?.id,
      title: parsedDeck.investigator.front.name,
      subtitle: parsedDeck.deck?.name || '',
      headerBackgroundColor: investigator ? colors.faction[investigator.factionCode()].background : undefined,
    });
  }, [investigator, colors, navigation, campaign]);

  const renderItem = useCallback(({ item: { id, deck, versionNumber, first } }: ListRenderItemInfo<HistoryDeckItemType>) => {
    if (!cards || !deck.id || !deck.deck) {
      return null;
    }
    return (
      <DeckProgressComponent
        key={deck.id.local ? deck.id.uuid : deck.id.id}
        deckId={id}
        title={deckTitle(deck, versionNumber)}
        onTitlePress={first ? undefined : onDeckPress}
        deck={deck.deck}
        parsedDeck={deck}
        cards={cards}
        editable={false}
        showBaseDeck
      />
    )
  }, [cards, deckTitle, onDeckPress]);
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
