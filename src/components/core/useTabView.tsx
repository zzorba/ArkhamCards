import React, { useCallback, useContext, useMemo, useState } from 'react';
import { find, map } from 'lodash';
import { Text } from 'react-native';
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

export default function useTabView({ tabs, onTabChange, scrollEnabled }: Props): [React.ReactNode, (index: number) => void] {
  const { fontScale, colors, width } = useContext(StyleContext);
  const [index, setIndex] = useState(0);

  const onIndexChange = useCallback((index: number) => {
    setIndex(index);
    onTabChange && onTabChange(tabs[index].key);
  }, [onTabChange, setIndex, tabs]);

  const tabBarOptions = useMemo(() => {
    const options: Record<string, {
      label: ({ focused, color }: { focused: boolean; color: string }) => React.ReactNode;
    }> = {};
    tabs.forEach(tab => {
      options[tab.key] = {
        label: ({ color }) => (
          <Text style={{
            fontFamily: 'Alegreya-Medium',
            fontSize: 18 * fontScale,
            lineHeight: 20 * fontScale,
            color,
            margin: 4,
            backgroundColor: 'transparent',
          }}>
            {tab.title}
          </Text>
        ),
      };
    });
    return options;
  }, [tabs, fontScale]);

  const renderTabBar = useCallback((props: SceneRendererProps & {
    navigationState: NavigationState<TabRoute>;
  }) => {
    return (
      <TabBar
        // {...props}
        layout={props.layout}
        position={props.position}
        jumpTo={props.jumpTo}
        navigationState={props.navigationState}
        scrollEnabled={scrollEnabled || (!isTablet && fontScale > 1)}
        activeColor={colors.D20}
        inactiveColor={colors.M}
        indicatorStyle={{ backgroundColor: colors.D20 }}
        style={{ backgroundColor: colors.L20 }}
        options={tabBarOptions}
      />
    );
  }, [fontScale, colors, scrollEnabled, tabBarOptions]);

  const renderTab = useCallback(({ route }: { route: { key: string } }) => {
    const tab = find(tabs, t => t.key === route.key);
    return tab?.node;
  }, [tabs]);

  const routes: TabRoute[] = useMemo(() => map(tabs, tab => {
    return {
      key: tab.key,
      title: tab.title,
    };
  }), [tabs]);
  const tabView = useMemo(() => {
    if (!width || routes.length === 0) {
      return null;
    }
    return (
      <TabView
        key="tab"
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderTab}
        onIndexChange={onIndexChange}
        initialLayout={{ width }}
      />
    );
  }, [width, renderTabBar, index, routes, renderTab, onIndexChange]);

  return [tabView, setIndex];
}
