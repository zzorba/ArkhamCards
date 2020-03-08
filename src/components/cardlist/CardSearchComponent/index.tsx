import React, { ReactNode } from 'react';
import { forEach } from 'lodash';
import Realm from 'realm';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { connectRealm, CardResults } from 'react-native-realm';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { t } from 'ttag';

import Card from 'data/Card';
import {
  SortType,
  Slots,
} from 'actions/types';
import CardSearchResultsComponent from '../../cardlist/CardSearchResultsComponent';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import calculateDefaultFilterState from 'components/filter/DefaultFilterState';
import { FilterState } from 'lib/filters';
import { addFilterSet, removeFilterSet, clearFilters, syncFilterSet, toggleMythosMode } from 'components/filter/actions';
import { CardFilterProps } from 'components/filter/withFilterFunctions';
import { iconsMap } from 'app/NavIcons';
import { getTabooSet, getFilterState, getMythosMode, getCardSort, AppState } from 'reducers';
import { COLORS } from 'styles/colors';

interface RealmProps {
  defaultFilterState: FilterState;
}

interface ReduxProps {
  tabooSetId?: number;
  filters?: FilterState;
  mythosMode: boolean;
  selectedSort?: SortType;
}

interface ReduxActionProps {
  clearFilters: (id: string, clearTraits?: string[]) => void;
  addFilterSet: (id: string, filters: FilterState, sort?: SortType, mythosToggle?: boolean) => void;
  syncFilterSet: (id: string, filters: FilterState) => void;
  removeFilterSet: (id: string) => void;
  toggleMythosMode: (id: string, value: boolean) => void;
}

interface OwnProps {
  componentId: string;
  baseQuery?: string;
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
  RealmProps &
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
      addFilterSet,
      defaultFilterState,
      sort,
      baseQuery,
      modal,
      onDeckCountChange,
      mythosToggle,
    } = this.props;
    addFilterSet(componentId, defaultFilterState, sort, mythosToggle);

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

  _showSearchFilters = () => {
    const {
      componentId,
      modal,
      baseQuery,
    } = this.props;
    Navigation.push<CardFilterProps>(componentId, {
      component: {
        name: 'SearchFilters',
        passProps: {
          filterId: componentId,
          baseQuery: baseQuery,
          modal: modal,
        },
        options: {
          topBar: {
            backButton: {
              title: t`Apply`,
            },
            title: {
              text: t`Filters`,
            },
          },
        },
      },
    });
  };

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

  render() {
    const {
      componentId,
      originalDeckSlots,
      deckCardCounts,
      onDeckCountChange,
      limits,
      renderFooter,
      showNonCollection,
      mythosToggle,
      baseQuery,
      tabooSetOverride,
      investigator,
      filters,
      defaultFilterState,
      mythosMode,
      selectedSort,
      storyOnly,
      fontScale,
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
        filters={this.state.filters || filters || defaultFilterState}
        tabooSetOverride={tabooSetOverride}
        toggleMythosMode={this._toggleMythosMode}
        clearSearchFilters={this._clearSearchFilters}
        investigator={investigator}
        originalDeckSlots={originalDeckSlots}
        deckCardCounts={deckCardCounts}
        onDeckCountChange={onDeckCountChange}
        limits={limits}
        renderFooter={renderFooter}
        visible={visible}
        storyOnly={storyOnly}
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
    addFilterSet,
    removeFilterSet,
    clearFilters,
    syncFilterSet,
    toggleMythosMode,
  }, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(connectRealm<OwnProps & ReduxProps & ReduxActionProps, RealmProps, Card>(
  withDimensions(CardSearchComponent), {
    schemas: ['Card'],
    mapToProps(
      results: CardResults<Card>,
      realm: Realm,
      props: OwnProps & ReduxProps
    ) {
      const cards = props.baseQuery ?
        results.cards.filtered(`(${props.baseQuery}) and ${Card.tabooSetQuery(props.tabooSetId)}`) :
        results.cards.filtered(Card.tabooSetQuery(props.tabooSetId));

      return {
        defaultFilterState: calculateDefaultFilterState(cards),
      };
    },
  })
);
