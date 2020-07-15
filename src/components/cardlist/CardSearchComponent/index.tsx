import React, { ReactNode } from 'react';
import { forEach } from 'lodash';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Brackets } from 'typeorm/browser';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { t } from 'ttag';

import {
  SortType,
  Slots,
} from 'actions/types';
import Card from '@data/Card';
import XpChooser from '@components/filter/CardFilterView/XpChooser';
import CardSearchResultsComponent from '@components/cardlist/CardSearchResultsComponent';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import { FilterState } from 'lib/filters';
import { removeFilterSet, clearFilters, syncFilterSet, toggleMythosMode, toggleFilter, updateFilter } from '@components/filter/actions';
import { iconsMap } from 'app/NavIcons';
import { getTabooSet, getFilterState, getMythosMode, getCardSort, AppState } from '@reducers';
import COLORS from '@styles/colors';


interface ReduxProps {
  tabooSetId?: number;
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
class CardSearchComponent extends React.Component<Props, State> {
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
      modal,
      onDeckCountChange,
      mythosToggle,
    } = this.props;

    const rightButtons = [{
      id: 'filter',
      component: {
        name: 'TuneButton',
        passProps: {
          filterId: componentId,
          baseQuery: baseQuery,
          model: modal,
          lightButton: !!onDeckCountChange,
        },
        testID: t`Filters`,
      },
      enabled: true,
      icon: iconsMap.tune,
      color: COLORS.navButton,
    }, {
      id: 'sort',
      component: {
        name: 'SortButton',
        passProps: {
          filterId: componentId,
          lightButton: !!onDeckCountChange,
        },
        testID: t`Filters`,
      },
    }];
    if (mythosToggle) {
      rightButtons.push({
        id: 'mythos',
        component: {
          name: 'MythosButton',
          passProps: {
            filterId: componentId,
            lightButton: !!onDeckCountChange,
          },
          testID: t`Show Encounter Cards`,
        },
      });
    }
    if (onDeckCountChange) {
      forEach(rightButtons, button => {
        button.color = 'white';
      });
    }

    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons,
      },
    });
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

  _renderHeader = () => {
    const { filters } = this.props;
    return (
      <XpChooser
        onFilterChange={this._onFilterChange}
        onToggleChange={this._onToggleChange}
        maxLevel={5}
        levels={filters?.level || [0,5]}
        enabled={filters?.levelEnabled || false}
        exceptional={filters?.exceptional || false}
        nonExceptional={filters?.nonExceptional || false}
      />
    );
  };

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
      fontScale,
      sort,
      mythosToggle,
    } = this.props;
    const {
      visible,
    } = this.state;
    return (
      <CardSearchResultsComponent
        componentId={componentId}
        fontScale={fontScale}
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
        renderHeader={deckCardCounts ? this._renderHeader : undefined}
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
    tabooSetId: getTabooSet(state, props.tabooSetOverride),
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
