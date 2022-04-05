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

interface BaseItem {
  layout?: { length: number; offset: number; index: number };
}

interface FlatItem<Item> extends BaseItem {
  type: 'item';
  item: Item;
}
interface FlatLoader extends BaseItem {
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
  heightForItem,
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
  const searchBarHeight = searchBoxHeight(fontScale);
  const flatData: FlatDataItem<Item>[] = useMemo(() => {
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
  const renderFlatItem: ListRenderItem<FlatDataItem<Item>> = useCallback(({ item }: ListRenderItemInfo<FlatDataItem<Item>>) => {
    switch (item.type) {
      case 'item':
        return renderItem(item.item);
      default:
        return null;
    }
  }, [renderItem]);
  const getItemLayout = useCallback((data: null | undefined | Array<FlatDataItem<Item>>, idx: number) => {
    return data?.[idx].layout || { offset: 0, length: 0, index: idx };
  }, []);
  const loader = useMemo(() => (
    <View style={[{
      height: searchBarHeight,
    }]}>
      <ArkhamLoadingSpinner
        autoPlay
        loop
      />
    </View>
  ), [searchBarHeight]);
  const renderLoader = useCallback(() => {
    return noSearch ? loader : <View />;
  }, [noSearch, loader]);

  const renderRealHeader = useCallback(() => {
    return (
      <View>
        { !noSearch && loader }
        { renderHeader?.() }
      </View>
    );
  }, [noSearch, loader, renderHeader]);
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
        getItemLayout={heightForItem ? getItemLayout : undefined}
        ListHeaderComponent={renderRealHeader}
        ListFooterComponent={renderFooter || <View />}
        initialNumToRender={20}
        maxToRenderPerBatch={40}
        updateCellsBatchingPeriod={10}
      />
    </RefreshableWrapper>
  );
}
