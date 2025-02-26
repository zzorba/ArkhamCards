import React, { useCallback, useContext, useRef, useMemo, useState } from 'react';
import { FlashList, ListRenderItemInfo, ListRenderItem } from '@shopify/flash-list';
import { FlatList, ListRenderItem as FlatListRenderItem, View, NativeSyntheticEvent, NativeScrollEvent, RefreshControl, Platform } from 'react-native';
import { map } from 'lodash';

import { searchBoxHeight } from './SearchBox';
import ArkhamLoadingSpinner from './ArkhamLoadingSpinner';
import StyleContext from '@styles/StyleContext';

interface ItemT<T extends string> {
  type: T;
}
interface Props<T extends string, Item extends ItemT<T>> {
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
  estimatedItemSize: number;
  onEndReachedThreshold?: number;
}

interface BaseItem {
  layout?: { length: number; offset: number; index: number };
}

interface FlatItem<T extends string, Item extends ItemT<T>> extends BaseItem {
  type: 'item';
  item: Item;
}
interface FlatLoader extends BaseItem {
  type: 'loader';
}
type FlatDataItem<T extends string, Item extends ItemT<T>> = FlatItem<T, Item> | FlatLoader;

export default function ArkhamLargeList<T extends string, Item extends ItemT<T>>({
  refreshing,
  noSearch,
  onLoading,
  onRefresh,
  renderHeader,
  renderFooter,
  data,
  renderItem,
  onScroll,
  heightForItem,
  estimatedItemSize,
  onEndReachedThreshold,
}: Props<T, Item>) {
  const { fontScale, colors } = useContext(StyleContext);
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

  const searchBarHeight = searchBoxHeight(fontScale);
  const flatData: FlatDataItem<T, Item>[] = useMemo(() => {
    let offset: number = 0;
    return map(data, (item, idx) => {
      const layout = heightForItem ? {
        index: idx,
        offset,
        length: heightForItem(item),
      } : undefined;
      if (layout) {
        offset += layout.length;
      }
      return {
        type: 'item',
        item,
        layout,
      };
    });
  }, [data, heightForItem]);
  const renderFlatItem: FlatListRenderItem<FlatDataItem<T, Item>> = useCallback(({ item }) => {
    switch (item.type) {
      case 'item':
        return renderItem(item.item);
      default:
        return null;
    }
  }, [renderItem]);
  const renderFlashItem: ListRenderItem<FlatDataItem<T, Item>> = useCallback(({ item }: ListRenderItemInfo<FlatDataItem<T, Item>>) => {
    switch (item.type) {
      case 'item':
        return renderItem(item.item);
      default:
        return null;
    }
  }, [renderItem]);

  const loader = useMemo(() => (
    <View style={[{
      height: searchBarHeight,
    }]}>
      <ArkhamLoadingSpinner
        autoPlay
        loop
        size="default"
      />
    </View>
  ), [searchBarHeight]);
  const renderRealHeader = useCallback(() => {
    return (
      <View>
        { !noSearch && loader }
        { renderHeader?.() }
      </View>
    );
  }, [noSearch, loader, renderHeader]);

  const getItemLayout = useCallback((data: null | undefined | ArrayLike<FlatDataItem<T, Item>>, idx: number): { length: number; offset: number; index: number } => {
    return data?.[idx].layout || { offset: 0, length: 0, index: idx };
   }, []);

  const getItemType = useCallback((item: FlatDataItem<T, Item>) => item.type === 'item' ? item.item.type : item.type, []);
  if (Platform.OS === 'android') {
    return (
      <FlatList
        data={flatData}
        // contentContainerStyle={{ minHeight: height }}
        refreshControl={
          <RefreshControl
            progressViewOffset={noSearch ? 0 : searchBarHeight}
            refreshing={debouncedRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.background}
          />
        }
        scrollEventThrottle={16}
        onScroll={onScroll}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        renderItem={renderFlatItem}
        scrollsToTop
        onEndReached={onLoading}
        removeClippedSubviews
        onEndReachedThreshold={onEndReachedThreshold ?? 0.5}
        getItemLayout={heightForItem ? getItemLayout : undefined}
        ListHeaderComponent={renderRealHeader}
        ListFooterComponent={renderFooter || <View />}
        initialNumToRender={20}
        maxToRenderPerBatch={40}
        updateCellsBatchingPeriod={10}
      />
    );
  }
  return (
    <FlashList
      data={flatData}
      // contentContainerStyle={{ minHeight: height }}
      refreshControl={
        <RefreshControl
          progressViewOffset={noSearch ? 0 : searchBarHeight}
          refreshing={debouncedRefreshing}
          onRefresh={handleRefresh}
          tintColor={colors.background}
        />
      }
      scrollEventThrottle={16}
      onScroll={onScroll}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
      renderItem={renderFlashItem}
      scrollsToTop
      onEndReached={onLoading}
      removeClippedSubviews
      getItemType={getItemType}
      estimatedItemSize={estimatedItemSize}
      onEndReachedThreshold={onEndReachedThreshold ?? 0.5}
      // getItemLayout={heightForItem ? getItemLayout : undefined}
      ListHeaderComponent={renderRealHeader}
      ListFooterComponent={renderFooter || <View />}
      // initialNumToRender={20}
      // maxToRenderPerBatch={40}
      // updateCellsBatchingPeriod={10}
    />
  );
}
