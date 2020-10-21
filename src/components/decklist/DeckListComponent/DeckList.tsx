import React, { useCallback, useContext, useMemo } from 'react';
import { filter, map } from 'lodash';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import { Campaign, Deck, DecksMap } from '@actions/types';
import { searchMatchesText } from '@components/core/searchHelpers';
import DeckListRow from '@components/decklist/DeckListRow';
import Card from '@data/Card';
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import StyleContext from '@styles/StyleContext';
import { useInvestigatorCards } from '@components/core/hooks';

interface Props {
  lang: string;
  deckIds: number[];
  header?: React.ReactElement;
  footer: (empty: boolean) => React.ReactElement;
  searchTerm: string;
  deckToCampaign?: { [id: number]: Campaign };
  onRefresh?: () => void;
  refreshing?: boolean;
  decks: DecksMap;
  onScroll: (...args: any[]) => void;
  deckClicked: (deck: Deck, investigator?: Card) => void;
}

interface Item {
  key: string;
  deckId: number;
}

export default function DeckList({
  lang,
  deckIds,
  header,
  footer,
  searchTerm,
  deckToCampaign,
  onRefresh,
  refreshing,
  decks,
  onScroll,
  deckClicked,
}: Props) {
  const { backgroundStyle, colors } = useContext(StyleContext);
  const investigators = useInvestigatorCards();
  const renderItem = useCallback(({ item: { deckId } }: { item: Item }) => {
    const deck = decks[deckId];
    if (!deck) {
      return null;
    }
    const investigator = deck && investigators && investigators[deck.investigator_code];
    return (
      <DeckListRow
        lang={lang}
        key={deckId}
        deck={deck}
        previousDeck={deck.previous_deck ? decks[deck.previous_deck] : undefined}
        deckToCampaign={deckToCampaign}
        investigator={investigator}
        onPress={deckClicked}
      />
    );
  }, [decks, investigators, deckToCampaign, deckClicked, lang]);
  const items = useMemo(() => {
    return map(
      filter(deckIds, deckId => {
        const deck = decks[deckId];
        const investigator = deck && investigators && investigators[deck.investigator_code];
        if (!deck || !investigator) {
          return true;
        }
        return searchMatchesText(searchTerm, [deck.name, investigator.name]);
      }), deckId => {
        return {
          key: `${deckId}`,
          deckId,
        };
      });
  }, [deckIds, decks, investigators, searchTerm]);

  return (
    <FlatList
      refreshControl={
        <RefreshControl
          refreshing={!!refreshing}
          onRefresh={onRefresh}
          tintColor={colors.lightText}
          progressViewOffset={SEARCH_BAR_HEIGHT}
        />
      }
      contentInset={Platform.OS === 'ios' ? { top: SEARCH_BAR_HEIGHT } : undefined}
      contentOffset={Platform.OS === 'ios' ? { x: 0, y: -SEARCH_BAR_HEIGHT } : undefined}
      onScroll={onScroll}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
      style={[styles.container, backgroundStyle]}
      data={items}
      renderItem={renderItem}
      extraData={decks}
      ListHeaderComponent={header}
      ListFooterComponent={footer(items.length === 0)}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});