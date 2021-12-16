import React, { useCallback, useContext, useEffect, useRef, useMemo, useState } from 'react';
import { Animated, View, Keyboard, Platform, SectionList, SectionListRenderItemInfo, SectionListData, RefreshControl } from 'react-native';
import { IndexPath, LargeList } from 'react-native-largelist';
import { ScrollEvent } from 'react-native-spring-scrollview';

import { searchBoxHeight } from './SearchBox';
import { useArkhamLottieHeader } from './ArkhamLoadingSpinner';
import StyleContext from '@styles/StyleContext';
import { map } from 'lodash';

export interface BasicSection<Item, Header> {
  header?: Header;
  items: Item[];
}

interface Props<Item, Header> {
  heightForSection: (section: Header) => number;
  heightForItem: (item: Item) => number;

  renderSection: (section: Header) => React.ReactElement<any>;
  renderItem: (path: Item) => React.ReactElement<any>;

  renderHeader?: () => React.ReactElement<any>;
  renderFooter?: () => React.ReactElement<any>;

  onLoading?: () => void;
  onRefresh?: () => void;
  onScroll?: (evt: ScrollEvent) => any;
  updateTimeInterval: number;
  groupCount: number;
  groupMinHeight: number;
  data: BasicSection<Item, Header>[];

  refreshing: boolean;
  noSearch?: boolean;
  stickyHeaders?: boolean;
}

function ArkhamLargeListIos<Item, Header>({
  refreshing,
  noSearch,
  onRefresh,
  renderHeader,
  renderSection,
  heightForSection,
  renderItem,
  heightForItem,
  data,
  ...props
}: Props<Item, Header>) {
  const renderIndexPath = useCallback(({ section, row }: IndexPath) => {
    const item = data[section].items[row];
    return renderItem(item);
  }, [data, renderItem]);

  const renderSectionByIndex = useCallback((idx: number) => {
    const section = data[idx];
    if (section.header) {
      return renderSection(section.header);
    }
    return <View />;
  }, [data, renderSection]);

  const heightForSectionByIndex = useCallback((idx: number) => {
    const section = data[idx];
    if (section.header) {
      return heightForSection(section.header);
    }
    return 0;
  }, [data, heightForSection]);

  const heightForIndexPath = useCallback(({ section, row }: IndexPath) => {
    const item = data[section].items[row];
    return heightForItem(item);
  }, [data, heightForItem]);

  const [fakeRefresh, setFakeRefresh] = useState(false);
  const [debouncedRefreshing] = [refreshing || fakeRefresh] // , 50, { leading: true });
  const listRef = useRef<LargeList>(null);
  useEffect(() => {
    if (debouncedRefreshing) {
      listRef.current?.beginRefresh();
    } else {
      setTimeout(() => {
        listRef.current?.endRefresh();
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
  const ArkhamLottieHeader = useArkhamLottieHeader(noSearch);
  return (
    <LargeList
      {...props}
      ref={listRef}
      data={data}
      renderIndexPath={renderIndexPath}
      renderSection={renderSectionByIndex}
      heightForIndexPath={heightForIndexPath}
      heightForSection={heightForSectionByIndex}
      onRefresh={handleRefresh}
      renderHeader={renderHeader}
      refreshHeader={ArkhamLottieHeader}
      dragToHideKeyboard
      headerStickyEnabled={false}
    />
  );
}


interface SectionHeader<Header> {
  header?: Header;
}

function ArkhamLargeListAndroid<Item, Header>({
  refreshing,
  noSearch,
  onRefresh,
  renderHeader,
  renderFooter,
  data,
  renderItem,
  renderSection,
  onScroll,
}: Props<Item, Header>) {
  const { colors, fontScale } = useContext(StyleContext);
  const [fakeRefresh, setFakeRefresh] = useState(false);
  const [debouncedRefreshing] = [refreshing || fakeRefresh];
  const extraPaddingTop = useRef(new Animated.Value(0));
  const listRef = useRef<LargeList>(null);
  const height = searchBoxHeight(fontScale);
  useEffect(() => {
    if (debouncedRefreshing) {
      listRef.current?.beginRefresh();
      Animated.timing(extraPaddingTop.current, {
        toValue: height,
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
  }, [listRef, debouncedRefreshing, height]);
  const isRefreshing = useRef(debouncedRefreshing);
  isRefreshing.current = debouncedRefreshing;

  const renderSectionItem = useCallback(({ item }: SectionListRenderItemInfo<Item>) => {
    return renderItem(item);
  }, [renderItem]);
  const renderSectionHeader = useCallback((item: { section: SectionListData<Item, SectionHeader<Header>> }) => {
    if (item.section.header) {
      return renderSection(item.section.header);
    }
    return <View />;
  }, [renderSection]);
  const handleScrollBeginDrag = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const sections = useMemo(() => {
    return map(data, x => {
      return {
        header: x.header,
        data: x.items,
      };
    });
  }, [data]);

  const handleRefresh = useCallback(() => {
    setFakeRefresh(true);
    if (onRefresh) {
      onRefresh();
    }
    setTimeout(() => {
      setFakeRefresh(false);
    }, 500);
  }, [onRefresh]);
  /*
  return (
    <RefreshableWrapper
      Loader={() => <View style={{ paddingTop: noSearch ? 0 : SEARCH_BAR_HEIGHT }}><ArkhamLoadingSpinner autoPlay loop /></View>}
      isLoading={debouncedRefreshing}
      refreshHeight={SEARCH_BAR_HEIGHT}
      onRefresh={handleRefresh}
      EmptyComponent={<View />}
      defaultAnimationEnabled
    >
      <AnimatedSectionList
        sections={sections}
        onScroll={onScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        renderItem={renderSectionItem}
        renderSectionHeader={renderSectionHeader}
        scrollEventThrottle={1}
        removeClippedSubviews
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        initialNumToRender={20}
      />
    </RefreshableWrapper>
  );*/
  return (
    <SectionList
      sections={sections}
      refreshControl={
        <RefreshControl
          refreshing={debouncedRefreshing}
          onRefresh={handleRefresh}
          tintColor={colors.lightText}
          progressViewOffset={noSearch ? 0 : height}
        />
      }
      onScroll={onScroll}
      onScrollBeginDrag={handleScrollBeginDrag}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
      renderItem={renderSectionItem}
      renderSectionHeader={renderSectionHeader}
      scrollEventThrottle={1}
      removeClippedSubviews
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      initialNumToRender={20}
    />
  )
}


export default function ArkhamLargeList<Item, Header>(props: Props<Item, Header>) {
  if (Platform.OS === 'ios') {
    return <ArkhamLargeListIos {...props} />;
  }
  return <ArkhamLargeListAndroid {...props} />;
}
