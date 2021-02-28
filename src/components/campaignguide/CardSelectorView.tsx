import React, { useCallback, useContext, useMemo, useState } from 'react';
import { ScrollView, ActivityIndicator, Platform, View, StyleSheet } from 'react-native';
import { filter, keyBy, mapValues, keys, map, uniqBy } from 'lodash';
import { Brackets } from 'typeorm/browser';
import { t } from 'ttag';

import CollapsibleSearchBox from '@components/core/CollapsibleSearchBox';
import BasicButton from '@components/core/BasicButton';
import CardSectionHeader from '@components/core/CardSectionHeader';
import CardToggleRow from '@components/cardlist/CardSelectorComponent/CardToggleRow';
import { NavigationProps } from '@components/nav/types';
import { searchMatchesText } from '@components/core/searchHelpers';
import Card from '@data/types/Card';
import { combineQueries, MYTHOS_CARDS_QUERY, where } from '@data/sqlite/query';
import space from '@styles/space';
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import StyleContext from '@styles/StyleContext';
import useCardsFromQuery from '@components/card/useCardsFromQuery';

export interface CardSelectorProps {
  query?: Brackets;
  selection: string[];
  onSelect: (cards: string[]) => void;
  includeStoryToggle: boolean;
  uniqueName: boolean;
}

type Props = CardSelectorProps & NavigationProps;

export default function CardSelectorView({ query, selection: initialSelection, onSelect, includeStoryToggle, uniqueName }: Props) {
  const { colors } = useContext(StyleContext);
  const [selection, setSelection] = useState(mapValues(keyBy(initialSelection), () => true));
  const [storyToggle, setStoryToggle] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const onChange = useCallback((card: Card, count: number) => {
    const newSelection = {
      ...selection,
    };
    if (count > 0) {
      newSelection[card.code] = true;
    } else {
      delete newSelection[card.code];
    }
    setSelection(newSelection);
    onSelect(keys(newSelection));
  }, [selection, onSelect]);

  const renderCards = useCallback((cards: Card[], loading: boolean) => {
    if (loading) {
      return (
        <ActivityIndicator
          style={space.paddingM}
          color={colors.lightText}
          size="large"
          animating
        />
      );
    }
    return map(
      uniqBy(
        filter(cards, card => searchMatchesText(searchTerm, [card.name])),
        card => uniqueName ? card.name : card.code),
      card => (
        <CardToggleRow
          key={card.code}
          card={card}
          onChange={onChange}
          count={selection[card.code] ? 1 : 0}
          limit={1}
        />
      )
    );
  }, [uniqueName, selection, searchTerm, colors, onChange]);

  const toggleStoryCards = useCallback(() => {
    setStoryToggle(true);
  }, [setStoryToggle]);

  const storyQuery = useMemo(() => {
    return combineQueries(
      MYTHOS_CARDS_QUERY,
      query ? [query] : [],
      'and'
    );
  }, [query]);

  const [storyCards, storyCardsLoading] = useCardsFromQuery({ query: storyQuery });
  const storyCardsSection = useMemo(() => {
    if (!includeStoryToggle) {
      return null;
    }
    if (!storyToggle) {
      return (
        <BasicButton
          title={t`Show story assets from other campaigns`}
          onPress={toggleStoryCards}
        />
      );
    }
    return (
      <>
        <CardSectionHeader
          section={{ title: t`Story assets` }}
        />
        { renderCards(storyCards, storyCardsLoading) }
      </>
    );
  }, [renderCards, storyCards, storyCardsLoading, storyToggle, includeStoryToggle, toggleStoryCards]);

  const normalCardsQuery = useMemo(() => {
    return combineQueries(
      where('c.encounter_code is null'),
      query ? [query] : [],
      'and'
    );
  }, [query]);

  const [normalCards, normalCardsLoading] = useCardsFromQuery({ query: normalCardsQuery });
  return (
    <CollapsibleSearchBox
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      prompt={t`Search`}
    >
      { onScroll => (
        <ScrollView
          onScroll={onScroll}
          contentInset={Platform.OS === 'ios' ? { top: SEARCH_BAR_HEIGHT } : undefined}
          contentOffset={Platform.OS === 'ios' ? { x: 0, y: -SEARCH_BAR_HEIGHT } : undefined}
        >
          { Platform.OS === 'android' && <View style={styles.searchBarPadding} /> }
          { renderCards(normalCards, normalCardsLoading) }
          { storyCardsSection }
        </ScrollView>
      ) }
    </CollapsibleSearchBox>
  );
}

const styles = StyleSheet.create({
  searchBarPadding: {
    height: SEARCH_BAR_HEIGHT,
  },
});
