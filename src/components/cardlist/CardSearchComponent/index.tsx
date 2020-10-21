import React, { ReactNode } from 'react';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Brackets } from 'typeorm/browser';
import { Navigation, EventSubscription, OptionsTopBarButton, OptionsTopBar } from 'react-native-navigation';
import { t } from 'ttag';

import {
  SortType,
  Slots,
} from '@actions/types';
import Card from '@data/Card';
import XpChooser from '@components/filter/CardFilterView/XpChooser';
import CardSearchResultsComponent from '@components/cardlist/CardSearchResultsComponent';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import { FilterState } from '@lib/filters';
import { removeFilterSet, clearFilters, syncFilterSet, toggleMythosMode, toggleFilter, updateFilter } from '@components/filter/actions';
import { getTabooSet, getFilterState, getMythosMode, getCardSort, AppState } from '@reducers';
import MythosButton from './MythosButton';
import TuneButton from './TuneButton';
import SortButton from './SortButton';
import ToggleButton from '@components/core/ToggleButton';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import space from '@styles/space';


interface ReduxProps {
  filters?: FilterState;
  mythosMode: boolean;
  selectedSort?: SortType;
}

interface ReduxActionProps {
  toggleFilter: (id: string, key: keyof FilterState, value: boolean) => void;
  updateFilter: (id: string, key: keyof FilterState, value: any) => void;
  clearFilters: (id: string, clearTraits?: string[]) => void;
  syncFilterSet: (id: string, filters: FilterState) => void;
  removeFilterSet: (id: string) => void;
  toggleMythosMode: (id: string, value: boolean) => void;
}

interface OwnProps {
  componentId: string;
  baseQuery?: Brackets;
  mythosToggle?: boolean;
  showNonCollection?: boolean;
  tabooSetOverride?: number;
  sort?: SortType;

  investigator?: Card;
  originalDeckSlots?: Slots;
  deckCardCounts?: Slots;
  onDeckCountChange?: (code: string, count: number) => void;
  limits?: Slots;
  renderFooter?: (slots?: Slots, controls?: React.ReactNode) => ReactNode;
  hideVersatile?: boolean;
  setHideVersatile?: (value: boolean) => void;
  modal?: boolean;
  storyOnly?: boolean;
}

type Props = OwnProps &
  ReduxProps &
  ReduxActionProps &
  DimensionsProps;

interface State {
  visible: boolean;
  filters?: FilterState;
}

interface CardSearchNavigationOptions {
  componentId: string;
  modal?: boolean;
  lightButton?: boolean;
  mythosToggle?: boolean;
  baseQuery?: Brackets;
  title?: string;
}
export function navigationOptions(
  {
    componentId,
    modal,
    lightButton,
    mythosToggle,
    baseQuery,
  }: CardSearchNavigationOptions
){
  const mythosButton: OptionsTopBarButton = {
    id: 'mythos',
    component: {
      name: 'MythosButton',
      passProps: {
        filterId: componentId,
        lightButton,
      },
      width: MythosButton.WIDTH,
      height: MythosButton.HEIGHT,
    },
    enabled: true,
    accessibilityLabel: t`Encounter Card Toggle`,
  };

  const rightButtons: OptionsTopBarButton[] = [{
    id: 'filter',
    component: {
      name: 'TuneButton',
      passProps: {
        filterId: componentId,
        baseQuery,
        modal,
        lightButton,
      },
      width: TuneButton.WIDTH,
      height: TuneButton.HEIGHT,
    },
    accessibilityLabel: t`Filters`,
    enabled: true,
  }, {
    id: 'sort',
    component: {
      name: 'SortButton',
      passProps: {
        filterId: componentId,
        lightButton,
      },
      width: SortButton.WIDTH,
      height: SortButton.HEIGHT,
    },
    accessibilityLabel: t`Sort`,
  }];
  if (mythosToggle && Platform.OS === 'android') {
    rightButtons.push(mythosButton);
  }
  const topBarOptions: OptionsTopBar = {
    rightButtons,
  };
  if (mythosToggle && Platform.OS === 'ios') {
    topBarOptions.leftButtons = [mythosButton];
  }

  return {
    topBar: topBarOptions,
  };
}

class CardSearchComponent extends React.Component<Props, State> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _navEventListener?: EventSubscription;
  state: State = {
    visible: true,
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.state.visible || nextState.visible;
  }

  componentDidMount() {
    const {
      componentId,
      baseQuery,
      onDeckCountChange,
      mythosToggle,
    } = this.props;

    Navigation.mergeOptions(componentId,
      navigationOptions(
        {
          componentId,
          baseQuery,
          mythosToggle,
          lightButton: !!onDeckCountChange,
        }
      ));
  }

  _clearSearchFilters = () => {
    const {
      componentId,
      clearFilters,
    } = this.props;
    clearFilters(componentId);
  };

  _setFilters = (filters: FilterState) => {
    const {
      componentId,
      syncFilterSet,
    } = this.props;
    syncFilterSet(componentId, filters);
  }

  componentDidUpdate(prevProps: Props) {
    const { mythosMode, mythosToggle, componentId } = this.props;
    if (mythosToggle && mythosMode !== prevProps.mythosMode) {
      Navigation.mergeOptions(componentId, {
        topBar: {
          title: {
            text: mythosMode ? t`Encounter Cards` : t`Player Cards`,
          },
        },
      });
    }
  }

  componentDidAppear() {
    if (!this.state.visible) {
      this.setState({
        visible: true,
        filters: undefined,
      });
    }
  }

  componentDidDisappear() {
    if (this.state.visible) {
      this.setState({
        visible: false,
        filters: this.props.filters,
      });
    }
  }

  _toggleMythosMode = () => {
    const {
      componentId,
      mythosMode,
      toggleMythosMode,
    } = this.props;
    toggleMythosMode(componentId, !mythosMode);
  };

  _onFilterChange = (key: keyof FilterState, value: any) => {
    const { componentId, updateFilter } = this.props;
    updateFilter(componentId, key, value);
  };

  _onToggleChange = (key: keyof FilterState, value: boolean) => {
    const { componentId, toggleFilter } = this.props;
    toggleFilter(componentId, key, value);
  };

  header() {
    const {
      filters,
      deckCardCounts,
      hideVersatile,
      setHideVersatile,
    } = this.props;
    const { typography } = this.context;
    const result: React.ReactElement[] = [];
    if (deckCardCounts) {
      result.push(
        <XpChooser
          key="xp"
          onFilterChange={this._onFilterChange}
          onToggleChange={this._onToggleChange}
          maxLevel={5}
          levels={filters?.level || [0,5]}
          enabled={filters?.levelEnabled || false}
          exceptional={filters?.exceptional || false}
          nonExceptional={filters?.nonExceptional || false}
        />
      );
    }
    if (setHideVersatile) {
      result.push(
        <View style={[styles.row, space.paddingRightS, space.paddingTopS, space.paddingBottomS]}>
          <Text style={[typography.small, styles.searchOption, space.paddingRightS]}>
            { t`Hide versatile cards` }
          </Text>
          <ArkhamSwitch
            value={!!hideVersatile}
            onValueChange={setHideVersatile}
          />
        </View>
      );
    }

    if (!result.length) {
      return undefined;
    }
    return (
      <>
        { result }
      </>
    );
  }

  render() {
    const {
      componentId,
      originalDeckSlots,
      deckCardCounts,
      onDeckCountChange,
      limits,
      renderFooter,
      showNonCollection,
      baseQuery,
      tabooSetOverride,
      investigator,
      filters,
      mythosMode,
      selectedSort,
      storyOnly,
      sort,
      mythosToggle,
    } = this.props;
    const {
      visible,
    } = this.state;
    return (
      <CardSearchResultsComponent
        componentId={componentId}
        baseQuery={baseQuery}
        mythosToggle={mythosToggle}
        mythosMode={mythosMode}
        showNonCollection={showNonCollection}
        selectedSort={selectedSort}
        filters={this.state.filters || filters}
        tabooSetOverride={tabooSetOverride}
        toggleMythosMode={this._toggleMythosMode}
        clearSearchFilters={this._clearSearchFilters}
        investigator={investigator}
        originalDeckSlots={originalDeckSlots}
        deckCardCounts={deckCardCounts}
        onDeckCountChange={onDeckCountChange}
        limits={limits}
        header={this.header()}
        renderFooter={renderFooter}
        visible={visible}
        storyOnly={storyOnly}
        initialSort={sort}
      />
    );
  }
}

function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  return {
    filters: getFilterState(state, props.componentId),
    mythosMode: getMythosMode(state, props.componentId),
    selectedSort: getCardSort(state, props.componentId),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    removeFilterSet,
    clearFilters,
    syncFilterSet,
    toggleMythosMode,
    toggleFilter,
    updateFilter,
  }, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(
  withDimensions(CardSearchComponent)
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  searchOption: {
    marginRight: 2,
  },
  button: {
    flex: 1,
  },
});
