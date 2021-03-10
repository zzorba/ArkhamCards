import React, { useCallback, useContext, useMemo } from 'react';
import { filter, map } from 'lodash';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import { CampaignId, Deck, DeckId } from '@actions/types';
import { searchMatchesText } from '@components/core/searchHelpers';
import Card from '@data/types/Card';
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import StyleContext from '@styles/StyleContext';
import { useInvestigatorCards } from '@components/core/hooks';
import NewDeckListRow from './NewDeckListRow';
import MiniDeckT from '@data/interfaces/MiniDeckT';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useLatestDeck } from '@data/hooks';

interface Props {
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
}

function keyExtractor(item: Item) {
  return item.deckId.uuid;
}

function DeckListItem({
  deckId,
  deckClicked,
}: {
  deckId: DeckId;
  deckClicked: (deck: Deck, investigator?: Card) => void;
}) {
  const { width } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const investigators = useInvestigatorCards();
  const deck = useLatestDeck(deckId);
  if (!deck) {
    return null;
  }
  const investigator = deck && investigators && investigators[deck.investigator];
  return (
    <NewDeckListRow
      lang={lang}
      key={deckId.uuid}
      deck={deck}
      investigator={investigator}
      onPress={deckClicked}
      width={width}
    />
  );
}

export default function DeckList({ deckIds, header, searchTerm, refreshing, footer, onRefresh, onScroll, deckClicked }: Props) {
  const { colors, backgroundStyle } = useContext(StyleContext);
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

  const renderItem = useCallback(({ item: { deckId } }: {
    item: Item;
  }) => {
    return <DeckListItem key={deckId.uuid} deckId={deckId} deckClicked={deckClicked} />;
  }, [deckClicked]);

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