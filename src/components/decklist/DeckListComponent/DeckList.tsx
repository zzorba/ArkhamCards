import React, { useCallback, useContext, useMemo, useState } from 'react';
import { find, filter, map, take, uniq, flatMap, every } from 'lodash';

import { Campaign } from '@actions/types';
import { searchMatchesText } from '@components/core/searchHelpers';
import Card from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import { Toggles, useInvestigators, usePlayerCardsFunc, useSettingValue } from '@components/core/hooks';
import NewDeckListRow from './NewDeckListRow';
import MiniDeckT from '@data/interfaces/MiniDeckT';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useLatestDeck } from '@data/hooks';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import { useDebounce } from 'use-debounce/lib';
import useSingleCard from '@components/card/useSingleCard';
import ArkhamLargeList from '@components/core/ArkhamLargeList';

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
  selectedTags: Toggles;
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
  const [investigator] = useSingleCard(deck?.investigator, 'player', deck?.deck.taboo_id || 0);
  if (!deck) {
    return null;
  }
  return (
    <NewDeckListRow
      key={deckId.id.uuid}
      lang={lang}
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
  selectedTags,
}: Props) {
  const lowMemory = useSettingValue('low_memory');
  const investigatorCodes = useMemo(() => uniq(map(deckIds, deckId => deckId.investigator)), [deckIds]);
  const investigators = useInvestigators(investigatorCodes);
  const allItems = useMemo(() => {
    const chosenTags = flatMap(selectedTags, (v, tag) => !!v ? tag : []);
    return map(
      filter(deckIds, deckId => {
        if (chosenTags.length && !every(chosenTags, tag => !!find(deckId.tags, t => tag === t))) {
          return false;
        }
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
  }, [deckIds, deckClicked, investigators, searchTerm, selectedTags]);
  const [numDecks, setNumDecks] = useState(10);
  const items = useMemo(() => {
    if (!lowMemory) {
      return allItems;
    }
    return take(allItems, numDecks);
  }, [lowMemory, allItems, numDecks])
  const onLoadMore = useCallback(() => {
    setNumDecks(numDecks + 10);
  }, [numDecks, setNumDecks]);

  usePlayerCardsFunc(() => take(uniq(map(items, deck => deck.deckId.investigator)), 15), [items]);
  const renderItem = useCallback(({ deckId }: { deckId: MiniDeckT }) => {
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
  const renderHeader = useCallback(() => header || null, [header]);
  const renderFooter = useCallback(() => footer(items.length === 0), [footer, items.length]);
  return (
    <ArkhamLargeList
      refreshing={debouncedRefreshing}
      onRefresh={onRefresh}
      onScroll={onScroll}
      onLoading={lowMemory && numDecks < allItems.length ? onLoadMore : undefined}
      data={items}
      renderItem={renderItem}
      renderHeader={renderHeader}
      renderFooter={renderFooter}
    />
  );
}
