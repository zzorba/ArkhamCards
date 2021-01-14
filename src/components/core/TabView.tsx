import React, { useCallback, useContext, useMemo, useState } from 'react';
import { find, map } from 'lodash';
import { Dimensions } from 'react-native';
import { TabView, SceneRendererProps, NavigationState, TabBar, Route } from 'react-native-tab-view';

import StyleContext from '@styles/StyleContext';
import { isTablet } from '@styles/space';

interface Props {
  tabs: {
    key: string;
    title: string;
    node: React.ReactNode;
  }[];
  onTabChange?: (key: string) => void;
  scrollEnabled?: boolean;
}

interface TabRoute extends Route {
  key: string;
  title: string;
}

const initialLayout = { width: Dimensions.get('window').width };

export default function ArkhamTabView({ tabs, onTabChange, scrollEnabled }: Props) {
  const { fontScale, colors } = useContext(StyleContext);
  const [index, setIndex] = useState(0);

  const onIndexChange = useCallback((index: number) => {
    setIndex(index);
    onTabChange && onTabChange(tabs[index].key);
  }, [onTabChange, setIndex, tabs]);

  const renderTabBar = useCallback((props: SceneRendererProps & {
    navigationState: NavigationState<TabRoute>;
  }) => {
    return (
      <TabBar
        {...props}
        scrollEnabled={scrollEnabled || (!isTablet && fontScale > 1)}
        activeColor={colors.D20}
        inactiveColor={colors.M}
        indicatorStyle={{ backgroundColor: colors.D20 }}
        style={{ backgroundColor: colors.L20 }}
        labelStyle={{
          fontFamily: 'Alegreya-Regular',
          fontSize: 14 * fontScale,
          lineHeight: 16 * fontScale,
        }}
      />
    );
  }, [fontScale, colors, scrollEnabled]);

  const renderTab = useCallback(({ route }: { route: { key: string } }) => {
    const tab = find(tabs, t => t.key === route.key);
    return tab && tab.node;
  }, [tabs]);

  const routes: TabRoute[] = useMemo(() => map(tabs, tab => {
    return {
      key: tab.key,
      title: tab.title,
    };
  }), [tabs]);
  const navigationState = useMemo(() => {
    return { index, routes };
  }, [index, routes]);
  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={navigationState}
      renderScene={renderTab}
      onIndexChange={onIndexChange}
      initialLayout={initialLayout}
    />
  );
}
