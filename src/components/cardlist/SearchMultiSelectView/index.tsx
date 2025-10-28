import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { filter, map } from 'lodash';
import {
  Keyboard,
  Platform,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { t } from 'ttag';

import CollapsibleSearchBox from '@components/core/CollapsibleSearchBox';
import SelectRow from './SelectRow';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { searchBoxHeight } from '@components/core/SearchBox';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';
import HeaderButton from '@components/core/HeaderButton';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export interface SearchSelectProps {
  title: string;
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

// eslint-disable-next-line react/prop-types
export default function SearchMultiSelectView() {
  const route = useRoute<RouteProp<BasicStackParamList, 'SearchFilters.Chooser'>>();
  const { placeholder, onChange, values, selection: initialSelection, capitalize } = route.params;
  const navigation = useNavigation();
  const { backgroundStyle, fontScale } = useContext(StyleContext);
  const [selection, setSelection] = useState<string[]>(initialSelection || []);
  const [search, setSearch] = useState('');
  const clearSelection = useCallback(() => setSelection([]), [setSelection]);
  const hasSelection = selection.length > 0;
  useEffect(() => {
    onChange(selection);
  }, [selection, onChange]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: hasSelection ? () => (
        <HeaderButton
          text={t`Clear`}
          color={COLORS.M}
          onPress={clearSelection}
          accessibilityLabel={t`Clear`}
        />
      ) : undefined,
    });
  }, [hasSelection, navigation, clearSelection]);

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
      return <View style={{ height: searchBoxHeight(fontScale) }} />;
    }
    return null;
  }, [fontScale]);

  const selectedSet = useMemo(() => new Set(selection), [selection]);
  const data = useMemo(() => map(filteredValues, value => {
    return {
      value,
      selected: selectedSet.has(value),
    };
  }), [filteredValues, selectedSet]);
  const height = searchBoxHeight(fontScale);
  return (
    <CollapsibleSearchBox
      prompt={placeholder}
      searchTerm={search}
      onSearchChange={setSearch}
    >
      { onScroll => (
        <Animated.FlatList
          contentInset={Platform.OS === 'ios' ? { top: height } : undefined}
          contentOffset={Platform.OS === 'ios' ? { x: 0, y: -height } : undefined}
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

function options<T extends BasicStackParamList>({ route }: { route: RouteProp<T, 'SearchFilters.Chooser'> }): NativeStackNavigationOptions {
  const title = route.params?.title;
  return { title: title ? t`Select ${title}` : t`Select` };
};

SearchMultiSelectView.options = options;