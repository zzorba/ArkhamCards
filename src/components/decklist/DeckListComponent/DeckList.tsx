import React, { useCallback, useContext, useMemo } from 'react';
import { filter, map, take, uniq } from 'lodash';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import { Campaign } from '@actions/types';
import { searchMatchesText } from '@components/core/searchHelpers';
import Card, { CardsMap } from '@data/types/Card';
import { searchBoxHeight } from '@components/core/SearchBox';
import StyleContext from '@styles/StyleContext';
import { useInvestigators, usePlayerCardsFunc } from '@components/core/hooks';
import NewDeckListRow from './NewDeckListRow';
import MiniDeckT from '@data/interfaces/MiniDeckT';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useLatestDeck } from '@data/hooks';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import { useDebounce } from 'use-debounce/lib';
import useSingleCard from '@components/card/useSingleCard';

interface Props {
  deckIds: MiniDeckT[];
  header?: React.ReactElement;
  footer: (empty: boolean) => React.ReactElement;
  searchTerm: string;
  deckToCampaign?: { [uuid: string]: Campaign };
  onRefresh?: () => void;
  refreshing?: boolean;
  onScroll: (...args: any[]) => void;
  deckClicked: (deck: LatestDeckT, investigator: Card | undefined) => void;
}

interface Item {
  key: string;
  deckId: MiniDeckT;
}

function keyExtractor(item: Item) {
  return item.deckId.id.uuid;
}

function DeckListItem({
  deckId,
  deckClicked,
  deckToCampaign,
}: {
  deckId: MiniDeckT;
  deckClicked: (deck: LatestDeckT, investigator: Card | undefined) => void;
  deckToCampaign?: { [uuid: string]: Campaign };
}) {
  const { width } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const deck = useLatestDeck(deckId, deckToCampaign);
  const [investigator] = useSingleCard(deck?.investigator, 'player', deck?.deck.taboo_id);
  if (!deck) {
    return null;
  }
  return (
    <NewDeckListRow
      lang={lang}
      key={deckId.id.uuid}
      deck={deck}
      investigator={investigator}
      onPress={deckClicked}
      width={width}
    />
  );
}

const MemoDeckListItem = React.memo(DeckListItem);

export default function DeckList({
  deckIds, header, searchTerm, refreshing, deckToCampaign,
  footer, onRefresh, onScroll, deckClicked,
}: Props) {
  const { colors, backgroundStyle, fontScale } = useContext(StyleContext);
  const investigatorCodes = useMemo(() => uniq(map(deckIds, deckId => deckId.investigator)), [deckIds]);
  const investigators = useInvestigators(investigatorCodes);
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
          key: `${deckId.id.uuid}`,
          deckId: deckId,
          deckClicked,
        };
      });
  }, [deckIds, deckClicked, investigators, searchTerm]);
  usePlayerCardsFunc(() => take(uniq(map(items, deck => deck.deckId.investigator)), 15), [items]);

  const renderItem = useCallback(({ item: { deckId } }: {
    item: Item;
  }) => {
    return (
      <MemoDeckListItem
        key={deckId.id.uuid}
        deckId={deckId}
        deckClicked={deckClicked}
        deckToCampaign={deckToCampaign}
      />
    );
  }, [deckClicked, deckToCampaign]);
  const [debouncedRefreshing] = useDebounce(!!refreshing, 100, { leading: true });
  const height = searchBoxHeight(fontScale);
  return (
    <FlatList
      refreshControl={
        <RefreshControl
          refreshing={debouncedRefreshing}
          onRefresh={onRefresh}
          tintColor={colors.lightText}
          progressViewOffset={height}
        />
      }
      initialNumToRender={8}
      contentInset={Platform.OS === 'ios' ? { top: height } : undefined}
      contentOffset={Platform.OS === 'ios' ? { x: 0, y: -height } : undefined}
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