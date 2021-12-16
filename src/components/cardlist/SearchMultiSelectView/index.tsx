import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { filter, map } from 'lodash';
import {
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import CollapsibleSearchBox from '@components/core/CollapsibleSearchBox';
import { NavigationProps } from '@components/nav/types';
import SelectRow from './SelectRow';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import { useNavigationButtonPressed } from '@components/core/hooks';

export interface SearchSelectProps {
  placeholder: string;
  onChange: (selection: string[]) => void;
  values: string[];
  selection?: string[];
  capitalize?: boolean;
}

interface Item {
  value: string;
  selected: boolean;
}

function keyExtractor(item: Item) {
  return item.value;
}

export default function SearchMultiSelectView({ componentId, placeholder, onChange, values, selection: initialSelection, capitalize }: NavigationProps & SearchSelectProps) {
  const { backgroundStyle } = useContext(StyleContext);
  const [selection, setSelection] = useState<string[]>(initialSelection || []);
  const [search, setSearch] = useState('');
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'clear') {
      setSelection([]);
    }
  }, componentId, [setSelection]);
  const hasSelection = selection.length > 0;
  useEffect(() => {
    onChange(selection);
  }, [selection, onChange]);
  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: hasSelection ?
          [{
            text: t`Clear`,
            id: 'clear',
            color: COLORS.M,
            accessibilityLabel: t`Clear`,
          }] : [],
      },
    });
  }, [hasSelection, componentId]);

  const onSelectChanged = useCallback((value: string, selected: boolean) => {
    Keyboard.dismiss();
    const newSelection = selected ?
      [...selection, value] :
      filter(selection, v => v !== value);

    setSelection(newSelection);
  }, [setSelection, selection]);

  const renderItem = useCallback(({ item }: { item: Item }) => {
    return (
      <SelectRow
        value={item.value}
        selected={item.selected}
        onSelectChanged={onSelectChanged}
        capitalize={capitalize}
      />
    );
  }, [capitalize, onSelectChanged]);
  const filteredValues = useMemo(() => {
    if (!search) {
      return values;
    }
    const lowerCaseSearch = search.toLowerCase();
    return filter(values, value => search === '' || (!!value && value.toLowerCase().includes(lowerCaseSearch)));
  }, [values, search]);

  const header = useMemo(() => {
    if (Platform.OS === 'android') {
      return <View style={styles.searchBarPadding} />;
    }
    return null;
  }, []);

  const selectedSet = useMemo(() => new Set(selection), [selection]);
  const data = useMemo(() => map(filteredValues, value => {
    return {
      value,
      selected: selectedSet.has(value),
    };
  }), [filteredValues, selectedSet]);
  return (
    <CollapsibleSearchBox
      prompt={placeholder}
      searchTerm={search}
      onSearchChange={setSearch}
    >
      { onScroll => (
        <FlatList
          contentInset={Platform.OS === 'ios' ? { top: SEARCH_BAR_HEIGHT } : undefined}
          contentOffset={Platform.OS === 'ios' ? { x: 0, y: -SEARCH_BAR_HEIGHT } : undefined}
          contentContainerStyle={backgroundStyle}
          data={data}
          onScroll={onScroll}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          maxToRenderPerBatch={30}
          initialNumToRender={30}
          onEndReachedThreshold={0.5}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          ListHeaderComponent={header}
        />
      ) }
    </CollapsibleSearchBox>
  );
}

const styles = StyleSheet.create({
  searchBarPadding: {
    height: SEARCH_BAR_HEIGHT,
  },
});
