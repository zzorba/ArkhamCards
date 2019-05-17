import React, { ReactNode } from 'react';
import { forEach, isEqual, map } from 'lodash';
import Realm from 'realm';
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
import { CardFilterProps } from '../filter/withFilterFunctions';
import { iconsMap } from '../../app/NavIcons';
import { getTabooSet, AppState } from '../../reducers';
import { COLORS } from '../../styles/colors';

interface RealmProps {
  defaultFilterState: FilterState;
}

interface ReduxProps {
  tabooSetId?: number;
}

interface OwnProps {
  componentId: string;
  baseQuery?: string;
  mythosToggle?: boolean;
  sort?: SortType;
  showNonCollection?: boolean;
  tabooSetOverride?: number;

  originalDeckSlots?: Slots;
  deckCardCounts?: Slots;
  onDeckCountChange?: (code: string, count: number) => void;
  limits?: Slots;
  footer?: ReactNode;
  modal?: boolean;
}

type Props = OwnProps & RealmProps & ReduxProps;

interface State {
  selectedSort: SortType;
  filters: FilterState;
  mythosMode: boolean;
  visible: boolean;
  rightButtonIds: string[];
}
class CardSearchComponent extends React.Component<Props, State> {
  _navEventListener?: EventSubscription;

  constructor(props: Props) {
    super(props);

    const rightButtons = [{
      id: 'filter',
      component: {
        name: 'TuneButton',
        passProps: {
          onPress: this._showSearchFilters,
          filters: props.defaultFilterState,
          defaultFilters: props.defaultFilterState,
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
      filters: props.defaultFilterState,
      mythosMode: false,
      visible: true,
      rightButtonIds: map(rightButtons, button => button.id),
    };

    Navigation.mergeOptions(props.componentId, {
      topBar: {
        rightButtons,
      },
    });
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  _clearSearchFilters = () => {
    const {
      defaultFilterState,
    } = this.props;
    this.setState({
      filters: defaultFilterState,
    });
  };

  _setFilters = (filters: FilterState) => {
    this.setState({
      filters: filters,
    });
    this._syncNavigationButtons(this.state.mythosMode, filters, true);
  };

  _sortChanged = (selectedSort: SortType) => {
    this.setState({
      selectedSort,
    });
  };

  _showSearchFilters = () => {
    const {
      componentId,
      defaultFilterState,
      modal,
      baseQuery,
    } = this.props;
    Navigation.push<CardFilterProps>(componentId, {
      component: {
        name: 'SearchFilters',
        passProps: {
          applyFilters: this._setFilters,
          defaultFilterState: defaultFilterState,
          currentFilters: this.state.filters,
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
    this.setState({
      visible: true,
    });
  }

  componentDidDisappear() {
    this.setState({
      visible: false,
    });
  }

  _syncNavigationButtons = (mythosMode: boolean, filters: FilterState, filtersChanged?: boolean) => {
    const {
      componentId,
      onDeckCountChange,
      defaultFilterState,
      mythosToggle,
    } = this.props;
    const rightButtons = [{
      id: 'filter',
      component: {
        name: 'TuneButton',
        passProps: {
          onPress: this._showSearchFilters,
          filters: filters,
          defaultFilters: defaultFilterState,
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
    if (filtersChanged || !isEqual(rightButtonIds, this.state.rightButtonIds)) {
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
      filters,
    } = this.state;
    this.setState({
      mythosMode: !mythosMode,
    });
    this._syncNavigationButtons(!mythosMode, filters);
  };

  render() {
    const {
      componentId,
      originalDeckSlots,
      deckCardCounts,
      onDeckCountChange,
      limits,
      footer,
      showNonCollection,
      mythosToggle,
      baseQuery,
      tabooSetOverride,
    } = this.props;
    const {
      selectedSort,
      visible,
      mythosMode,
      filters,
    } = this.state;
    return (
      <CardSearchResultsComponent
        componentId={componentId}
        baseQuery={baseQuery}
        mythosToggle={mythosToggle}
        mythosMode={mythosMode}
        showNonCollection={showNonCollection}
        selectedSort={selectedSort}
        filters={filters}
        tabooSetOverride={tabooSetOverride}
        toggleMythosMode={this._toggleMythosMode}
        clearSearchFilters={this._clearSearchFilters}
        originalDeckSlots={originalDeckSlots}
        deckCardCounts={deckCardCounts}
        onDeckCountChange={onDeckCountChange}
        limits={limits}
        footer={footer}
        visible={visible}
      />
    );
  }
}

function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  return {
    tabooSetId: getTabooSet(state, props.tabooSetOverride),
  };
}

export default connect<ReduxProps, {}, OwnProps, AppState>(
  mapStateToProps
)(connectRealm<OwnProps & ReduxProps, RealmProps, Card>(
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
