import React, { useCallback, useContext, useRef, useMemo, useState } from 'react';
import { View, ListRenderItemInfo, ListRenderItem, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import RefreshableWrapper from 'react-native-fresh-refresh';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { map } from 'lodash';

import { searchBoxHeight } from './SearchBox';
import ArkhamLoadingSpinner from './ArkhamLoadingSpinner';
import StyleContext from '@styles/StyleContext';

interface Props<Item> {
  heightForItem?: (item: Item) => number;
  renderItem: (path: Item) => React.ReactElement<any> | null;

  renderHeader?: () => React.ReactElement<any> | null;
  renderFooter?: () => React.ReactElement<any> | null;

  onLoading?: () => void;
  onRefresh?: () => void;
  onScroll?: (evt: NativeSyntheticEvent<NativeScrollEvent>) => any;
  data: Item[];

  refreshing: boolean;
  noSearch?: boolean;
}

interface FlatItem<Item> {
  type: 'item';
  item: Item;
}
interface FlatLoader {
  type: 'loader';
}
type FlatDataItem<Item> = FlatItem<Item> | FlatLoader;

export default function ArkhamLargeList<Item>({
  refreshing,
  noSearch,
  onRefresh,
  renderHeader,
  renderFooter,
  data,
  renderItem,
  onScroll,
}: Props<Item>) {
  const { fontScale } = useContext(StyleContext);
  const [fakeRefresh, setFakeRefresh] = useState(false);
  const [debouncedRefreshing] = [refreshing || fakeRefresh];
  const isRefreshing = useRef(debouncedRefreshing);
  isRefreshing.current = debouncedRefreshing;

  const handleRefresh = useCallback(() => {
    setFakeRefresh(true);
    if (onRefresh) {
      onRefresh();
    }
    setTimeout(() => {
      setFakeRefresh(false);
    }, 500);
  }, [onRefresh]);

  const contentOffset = useSharedValue(0);
  const flatData: FlatDataItem<Item>[] = useMemo(() => {
    const loaderItems: FlatLoader[] = noSearch ? [] : [{ type: 'loader' }];
    const items: FlatItem<Item>[] = map(data, item => {
      return { type: 'item', item };
    });
    return [
      ...loaderItems,
      ...items,
    ];
  }, [data, noSearch]);
  const loader = useMemo(() => (
    <View style={[{
      height: searchBoxHeight(fontScale),
    }]}>
      <ArkhamLoadingSpinner
        autoPlay
        loop
      />
    </View>
  ), [fontScale]);
  const renderFlatItem: ListRenderItem<FlatDataItem<Item>> = useCallback(({ item }: ListRenderItemInfo<FlatDataItem<Item>>) => {
    switch (item.type) {
      case 'item':
        return renderItem(item.item);
      case 'loader':
        return loader;
      default:
        return null;
    }

  }, [loader, renderItem]);
  const renderLoader = useCallback(() => {
    return noSearch ? loader : <View />;
  }, [noSearch, loader]);
  return (
    <RefreshableWrapper
      contentOffset={contentOffset}
      defaultAnimationEnabled={false}
      Loader={renderLoader}
      isLoading={debouncedRefreshing}
      onRefresh={handleRefresh}
      refreshHeight={searchBoxHeight(fontScale)}
      bounces
      managedLoading
    >
      <Animated.FlatList
        data={flatData}
        scrollEventThrottle={16}
        onScroll={onScroll}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        renderItem={renderFlatItem}
        scrollsToTop
        removeClippedSubviews
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter || <View />}
        initialNumToRender={20}
      />
    </RefreshableWrapper>
  );
}
