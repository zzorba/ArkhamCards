import React, { useCallback, useContext, useMemo } from 'react';
import { filter, map } from 'lodash';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import { Campaign, Deck, DeckId, DecksMap } from '@actions/types';
import { searchMatchesText } from '@components/core/searchHelpers';
import Card from '@data/types/Card';
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import StyleContext from '@styles/StyleContext';
import { useInvestigatorCards } from '@components/core/hooks';
import NewDeckListRow from './NewDeckListRow';
import { getDeck } from '@reducers';

interface Props {
  lang: string;
  deckIds: DeckId[];
  header?: React.ReactElement;
  footer: (empty: boolean) => React.ReactElement;
  searchTerm: string;
  deckToCampaign?: { [uuid: string]: Campaign };
  onRefresh?: () => void;
  refreshing?: boolean;
  decks: DecksMap;
  onScroll: (...args: any[]) => void;
  deckClicked: (deck: Deck, investigator?: Card) => void;
}

interface Item {
  key: string;
  deckId: DeckId;
}

function keyExtractor(item: Item) {
  return item.deckId.uuid;
}

export default function DeckList({ lang, deckIds, header, searchTerm, deckToCampaign, refreshing, decks, footer, onRefresh, onScroll, deckClicked }: Props) {
  const { backgroundStyle, colors, width } = useContext(StyleContext);
  const investigators = useInvestigatorCards();
  const renderItem = useCallback(({ item: { deckId } }: { item: Item }) => {
    const deck = getDeck(decks, deckId);
    if (!deck) {
      return null;
    }
    const investigator = deck && investigators && investigators[deck.investigator_code];
    return (
      <NewDeckListRow
        lang={lang}
        key={deckId.uuid}
        deck={deck}
        previousDeck={deck.previousDeckId ? getDeck(decks, deck.previousDeckId) : undefined}
        deckToCampaign={deckToCampaign}
        investigator={investigator}
        onPress={deckClicked}
        width={width}
      />
    );
  }, [decks, investigators, deckToCampaign, deckClicked, lang, width]);
  const items = useMemo(() => {
    return map(
      filter(deckIds, deckId => {
        const deck = getDeck(decks, deckId);
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
      initialNumToRender={8}
      contentInset={Platform.OS === 'ios' ? { top: SEARCH_BAR_HEIGHT } : undefined}
      contentOffset={Platform.OS === 'ios' ? { x: 0, y: -SEARCH_BAR_HEIGHT } : undefined}
      onScroll={onScroll}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
      style={[styles.container, backgroundStyle]}
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      extraData={decks}
      ListHeaderComponent={header}
      removeClippedSubviews
      ListFooterComponent={footer(items.length === 0)}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});