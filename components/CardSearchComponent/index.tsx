import React, { ReactNode } from 'react';
import { forEach, isEqual, map } from 'lodash';
import Realm from 'realm';
import { bindActionCreators, Dispatch, Action } from 'redux';
import {
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import { connectRealm, CardResults } from 'react-native-realm';
import { Navigation, EventSubscription, OptionsTopBar } from 'react-native-navigation';

import { t } from 'ttag';
import Card from '../../data/Card';
import { Slots } from '../../actions/types';
import {
  SORT_BY_TYPE,
  SortType,
} from '../CardSortDialog/constants';
import CardSearchResultsComponent from '../CardSearchResultsComponent';
import calculateDefaultFilterState from '../filter/DefaultFilterState';
import { FilterState } from '../../lib/filters';
import { addFilterSet, removeFilterSet, clearFilters, syncFilterSet } from '../filter/actions';
import { CardFilterProps } from '../filter/withFilterFunctions';
import { iconsMap } from '../../app/NavIcons';
import { getTabooSet, getFilterState, AppState } from '../../reducers';
import { COLORS } from '../../styles/colors';

interface RealmProps {
  defaultFilterState: FilterState;
}

interface ReduxProps {
  tabooSetId?: number;
  filters?: FilterState;
}

interface ReduxActionProps {
  clearFilters: (id: string, clearTraits?: string[]) => void;
  addFilterSet: (id: string, filters: FilterState) => void;
  syncFilterSet: (id: string, filters: FilterState) => void;
  removeFilterSet: (id: string) => void;
}

interface OwnProps {
  componentId: string;
  baseQuery?: string;
  mythosToggle?: boolean;
  sort?: SortType;
  showNonCollection?: boolean;
  tabooSetOverride?: number;

  investigator?: Card;
  originalDeckSlots?: Slots;
  deckCardCounts?: Slots;
  onDeckCountChange?: (code: string, count: number) => void;
  limits?: Slots;
  renderFooter?: (slots?: Slots, controls?: React.ReactNode) => ReactNode;
  modal?: boolean;
}

type Props = OwnProps & RealmProps & ReduxProps & ReduxActionProps;

interface State {
  selectedSort: SortType;
  mythosMode: boolean;
  visible: boolean;
  rightButtonIds: string[];
  filters?: FilterState;
}
class CardSearchComponent extends React.Component<Props, State> {
  static whyDidYouRender = true;
  _navEventListener?: EventSubscription;

  constructor(props: Props) {
    super(props);

    const rightButtons = [{
      id: 'filter',
      component: {
        name: 'TuneButton',
        passProps: {
          onPress: this._showSearchFilters,
          filterId: props.componentId,
          lightButton: !!props.onDeckCountChange,
        },
        testID: t`Filters`,
      },
      enabled: true,
      icon: iconsMap.tune,
      color: COLORS.navButton,
    },{
      icon: iconsMap['sort-by-alpha'],
      id: 'sort',
      color: COLORS.navButton,
      testID: t`Sort`,
    }];
    if (props.mythosToggle) {
      rightButtons.push({
        icon: iconsMap.auto_fail,
        id: 'mythos',
        color: COLORS.navButton,
        testID: t`Show Encounter Cards`,
      });
    }
    if (props.onDeckCountChange) {
      forEach(rightButtons, button => {
        button.color = 'white';
      });
    }

    this.state = {
      selectedSort: props.sort || SORT_BY_TYPE,
      mythosMode: false,
      visible: true,
      rightButtonIds: map(rightButtons, button => button.id),
    };

    Navigation.mergeOptions(props.componentId, {
      topBar: {
        rightButtons,
      },
    });
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.state.visible || nextState.visible;
  }

  componentDidMount() {
    const {
      componentId,
      addFilterSet,
      defaultFilterState,
    } = this.props;
    addFilterSet(componentId, defaultFilterState);
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  _clearSearchFilters = () => {
    const {
      componentId,
      clearFilters,
    } = this.props;
    clearFilters(componentId);
  };

  _sortChanged = (selectedSort: SortType) => {
    this.setState({
      selectedSort,
    });
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

  _showSortDialog = () => {
    Keyboard.dismiss();
    Navigation.showOverlay({
      component: {
        name: 'Dialog.Sort',
        passProps: {
          sortChanged: this._sortChanged,
          selectedSort: this.state.selectedSort,
          hasEncounterCards: this.state.mythosMode,
        },
        options: {
          layout: {
            backgroundColor: 'rgba(128,128,128,.75)',
          },
        },
      },
    });
  };

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'filter') {
      this._showSearchFilters();
    } else if (buttonId === 'sort') {
      this._showSortDialog();
    } else if (buttonId === 'mythos' || buttonId === 'investigator') {
      this._toggleMythosMode();
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

  _syncNavigationButtons = (mythosMode: boolean) => {
    const {
      componentId,
      onDeckCountChange,
      mythosToggle,
    } = this.props;
    const rightButtons = [{
      id: 'filter',
      component: {
        name: 'TuneButton',
        passProps: {
          onPress: this._showSearchFilters,
          filterId: componentId,
          lightButton: !!onDeckCountChange,
        },
      },
      testID: t`Filters`,
    }, {
      icon: iconsMap['sort-by-alpha'],
      id: 'sort',
      color: onDeckCountChange ? 'white' : COLORS.navButton,
      testID: t`Sort`,
    }];
    const topBar: OptionsTopBar = {};
    if (mythosToggle) {
      rightButtons.push({
        icon: mythosMode ? iconsMap.per_investigator : iconsMap.auto_fail,
        id: mythosMode ? 'investigator' : 'mythos',
        color: onDeckCountChange ? 'white' : COLORS.navButton,
        testID: mythosMode ? t`Show Player Cards` : t`Show Encounter Cards`,
      });
      topBar.title = {
        text: mythosMode ? t`Encounter Cards` : t`Player Cards`,
      };
    }
    topBar.rightButtons = rightButtons;

    const rightButtonIds = map(rightButtons, button => button.id);
    if (!isEqual(rightButtonIds, this.state.rightButtonIds)) {
      Navigation.mergeOptions(componentId, {
        topBar,
      });
      this.setState({
        rightButtonIds,
      });
    }
  };

  _toggleMythosMode = () => {
    const {
      mythosMode,
    } = this.state;
    this.setState({
      mythosMode: !mythosMode,
    });
    this._syncNavigationButtons(!mythosMode);
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
    } = this.props;
    const {
      selectedSort,
      visible,
      mythosMode,
    } = this.state;
    return (
      <CardSearchResultsComponent
        componentId={componentId}
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
      />
    );
  }
}

function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  return {
    tabooSetId: getTabooSet(state, props.tabooSetOverride),
    filters: getFilterState(state, props.componentId),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    addFilterSet,
    removeFilterSet,
    clearFilters,
    syncFilterSet,
  }, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(connectRealm<OwnProps & ReduxProps & ReduxActionProps, RealmProps, Card>(
  CardSearchComponent, {
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
