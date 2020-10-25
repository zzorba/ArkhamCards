import React, { useCallback, useContext, useMemo, useState } from 'react';
import { find, map } from 'lodash';
import {
  Dimensions,
} from 'react-native';
import { TabView, SceneRendererProps, NavigationState, TabBar, Route } from 'react-native-tab-view';

import StyleContext from '@styles/StyleContext';

interface Props {
  tabs: {
    key: string;
    title: string;
    node: React.ReactNode;
  }[];
  onTabChange: (key: string) => void;
  scrollEnabled?: boolean;
}

interface State {
  index: number;
}

interface TabRoute extends Route {
  key: string;
  title: string;
}

const initialLayout = { width: Dimensions.get('window').width };

export default function ArkhamTabView({ tabs, onTabChange, scrollEnabled }: Props) {
  const { backgroundStyle, fontScale, colors } = useContext(StyleContext);
  const [index, setIndex] = useState(0);

  const onSetIndex = useCallback((index: number) => {
    setIndex(index);
    onTabChange(tabs[index].key);
  }, [onTabChange, setIndex, tabs]);

  const renderTabBar = useCallback((props: SceneRendererProps & {
    navigationState: NavigationState<TabRoute>;
  }) => {
    return (
      <TabBar
        {...props}
        scrollEnabled={scrollEnabled || (fontScale > 1)}
        activeColor={colors.navButton}
        inactiveColor={colors.lightText}
        indicatorStyle={{ backgroundColor: colors.navButton }}
        style={backgroundStyle}
      />
    );
  }, [backgroundStyle, fontScale, colors, scrollEnabled]);

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
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
}
