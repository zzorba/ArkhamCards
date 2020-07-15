import React from 'react';
import { find, map } from 'lodash';
import {
  Dimensions,
} from 'react-native';
import { TabView, SceneRendererProps, NavigationState, TabBar, Route } from 'react-native-tab-view';

import COLORS from '@styles/colors';

interface Props {
  tabs: {
    key: string;
    title: string;
    node: React.ReactNode;
  }[];
  fontScale: number;
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

export default class ArkhamTabView extends React.Component<Props, State> {
  state: State = {
    index: 0,
  };

  _setIndex = (index: number) => {
    const { onTabChange, tabs } = this.props;
    this.setState({
      index,
    });
    onTabChange(tabs[index].key);
  };

  _renderTabBar = (props: SceneRendererProps & {
    navigationState: NavigationState<TabRoute>;
  }) => {
    const { fontScale } = this.props;
    return (
      <TabBar
        {...props}
        scrollEnabled={this.props.scrollEnabled || (fontScale > 1)}
        activeColor={COLORS.lightBlue}
        inactiveColor={COLORS.lightText}
        indicatorStyle={{ backgroundColor: COLORS.lightBlue }}
        style={{ backgroundColor: COLORS.background }}
      />
    );
  };

  _renderTab = ({ route }: { route: { key: string } }) => {
    const { tabs } = this.props;
    const tab = find(tabs, t => t.key === route.key);
    return tab && tab.node;
  };

  render() {
    const { tabs } = this.props;
    const { index } = this.state;
    const routes: TabRoute[] = map(tabs, tab => {
      return {
        key: tab.key,
        title: tab.title,
      };
    });

    return (
      <TabView
        renderTabBar={this._renderTabBar}
        navigationState={{ index, routes }}
        renderScene={this._renderTab}
        onIndexChange={this._setIndex}
        initialLayout={initialLayout}
      />
    );
  }
}
