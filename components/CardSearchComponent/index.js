import React from 'react';
import PropTypes from 'prop-types';
import { forEach } from 'lodash';
import {
  Keyboard,
} from 'react-native';
import { connectRealm } from 'react-native-realm';
import { Navigation } from 'react-native-navigation';

import L from '../../app/i18n';
import {
  SORT_BY_TYPE,
} from '../CardSortDialog/constants';
import CardSearchResultsComponent from '../CardSearchResultsComponent';
import { iconsMap } from '../../app/NavIcons';
import calculateDefaultFilterState from '../filter/DefaultFilterState';

class CardSearchComponent extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    // Function that takes 'realm' and gives back a base query.
    defaultFilterState: PropTypes.object,
    baseQuery: PropTypes.string,
    mythosToggle: PropTypes.bool,
    sort: PropTypes.string,
    showNonCollection: PropTypes.bool,

    // Keyed by code, count of current deck.
    originalDeckSlots: PropTypes.object,
    deckCardCounts: PropTypes.object,
    onDeckCountChange: PropTypes.func,
    limits: PropTypes.object,
    footer: PropTypes.node,
    modal: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedSort: props.sort || SORT_BY_TYPE,
      filters: props.defaultFilterState,
      mythosMode: false,
      visible: true,
    };

    this._toggleMythosMode = this.toggleMythosMode.bind(this);
    this._sortChanged = this.sortChanged.bind(this);
    this._setFilters = this.setFilters.bind(this);
    this._clearSearchFilters = this.clearSearchFilters.bind(this);
    this._showSearchFilters = this.showSearchFilters.bind(this);
    this._showSortDialog = this.showSortDialog.bind(this);
    this._syncNavigationButtons = this.syncNavigationButtons.bind(this);

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
      },
      enabled: true,
      icon: iconsMap.tune,
      color: COLORS.navButton,
    },{
      icon: iconsMap['sort-by-alpha'],
      id: 'sort',
      color: COLORS.navButton,
    }];
    if (props.mythosToggle) {
      rightButtons.push({
        icon: iconsMap.auto_fail,
        id: 'mythos',
        color: COLORS.navButton,
      });
    }
    if (props.onDeckCountChange) {
      forEach(rightButtons, button => {
        button.color = 'white';
      });
    }
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        rightButtons,
      },
    });
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  toggleSearchMode(mode) {
    this.setState({
      [mode]: !this.state[mode],
    });
  }

  clearSearchFilters() {
    const {
      defaultFilterState,
    } = this.props;
    this.setState({
      filters: defaultFilterState,
    });
  }

  setFilters(filters) {
    this.setState({
      filters: filters,
    });
    this.syncNavigationButtons(this.state.mythosMode, filters);
  }

  sortChanged(selectedSort) {
    this.setState({
      selectedSort,
    });
  }

  showSearchFilters() {
    const {
      componentId,
      defaultFilterState,
      modal,
      baseQuery,
    } = this.props;
    Navigation.push(componentId, {
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
              title: L('Apply'),
            },
            title: {
              text: L('Filters'),
            },
          },
        },
      },
    });
  }

  showSortDialog() {
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
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'filter') {
      this._showSearchFilters();
    } else if (buttonId === 'sort') {
      this._showSortDialog();
    } else if (buttonId === 'mythos') {
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

  syncNavigationButtons(mythosMode, filters) {
    const {
      componentId,
      onDeckCountChange,
      defaultFilterState,
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
    }, {
      icon: iconsMap['sort-by-alpha'],
      id: 'sort',
      color: onDeckCountChange ? 'white' : COLORS.navButton,
    }, {
      icon: mythosMode ? iconsMap.per_investigator : iconsMap.auto_fail,
      id: 'mythos',
      color: onDeckCountChange ? 'white' : COLORS.navButton,
    }];

    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: mythosMode ? L('Encounter Cards') : L('Player Cards'),
        },
        rightButtons,
      },
    });
  }

  toggleMythosMode() {
    const {
      mythosMode,
      filters,
    } = this.state;
    this.setState({
      mythosMode: !mythosMode,
    });
    this.syncNavigationButtons(!mythosMode, filters);
  }

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
        sort={selectedSort}
        showNonCollection={showNonCollection}
        selectedSort={selectedSort}
        filters={filters}
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

export default connectRealm(CardSearchComponent, {
  schemas: ['Card'],
  mapToProps(results, realm, props) {
    const cards = props.baseQuery ?
      results.cards.filtered(props.baseQuery) :
      results.cards;

    return {
      defaultFilterState: calculateDefaultFilterState(cards),
    };
  },
});
