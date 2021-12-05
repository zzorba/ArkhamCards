import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, View, Text } from 'react-native';
import { IndexPath, LargeList } from 'react-native-largelist';
import { ScrollEvent } from 'react-native-spring-scrollview';
import { useDebounce } from 'use-debounce/lib';

import { SEARCH_BAR_HEIGHT } from './SearchBox';
import { useArkhamLottieHeader } from './ArkhamLoadingSpinner';
import StyleContext from '@styles/StyleContext';

export interface BasicSection<Item> {
  items: Item[];
}

interface Props<Item, Section extends BasicSection<Item>> {
  heightForSection: (section: number) => number;
  heightForIndexPath: (path: IndexPath) => number;

  renderSection: (section: number) => React.ReactElement<any>;
  renderIndexPath: (path: IndexPath) => React.ReactElement<any>;

  renderHeader?: () => React.ReactElement<any>;
  renderFooter?: () => React.ReactElement<any>;

  onLoading?: () => void;
  onRefresh?: () => void;
  onScroll?: (evt: ScrollEvent) => any;
  updateTimeInterval: number;
  groupCount: number;
  groupMinHeight: number;
  data: Section[];

  refreshing: boolean;
  noSearch?: boolean;
  hideLoadingMessage?: boolean;
}
export default function ArkhamLargeList<Item, Section extends BasicSection<Item>>({
  refreshing,
  hideLoadingMessage,
  noSearch,
  onRefresh,
  renderHeader,
  ...props
}: Props<Item, Section>) {
  const [fakeRefresh, setFakeRefresh] = useState(false);
  const [debouncedRefreshing] = [refreshing || fakeRefresh]; // useDebounce(refreshing || fakeRefresh, 50, { leading: true });
  const extraPaddingTop = useRef(new Animated.Value(0));
  const listRef = useRef<LargeList>(null);
  useEffect(() => {
    if (debouncedRefreshing) {
      listRef.current?.beginRefresh();
      Animated.timing(extraPaddingTop.current, {
        toValue: SEARCH_BAR_HEIGHT,
        duration: 0,
        useNativeDriver: false,
      }).start();
    } else {
      setTimeout(() => {
        listRef.current?.endRefresh();
        Animated.timing(extraPaddingTop.current, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }).start();
      }, 200);
    }
  }, [listRef, debouncedRefreshing]);
  const isRefreshing = useRef(debouncedRefreshing);
  isRefreshing.current = debouncedRefreshing;

  const handleRefresh = useCallback(() => {
    if (isRefreshing.current) {
      return;
    }
    setFakeRefresh(true);
    if (onRefresh) {
      onRefresh?.();
    }
    // Just let it spin for half a second
    setTimeout(() => {
      setFakeRefresh(false);
    }, 1000);
  }, [onRefresh, setFakeRefresh]);
  const listHeader = useCallback(() => {
    return (
      <>
        <Animated.View style={{ height: hideLoadingMessage ? 0 : extraPaddingTop.current }} />
        { !!renderHeader && renderHeader() }
      </>
    );
  }, [hideLoadingMessage, extraPaddingTop, renderHeader]);
  const ArkhamLottieHeader = useArkhamLottieHeader(noSearch, !!hideLoadingMessage);
  return (
    <LargeList
      {...props}
      ref={listRef}
      onRefresh={handleRefresh}
      renderHeader={listHeader}
      refreshHeader={ArkhamLottieHeader}
      dragToHideKeyboard
      headerStickyEnabled={false}
    />
  );
}