import React, { useCallback, useContext, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { filter, keyBy, mapValues, keys, map, uniqBy, sumBy } from 'lodash';
import { Brackets } from 'typeorm/browser';
import Animated from 'react-native-reanimated';
import { t } from 'ttag';

import CollapsibleSearchBox from '@components/core/CollapsibleSearchBox';
import CardSectionHeader from '@components/core/CardSectionHeader';
import CardToggleRow from '@components/cardlist/CardSelectorComponent/CardToggleRow';
import { NavigationProps } from '@components/nav/types';
import { searchMatchesText } from '@components/core/searchHelpers';
import Card from '@data/types/Card';
import { combineQueries, MYTHOS_CARDS_QUERY, where } from '@data/sqlite/query';
import space from '@styles/space';
import { searchBoxHeight } from '@components/core/SearchBox';
import StyleContext from '@styles/StyleContext';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import ArkhamButton from '@components/core/ArkhamButton';
import { QuerySort } from '@data/sqlite/types';

export interface CardSelectorProps {
  query?: Brackets;
  selection: string[];
  selectedCards?: Card[];
  onSelect: (codes: string[], cards: Card[]) => void;
  includeStoryToggle: boolean;
  uniqueName: boolean;
  max?: number;
}

type Props = CardSelectorProps & NavigationProps;
const SORT: QuerySort[] = [
  { s: 'c.renderName', direction: 'ASC' },
  { s: 'c.xp', direction: 'ASC' },
];

export default function CardSelectorView({ max, query, selection: initialSelection, selectedCards: initialSelectedCards, onSelect, includeStoryToggle, uniqueName }: Props) {
  const { colors, fontScale } = useContext(StyleContext);
  const [{ selection, selectedCards }, setSelection] = useState({
    selection: mapValues(keyBy(initialSelection), () => true),
    selectedCards: initialSelectedCards || [],
  });
  const [storyToggle, setStoryToggle] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectedCount = useMemo(() => {
    return sumBy(keys(selection), (key) => {
      return selection[key] ? 1 : 0;
    });
  }, [selection]);

  const onChange = useCallback((card: Card, count: number) => {
    const newSelection = {
      ...selection,
    };
    const newSelectedCards = count > 0 ? [...selectedCards, card] : filter(selectedCards, c => c.code !== card.code);
    if (count > 0) {
      newSelection[card.code] = true;
    } else {
      delete newSelection[card.code];
    }
    setSelection({ selection: newSelection, selectedCards: newSelectedCards });
    onSelect(keys(newSelection), newSelectedCards);
  }, [selection, onSelect, selectedCards]);

  const renderCards = useCallback((cards: Card[], loading: boolean) => {
    if (loading || cards.length === 0) {
      return (
        <ActivityIndicator
          style={space.paddingM}
          color={colors.darkText}
          size="small"
          animating
        />
      );
    }
    return map(
      uniqBy(
        filter(cards, card => searchMatchesText(searchTerm, [card.name])),
        card => uniqueName ? card.name : card.code),
      card => {
        const selected = selection[card.code];
        return (
          <CardToggleRow
            key={card.code}
            card={card}
            onChange={onChange}
            count={selected ? 1 : 0}
            limit={1}
            disabled={!!max ? (!selected && selectedCount >= max) : false}
          />
        );
      }
    );
  }, [uniqueName, max, selectedCount, selection, searchTerm, colors, onChange]);

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
        <ArkhamButton
          icon="show"
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

  const [normalCards, normalCardsLoading] = useCardsFromQuery({ query: normalCardsQuery, sort: SORT });
  const height = searchBoxHeight(fontScale);
  return (
    <CollapsibleSearchBox
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      prompt={t`Search`}
    >
      { onScroll => (
        <Animated.ScrollView
          onScroll={onScroll}
          contentInset={Platform.OS === 'ios' ? { top: height } : undefined}
          contentOffset={Platform.OS === 'ios' ? { x: 0, y: -height } : undefined}
        >
          { Platform.OS === 'android' && <View style={{ height }} /> }
          { renderCards(normalCards, normalCardsLoading) }
          { storyCardsSection }
        </Animated.ScrollView>
      ) }
    </CollapsibleSearchBox>
  );
}
