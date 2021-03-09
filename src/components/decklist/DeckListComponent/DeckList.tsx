import React, { useCallback, useContext, useMemo } from 'react';
import { filter, map } from 'lodash';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import { Campaign, CampaignId, Deck, DeckId, DecksMap } from '@actions/types';
import { searchMatchesText } from '@components/core/searchHelpers';
import Card from '@data/types/Card';
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import StyleContext from '@styles/StyleContext';
import { useInvestigatorCards } from '@components/core/hooks';
import NewDeckListRow from './NewDeckListRow';
import { getDeck } from '@reducers';
import MiniDeckT from '@data/interfaces/MiniDeckT';
import LanguageContext from '@lib/i18n/LanguageContext';

interface Props {
  lang: string;
  deckIds: MiniDeckT[];
  header?: React.ReactElement;
  footer: (empty: boolean) => React.ReactElement;
  searchTerm: string;
  deckToCampaignId?: { [uuid: string]: CampaignId };
  onRefresh?: () => void;
  refreshing?: boolean;
  onScroll: (...args: any[]) => void;
  deckClicked: (deck: Deck, investigator?: Card) => void;
}

interface Item {
  key: string;
  deckId: DeckId;
  deckClicked: (deck: Deck, investigator?: Card) => void;
}

function keyExtractor(item: Item) {
  return item.deckId.uuid;
}

function DeckListItem({ item: {
  deckId,
  deckClicked,
} }: {
  item: Item;
}) {
  const { backgroundStyle, colors, width } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const investigators = useInvestigatorCards();
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
      deckToCampaignId={deckToCampaignId}
      investigator={investigator}
      onPress={deckClicked}
      width={width}
    />
  );
}

export default function DeckList({ deckIds, header, searchTerm, deckToCampaignId, refreshing, footer, onRefresh, onScroll, deckClicked }: Props) {
  const { colors, backgroundStyle, width } = useContext(StyleContext);
  const investigators = useInvestigatorCards();
  const items = useMemo(() => {
    return map(
      filter(deckIds, deckId => {
        const investigator = investigators && investigators[deckId.investigator];
        if (!investigator) {
          return true;
        }
        return searchMatchesText(searchTerm, [deckId.name, investigator.name]);
      }), deckId => {
        return {
          key: `${deckId}`,
          deckId: deckId.id,
          deckClicked,
        };
      });
  }, [deckIds, deckClicked, investigators, searchTerm]);

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
      renderItem={DeckListItem}
      keyExtractor={keyExtractor}
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